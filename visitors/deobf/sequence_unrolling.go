package deobf

//copy of https://yoghurtbot-io.gitbook.io/go-fast/examples/unroll-sequence-expression
import "github.com/t14raptor/go-fast/ast"

type unroll2Visitor struct {
	ast.NoopVisitor

	stmts *ast.Statements
	index int
}

func (v *unroll2Visitor) insert(n int, seq ast.Expressions, trimLast bool) {
	if trimLast {
		// Trim the last statement of the slice if needed.
		n--
		seq = seq[:len(seq)-1]
	}

	// Create a larger slice of statements to insert the expressions.
	newStmts := make(ast.Statements, len(*v.stmts)+n)

	// Copy over the old statements but have room to insert the expressions later.
	// Note: This is all equivalent to slices.Insert(*v.stmts, v.index, seqStmts...),
	// but we do this instead to reduce heap allocations.
	copy(newStmts[:v.index], (*v.stmts)[:v.index])
	copy(newStmts[v.index+n:], (*v.stmts)[v.index:])

	// Insert expressions as expression statements into the new slice.
	for i := range seq {
		newStmts[v.index+i].Stmt = &ast.ExpressionStatement{Expression: &seq[i]}
	}

	// Shift the index to account for the recently inserted expressions from sequences.
	v.index += n

	*v.stmts = newStmts
}

func (v *unroll2Visitor) VisitStatements(n *ast.Statements) {
	parent, parentIndex := v.stmts, v.index

	// Track the current statements and the current index to know where to insert
	// statements for unrolling.
	v.stmts = n
	for v.index = 0; v.index < len(*v.stmts); v.index++ {
		(*v.stmts)[v.index].VisitWith(v)
	}

	v.stmts, v.index = parent, parentIndex
}

func (v *unroll2Visitor) VisitExpressionStatement(n *ast.ExpressionStatement) {
	n.VisitChildrenWith(v)

	switch expr := n.Expression.Expr.(type) {
	// This case unrolls basic sequence expressions.
	// Input:
	// ```js
	// (x, y, z);
	// ```
	// Output:
	// ```js
	// x;
	// y;
	// z;
	// ```
	case *ast.SequenceExpression:
		v.insert(len(expr.Sequence)-1, expr.Sequence, false)
	// This case unrolls sequence expressions inside of assign expressions.
	// Input:
	// ```js
	// w = (x, y, z);
	// ```
	// Output:
	// ```js
	// x;
	// y;
	// w = z;
	// ```
	case *ast.AssignExpression:
		if seq, ok := expr.Right.Expr.(*ast.SequenceExpression); ok {
			expr.Right = &seq.Sequence[len(seq.Sequence)-1]

			v.insert(len(seq.Sequence), seq.Sequence, true)
		}
	}
}

// VisitThrowStatement unrolls sequence expressions inside of throw statements.
// Input:
// ```js
// throw (x, y, z);
// ```
// Output:
// ```js
// x;
// y;
// throw z;
// ```
func (v *unroll2Visitor) VisitThrowStatement(n *ast.ThrowStatement) {
	n.VisitChildrenWith(v)

	if seq, ok := n.Argument.Expr.(*ast.SequenceExpression); ok {
		n.Argument = &seq.Sequence[len(seq.Sequence)-1]

		v.insert(len(seq.Sequence), seq.Sequence, true)
	}
}

// VisitSwitchStatement unrolls sequence expressions inside of switch statements.
// Input:
// ```js
// switch ((x, y, z)) {}
// ```
// Output:
// ```js
// x;
// y;
// switch (z) {}
// ```
func (v *unroll2Visitor) VisitSwitchStatement(n *ast.SwitchStatement) {
	n.VisitChildrenWith(v)

	if seq, ok := n.Discriminant.Expr.(*ast.SequenceExpression); ok {
		n.Discriminant = &seq.Sequence[len(seq.Sequence)-1]

		v.insert(len(seq.Sequence), seq.Sequence, true)
	}
}

// VisitReturnStatement unrolls sequence expressions inside of return statements.
// Input:
// ```js
// return (x, y, z);
// ```
// Output:
// ```js
// x;
// y;
// return z;
// ```
func (v *unroll2Visitor) VisitReturnStatement(n *ast.ReturnStatement) {
	n.VisitChildrenWith(v)
	if n.Argument == nil {
		return
	}

	if seq, ok := n.Argument.Expr.(*ast.SequenceExpression); ok {
		n.Argument = &seq.Sequence[len(seq.Sequence)-1]

		v.insert(len(seq.Sequence), seq.Sequence, true)
	}
}

// VisitIfStatement unrolls sequence expressions inside of if statements.
// Input:
// ```js
// if (x, y, z) {}
// ```
// Output:
// ```js
// x;
// y;
// if (z) {}
// ```
func (v *unroll2Visitor) VisitIfStatement(n *ast.IfStatement) {
	n.VisitChildrenWith(v)

	if seq, ok := n.Test.Expr.(*ast.SequenceExpression); ok {
		n.Test = &seq.Sequence[len(seq.Sequence)-1]

		v.insert(len(seq.Sequence), seq.Sequence, true)
	}
}

func SequenceUnroller(p *ast.Program) {
	f := &unroll2Visitor{}
	f.V = f
	p.VisitWith(f)
}
