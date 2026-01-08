package deobf

import (
	"strings"

	"github.com/t14raptor/go-fast/ast"
)

type stringReplacerGather struct {
	ast.NoopVisitor
	funcName    string
	offset      int
	stringArray []string
}

func (v *stringReplacerGather) VisitCallExpression(n *ast.CallExpression) {
	n.VisitChildrenWith(v)

	callee, ok := n.Callee.Expr.(*ast.MemberExpression)
	if !ok {
		return
	}
	obj, ok := callee.Object.Expr.(*ast.StringLiteral)
	if !ok {
		return
	}
	if len(obj.Value) < 900 {
		return
	}

	v.stringArray = strings.Split(obj.Value, ",")
}

func (v *stringReplacerGather) VisitFunctionDeclaration(n *ast.FunctionDeclaration) {
	n.VisitChildrenWith(v)

	if n.Function.Name.Name != v.funcName {
		return
	}

	rStmt, ok := n.Function.Body.List[0].Stmt.(*ast.ReturnStatement)
	if !ok {
		return
	}

	sExpr, ok := rStmt.Argument.Expr.(*ast.SequenceExpression)
	if !ok {
		return
	}

	aExpr, ok := sExpr.Sequence[0].Expr.(*ast.AssignExpression)
	if !ok {
		return
	}

	binExpr, ok := aExpr.Right.Expr.(*ast.BinaryExpression)
	if !ok {
		return
	}
	right, ok := binExpr.Right.Expr.(*ast.NumberLiteral)
	if !ok {
		return
	}

	val := right.Value
	if binExpr.Operator.String() == "-" {
		val *= -1
	}

	v.offset = int(val)
}

type stringReplacer struct {
	ast.NoopVisitor
	funcName    string
	offset      int
	stringArray []string
}

func (v *stringReplacer) VisitExpression(n *ast.Expression) {
	n.VisitChildrenWith(v)
	callExpr, ok := n.Expr.(*ast.CallExpression)
	if !ok {
		return
	}

	identifier, ok := callExpr.Callee.Expr.(*ast.Identifier)
	if !ok {
		return
	}

	if identifier.Name != v.funcName {
		return
	}

	if len(callExpr.ArgumentList) != 1 {
		return
	}

	numExpr, ok := callExpr.ArgumentList[0].Expr.(*ast.NumberLiteral)
	if !ok {
		return
	}

	n.Expr = &ast.StringLiteral{
		Value: v.stringArray[int(numExpr.Value)+v.offset],
	}
}

func ReplaceStrings(p *ast.Program, id *ast.Identifier) {
	f := &stringReplacerGather{
		funcName: id.Name,
	}
	f.V = f
	p.VisitWith(f)

	f2 := &stringReplacer{
		funcName:    id.Name,
		offset:      f.offset,
		stringArray: f.stringArray,
	}
	f2.V = f2
	p.VisitWith(f2)
}
