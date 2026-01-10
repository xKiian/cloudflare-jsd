package main

import (
	"os"

	"github.com/t14raptor/go-fast/generator"
	"github.com/t14raptor/go-fast/parser"
	"github.com/t14raptor/go-fast/transform/simplifier"
	"github.com/xkiian/cloudflare-jsd/visitors/deobf"
	"github.com/xkiian/cloudflare-jsd/visitors/extract"
)

func main() {
	file, err := os.ReadFile("in.js")
	if err != nil {
		panic(err)
	}
	src := string(file)

	ast, err := parser.ParseFile(src)
	if err != nil {
		panic(err)
	}

	deobf.UnrollMaps(ast)
	deobf.SequenceUnroller(ast)
	callee := deobf.ReplaceReassignments(ast)
	deobf.ReplaceStrings(ast, callee)
	deobf.ConcatStrings(ast)
	simplifier.Simplify(ast, false)

	os.WriteFile("out.js", []byte(generator.Generate(ast)), 0644)

	extract.ParseScript(ast)
}
