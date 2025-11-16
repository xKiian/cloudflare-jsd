package main

import (
	"os"

	"github.com/t14raptor/go-fast/generator"
	"github.com/t14raptor/go-fast/parser"
	"github.com/xkiian/cloudflare-jsd/visitors/deobf"
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

	deobf.DeobfuscateCf(ast)

	os.WriteFile("out.js", []byte(generator.Generate(ast)), 0644)
}
