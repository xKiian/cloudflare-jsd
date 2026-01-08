package deobf

import (
	"github.com/t14raptor/go-fast/ast"
)

type gather struct {
	ast.NoopVisitor
	Decls map[ast.Id]*ast.Identifier
}

func (v *gather) VisitAssignExpression(n *ast.AssignExpression) {
	n.VisitChildrenWith(v)
	if n.Right == nil || n.Left == nil {
		return
	}
	rid, ok := n.Right.Expr.(*ast.Identifier)
	if !ok {
		return
	}
	lid, ok := n.Left.Expr.(*ast.Identifier)
	if !ok {
		return
	}
	if lid.ToId() == rid.ToId() {
		return
	}
	v.Decls[lid.ToId()] = rid
}

func resolveRoot(decls map[ast.Id]*ast.Identifier, id *ast.Identifier) *ast.Identifier {
	if id == nil {
		return nil
	}
	seen := make(map[ast.Id]struct{}, 8)
	cur := id
	for {
		cid := cur.ToId()
		if _, ok := seen[cid]; ok {
			return id
		}
		seen[cid] = struct{}{}
		nxt := decls[cid]
		if nxt == nil {
			return cur
		}
		cur = nxt
	}
}

func collapseReassignments(decls map[ast.Id]*ast.Identifier) {
	for k, v := range decls {
		decls[k] = resolveRoot(decls, v)
	}
}

type replace struct {
	ast.NoopVisitor
	decls map[ast.Id]*ast.Identifier
}

func (v *replace) VisitExpression(n *ast.Expression) {
	n.VisitChildrenWith(v)
	id, ok := n.Expr.(*ast.Identifier)
	if !ok {
		return
	}
	val := v.decls[id.ToId()]
	if val == nil {
		return
	}
	n.Expr = val
}

type callCounter struct {
	ast.NoopVisitor
	decls  map[ast.Id]*ast.Identifier
	counts map[ast.Id]int
	repr   map[ast.Id]*ast.Identifier
}

func (v *callCounter) VisitCallExpression(n *ast.CallExpression) {
	n.VisitChildrenWith(v)

	id, ok := n.Callee.Expr.(*ast.Identifier)
	if !ok {
		return
	}
	root := resolveRoot(v.decls, id)
	if root == nil {
		return
	}
	rid := root.ToId()
	v.counts[rid]++
	if v.repr[rid] == nil {
		v.repr[rid] = root
	}
}

func ReplaceReassignments(p *ast.Program) *ast.Identifier {
	g := &gather{Decls: make(map[ast.Id]*ast.Identifier)}
	g.V = g
	p.VisitWith(g)

	collapseReassignments(g.Decls)

	cc := &callCounter{
		decls:  g.Decls,
		counts: make(map[ast.Id]int),
		repr:   make(map[ast.Id]*ast.Identifier),
	}
	cc.V = cc
	p.VisitWith(cc)

	r := &replace{decls: g.Decls}
	r.V = r
	p.VisitWith(r)

	var best ast.Id
	bestN := 0
	for id, n := range cc.counts {
		if n > bestN {
			bestN = n
			best = id
		}
	}
	return cc.repr[best]
}
