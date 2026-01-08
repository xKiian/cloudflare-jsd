package deobf

import (
	"github.com/t14raptor/go-fast/ast"
)

type deobf struct {
	ast.NoopVisitor
	numberMap map[ast.Id]map[string]float64
}

func (v *deobf) VisitExpression(n *ast.Expression) {
	n.VisitChildrenWith(v)
	switch n.Expr.(type) {
	case *ast.AssignExpression:
		expr := n.Expr.(*ast.AssignExpression)
		if expr.Operator.String() != "=" {
			return
		}

		obj, ok := expr.Right.Expr.(*ast.ObjectLiteral)
		if !ok {
			return
		}

		left, ok := expr.Left.Expr.(*ast.Identifier)
		if !ok {
			return
		}

		for _, entry := range obj.Value {
			prop, ok := entry.Prop.(*ast.PropertyKeyed)
			if !ok {
				return
			}
			numLit, ok := prop.Value.Expr.(*ast.NumberLiteral)
			if !ok {
				continue
			}

			strLit, ok := prop.Key.Expr.(*ast.StringLiteral)
			if !ok {
				continue
			}

			id := left.ToId()
			if v.numberMap[id] == nil {
				v.numberMap[id] = make(map[string]float64)
			}
			v.numberMap[id][strLit.Value] = numLit.Value
			n.Expr = &ast.BooleanLiteral{Value: true}
		}
	case *ast.MemberExpression:
		expr := n.Expr.(*ast.MemberExpression)
		id, ok := expr.Object.Expr.(*ast.Identifier)
		if !ok {
			return
		}

		prop, ok := expr.Property.Prop.(*ast.Identifier)
		if !ok {
			return
		}

		propMap := v.numberMap[id.ToId()]
		if propMap == nil {
			return
		}

		val := propMap[prop.Name]
		n.Expr = &ast.NumberLiteral{
			Value: val,
		}
	}
}

func UnrollMaps(p *ast.Program) {
	f := &deobf{
		numberMap: make(map[ast.Id]map[string]float64),
	}
	f.V = f
	p.VisitWith(f)
}
