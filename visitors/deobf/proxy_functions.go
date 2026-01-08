package deobf

import (
	"github.com/t14raptor/go-fast/ast"
	"github.com/t14raptor/go-fast/token"
)

type functionCalls int

const (
	callWithParams functionCalls = iota
	callWithoutParams
)

type mathType struct {
	operator token.Token
}

type proxySimplify struct {
	ast.NoopVisitor
	proxy map[ast.Id]map[string]any
}

type proxySimplifier struct {
	ast.NoopVisitor
	proxy map[ast.Id]map[string]any
}

func (v *proxySimplify) VisitExpression(n *ast.Expression) {
	n.VisitChildrenWith(v)

	switch n.Expr.(type) {
	case *ast.MemberExpression:
		compProp, ok := n.Expr.(*ast.MemberExpression).Property.Prop.(*ast.ComputedProperty)
		if !ok {
			return
		}

		strLit, ok := compProp.Expr.Expr.(*ast.StringLiteral)
		if !ok {
			return
		}

		if len(strLit.Value) != 5 {
			return
		}

		n.Expr.(*ast.MemberExpression).Property.Prop = &ast.Identifier{
			Name: strLit.Value,
		}
	}

}

func (v *proxySimplify) VisitVariableDeclarator(n *ast.VariableDeclarator) {
	n.VisitChildrenWith(v)

	if n.Initializer == nil {
		return
	}
	obj, ok := n.Initializer.Expr.(*ast.ObjectLiteral)
	if !ok {
		return
	}

	target, ok := n.Target.Target.(*ast.Identifier)
	if !ok {
		return
	}
	id := target.ToId()
	if _, ok := v.proxy[id]; !ok {
		v.proxy[id] = map[string]any{}
	}

	for _, val := range obj.Value {
		key, ok := val.Prop.(*ast.PropertyKeyed)
		if !ok {
			continue
		}

		strLit, ok := key.Key.Expr.(*ast.StringLiteral)
		if !ok {
			continue
		}

		switch key.Value.Expr.(type) {
		case *ast.StringLiteral:
			v.proxy[id][strLit.Value] = key.Value.Expr.(*ast.StringLiteral).Value

		case *ast.FunctionLiteral:
			// identify what type of function it is
			functionExpr := key.Value.Expr.(*ast.FunctionLiteral)
			if len(functionExpr.Body.List) != 1 {
				continue
			}
			// make sure body[0] is a return statement
			returnStmt, ok := functionExpr.Body.List[0].Stmt.(*ast.ReturnStatement)
			if !ok {
				continue
			}
			// make sure return statement has an argument
			if returnStmt.Argument == nil {
				continue
			}
			// now identify the type of return stmt it is (math, func call, func call with params)
			switch returnStmt.Argument.Expr.(type) {
			case *ast.BinaryExpression:
				binExpr := returnStmt.Argument.Expr.(*ast.BinaryExpression)
				v.proxy[id][strLit.Value] = &mathType{
					operator: binExpr.Operator,
				}
			case *ast.CallExpression:
				callExpr := returnStmt.Argument.Expr.(*ast.CallExpression)
				// check if the callExpr has params
				if len(callExpr.ArgumentList) > 0 {
					v.proxy[id][strLit.Value] = callWithParams
				} else {
					v.proxy[id][strLit.Value] = callWithoutParams
				}
			}
		}
	}
}

func (v *proxySimplifier) VisitExpression(n *ast.Expression) {
	n.VisitChildrenWith(v)
	memExpr := &ast.MemberExpression{}
	var ok bool
	callExpr, ok := n.Expr.(*ast.CallExpression)
	if !ok {
		memExpr, ok = n.Expr.(*ast.MemberExpression)
		if !ok {
			return
		}
	} else {
		memExpr, ok = callExpr.Callee.Expr.(*ast.MemberExpression)
		if !ok {
			return
		}
	}

	obj, ok := memExpr.Object.Expr.(*ast.Identifier)
	if !ok {
		return
	}
	id := obj.ToId()

	switch memExpr.Property.Prop.(type) {
	case *ast.Identifier:
		idProp, ok := memExpr.Property.Prop.(*ast.Identifier)
		if !ok {
			return
		}
		if _, ok := v.proxy[id]; !ok {
			return
		}
		val := v.proxy[id][idProp.Name]
		if val == nil {
			return
		}
		arguments := []ast.Expression{}
		if callExpr != nil {
			arguments = callExpr.ArgumentList
		}
		switch val.(type) {
		case string:
			n.Expr = &ast.StringLiteral{Value: val.(string)}
		case *mathType:
			if callExpr == nil {
				return
			}
			mathType := val.(*mathType)
			n.Expr = &ast.BinaryExpression{
				Operator: mathType.operator,
				Left:     &arguments[0],
				Right:    &arguments[1],
			}
		case functionCalls:
			if callExpr == nil {
				return
			}
			switch val {
			case callWithParams:
				n.Expr = &ast.CallExpression{
					Callee:       &arguments[0],
					ArgumentList: arguments[1:],
				}
			case callWithoutParams:
				n.Expr = &ast.CallExpression{
					Callee: &arguments[0],
				}
			}
		}
	}
}

func UnrollProxyFunctions(p *ast.Program) {
	f := &proxySimplify{
		proxy: map[ast.Id]map[string]any{},
	}
	f.V = f
	p.VisitWith(f)

	f2 := &proxySimplifier{
		proxy: f.proxy,
	}
	f2.V = f2
	p.VisitWith(f2)
}
