const fs = require('fs');
const vm = require('vm');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const generate = require('@babel/generator').default;

const infile = process.argv[2] || 'in.js';
const code = fs.readFileSync(path.resolve(infile), 'utf8');
const ast = parser.parse(code, {
	sourceType: 'unambiguous',
	plugins: ['jsx', 'classProperties', 'dynamicImport'],
});

//number maps
const objMaps = {};
traverse(ast, {
	AssignmentExpression(path) {
		const {left, right} = path.node;
		if (
			t.isIdentifier(left) &&
			t.isObjectExpression(right)
		) {
			const map = Object.create(null);
			right.properties.forEach(prop => {
				if (
					t.isObjectProperty(prop) &&
					t.isIdentifier(prop.key) &&
					t.isNumericLiteral(prop.value)
				) {
					map[prop.key.name] = prop.value.value;
				}
			});
			objMaps[left.name] = map;
			//path.remove();
		}
	},
	VariableDeclarator(path) {
		const {id, init} = path.node;
		if (
			t.isIdentifier(id) &&
			t.isObjectExpression(init)
		) {
			const map = Object.create(null);
			init.properties.forEach(prop => {
				if (
					t.isObjectProperty(prop) &&
					t.isIdentifier(prop.key) &&
					t.isNumericLiteral(prop.value)
				) {
					map[prop.key.name] = prop.value.value;
				}
			});
			objMaps[id.name] = map;
			path.remove();
		}
	},
	MemberExpression(path) {
		const obj = path.node.object;
		const prop = path.node.property;
		if (
			t.isIdentifier(obj) &&
			t.isIdentifier(prop) &&
			objMaps[obj.name] &&
			Object.prototype.hasOwnProperty.call(objMaps[obj.name], prop.name)
		) {
			path.replaceWith(
				t.numericLiteral(objMaps[obj.name][prop.name])
			);
		}
	}
});

let vmCode = "";
traverse(ast, {
	FunctionDeclaration(path) {
		const code = generate(path.node, {}).code
		if (code.includes(".split")) {
			vmCode += code + ";\n";
			path.remove();
		} else if (
			(code.match(/function/g) || []).length === 2 &&
			(code.match(/return/g) || []).length === 2
		) {
			vmCode += code + ";\n";
			path.remove();
		}
	},
	CallExpression(path) {
		let code = generate(path.node, {}).code
		if (code.includes("parseInt") &&
			(code.match(/function/g) || []).length === 1
		) {
			code = code.replace("function ", "function kian");
			code = code.replace("}(", "};kian(");
			vmCode += code + ";\n";
			path.remove();
		}
	}
});

vm.createContext(global);
vm.runInContext(vmCode, global);

traverse(ast, {
	CallExpression(path) {
		if (path.node.arguments.length === 1 &&
			path.node.arguments[0].type === "NumericLiteral"
		) {
			const value = path.node.arguments[0].value;
			if (value < 100 || value > 999) {
				return
			}
			const v = path.node.arguments[0].value;
			path.replaceWith(t.stringLiteral(I(value)));

		}
	}
});

const output = generate(ast, {}).code;

fs.writeFileSync('out.js', output);
