k = {
	"object": "o",
	"string": "s",
	"undefined": "u",
	"symbol": "z",
	"number": "n",
	"bigint": "I",
	"boolean": "b"
}

function l(d, e) {
	return e instanceof d["Function"] &&
		0 < d["Function"]["prototype"]["toString"]["call"](e) ["indexOf"]("[native code]")
}

function getAllPropertyNames(d, Z, e) {
	for (
		e = [];
		d !== null;
		e = e.concat(Object.keys(d)),
			d = Object.getPrototypeOf(d)
	) ;
	return e
}

function detectValueType(e, g, E) {
	try {
		g[E]["catch"](function () {
		}); // Attempt to call .catch(), checking if g[E] is a Promise
		return 'p';
	} catch (G) {
	}

	try {
		if (g[E] == null) return g[E] === void 0 ? 'u' : 'x'; // Check for undefined ('u') or null ('x')
	} catch (H) {
		return 'i'; // Return 'i' if accessing g[E] throws an error
	}

	let F = typeof g[E];
	return e["Array"]["isArray"](g[E]) ? 'a' :
		g[E] === e["Array"] ? 'C' :
			g[E] === true ? 'T' :
				g[E] === false ? 'F' :
					F === "function" ? (l(e, g[E]) ? 'N' : 'f') :
						k[F] || '?';
}

function processProperties(g, E, F, G) {
	if (E === null || E === undefined) return G;

	let propertyNames = getAllPropertyNames(E);

	if (g.Object.getOwnPropertyNames) {
		propertyNames = propertyNames.concat(g.Object.getOwnPropertyNames(E));
	}

	propertyNames = g.Array.from && g.Set
		? g.Array.from(new g.Set(propertyNames))
		: (function (arr) {
			arr.sort(); // Sort the array
			for (let i = 0; i < arr.length;) {
				if (arr[i] === arr[i + 1]) {
					arr.splice(i + 1, 1); // Remove duplicate elements
				} else {
					i += 1;
				}
			}
			return arr;
		})(propertyNames);


	let validTypes = ['n', 's', 'a', 'b'];
	let isValidType = validTypes.includes.bind(validTypes);

	for (let i = 0; i < propertyNames.length; i++) {
		let key = propertyNames[i];
		let type = detectValueType(g, E, key);

		if (isValidType(type)) {
			let isNumberString = type === 's' && !g.isNaN(E[key]);
			if (F + key === 'd.cookie') {
				addToGroup(F + key, type);
			} else if (!isNumberString) {
				addToGroup(F + key, E[key]);
			}
		} else {
			addToGroup(F + key, type);
		}
	}

	return G;

	function addToGroup(value, key) {
		if (!Object.prototype.hasOwnProperty.call(G, key)) {
			G[key] = [];
		}
		G[key].push(value);
	}
};

function getFingerPrint() {
	try {
		g = document.createElement("iframe")
		g.style = "display: none"
		g.tabIndex = '-1'
		document.body.appendChild(g)
		currentWindow = g.contentWindow
		F = {}
		F = processProperties(currentWindow, currentWindow, '', F)
		F = processProperties(currentWindow, currentWindow.clientInformation || currentWindow.navigator, 'n.', F)
		F = processProperties(currentWindow, g.contentDocument, 'd.', F)
		self.document.body.removeChild(g)
		return {r: F, e: null}
	} catch (err) {
		return {r: {}, e: err}
	}
}

fp = getFingerPrint();
if (fp.e === null) {
	let output = JSON.stringify(fp.r);
    output = output.replace(/\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}/, "%timestamp%");
    console.log(output);
} else {
	console.log(fp)
}