package extract

import (
	"fmt"
	"strings"

	"github.com/t14raptor/go-fast/ast"
)

type Extract struct {
	ast.NoopVisitor
	Path     string
	Endpoint string
	Alphabet string
}

func (v *Extract) VisitStringLiteral(n *ast.StringLiteral) {
	n.VisitChildrenWith(v)
	val := n.Value

	if strings.HasPrefix(val, "/jsd/oneshot/") {
		v.Endpoint = val
	} else if IsExactAlphabetPermutation(val) {
		v.Alphabet = val
	}
}

func (v *Extract) VisitObjectLiteral(n *ast.ObjectLiteral) {
	n.VisitChildrenWith(v)

	if len(n.Value) != 1 {
		return
	}

	prop, ok := n.Value[0].Prop.(*ast.PropertyKeyed)
	if !ok {
		return
	}

	strLit, ok := prop.Value.Expr.(*ast.StringLiteral)
	if !ok {
		return
	}

	if strLit.Value == "b" {
		v.Path = "b"
	} else if strLit.Value == "g" {
		v.Path = "g"
	}
}

func ParseScript(p *ast.Program) {
	f := &Extract{}
	f.V = f
	p.VisitWith(f)

	fmt.Println(f)
}

const LZStringURISafeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$"

func IsExactAlphabetPermutation(s string) bool {
	if len(s) != len(LZStringURISafeAlphabet) {
		return false
	}

	var allowed [256]bool
	for i := 0; i < len(LZStringURISafeAlphabet); i++ {
		allowed[LZStringURISafeAlphabet[i]] = true
	}

	var seen [256]bool
	for i := 0; i < len(s); i++ {
		b := s[i]
		if !allowed[b] || seen[b] {
			return false
		}
		seen[b] = true
	}

	return true
}
