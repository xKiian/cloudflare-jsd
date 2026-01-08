package deobf

import (
	"github.com/t14raptor/go-fast/ast"
)

type concatStrings struct {
	ast.NoopVisitor
}

func (v *concatStrings) VisitExpression(n *ast.Expression) {
	n.VisitChildrenWith(v)

	binExpr, ok := n.Expr.(*ast.BinaryExpression)
	if !ok {
		return
	}

	leftLit, ok := binExpr.Left.Expr.(*ast.StringLiteral)
	if !ok {
		return
	}
	rightLit, ok := binExpr.Right.Expr.(*ast.StringLiteral)
	if !ok {
		return
	}

	result := leftLit.Value + rightLit.Value

	n.Expr = &ast.StringLiteral{Value: result}
}

func ConcatStrings(p *ast.Program) {
	f := &concatStrings{}
	f.V = f
	p.VisitWith(f)
}
