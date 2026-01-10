package deobf

import (
	"fmt"
	"os"
	"regexp"
	"strconv"
	"strings"

	"github.com/t14raptor/go-fast/ast"
	"github.com/t14raptor/go-fast/generator"
)

type stringReplacerGather struct {
	ast.NoopVisitor
	funcName    string
	offset      int
	stringArray []string
	shuffleExpr *ast.Statement
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

	eStmt, ok := n.Function.Body.List[0].Stmt.(*ast.ExpressionStatement)
	if !ok {
		return
	}

	aExpr, ok := eStmt.Expression.Expr.(*ast.AssignExpression)
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

func (v *stringReplacerGather) VisitForStatement(n *ast.ForStatement) {
	n.VisitChildrenWith(v)

	_, ok := n.Body.Stmt.(*ast.TryStatement)
	if !ok {
		return
	}

	if !strings.Contains(generator.Generate(n), "parseInt") { //just to be sure
		return
	}

	v.shuffleExpr = n.Body
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

var normalRe = regexp.MustCompile(`^[0-9][a-zA-Z0-9+\-*/%()=<>!&|^.,\s]*$`)
var shuffleCheckerRe = regexp.MustCompile(`parseInt\(.\((\d*?)\)\)`)

func ReplaceStrings(p *ast.Program, id *ast.Identifier) {
	f := &stringReplacerGather{
		funcName: id.Name,
	}
	f.V = f
	p.VisitWith(f)

	matches := shuffleCheckerRe.FindAllStringSubmatch(generator.Generate(f.shuffleExpr), -1)
	var out []int
	for _, m := range matches {
		num := m[1]
		val, err := strconv.ParseInt(num, 0, 64)
		if err != nil {
			fmt.Fprintln(os.Stderr, "parse error:", err)
			continue
		}
		out = append(out, int(val))
	}

outer:
	for {
		for _, entry := range out {
			text := f.stringArray[entry+f.offset]
			if !normalRe.MatchString(text) {
				f.stringArray = append(f.stringArray[1:], f.stringArray[0])
				continue outer
			}
		}
		break
	}

	f2 := &stringReplacer{
		funcName:    id.Name,
		offset:      f.offset,
		stringArray: f.stringArray,
	}
	f2.V = f2
	p.VisitWith(f2)
}
