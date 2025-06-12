var S = this.document

n = {
	object: 'o',
	string: 's',
	undefined: 'u',
	symbol: 'z',
	number: 'n',
	bigint: 'I',
	boolean: 'b'
};

function z(E, i, OX) {

	return i instanceof E.Function && 0 < E.Function.prototype.toString.call(i).indexOf("[native code]");
}

function y(E, i, Y, Oh, k) {

	try {
		i[Y]["catch"](function () {
		});
		return 'p';
	} catch (A) {
	}
	try {
		if (null == i[Y]) {
			return undefined === i[Y] ? 'u' : 'x';
		}
	} catch (F) {
		return 'i';
	}
	return E.Array.isArray(i[Y]) ? 'a' : i[Y] === E.Array ? 'q0' : true === i[Y] ? 'T' : false === i[Y] ? 'F' : (k = typeof i[Y], "function" == k ? z(E, i[Y]) ? 'N' : 'f' : n[k] || '?');
}

function g(E, OQ, i) {

	for (i = []; null !== E; i = i.concat(Object.keys(E)), E = Object.getPrototypeOf(E)) {
		;
	}
	return i;
}

YldMH8 = function (E, i, Y, A, Op, OL, Oq, X, o, h, Q, L, K) {

	if (null === i || i === undefined) {
		return A;
	}
	X = g(i);
	if (E.Object.getOwnPropertyNames) {
		X = X.concat(E.Object.getOwnPropertyNames(i));
	}
	X = E.Array.from && E.Set ? E.Array.from(new E.Set(X)) : function (D, G) {
		D.sort();
		for (G = 0; G < D.length; D[G + 1] === D[G] ? D.splice(G + 1, 1) : G += 1) {
			;
		}
		return D;
	}(X);
	o = 'nAsAaAb'.split('A');
	o = o.includes.bind(o);
	for (h = 0; h < X.length; Q = X[h], L = y(E, i, Q), o(L) ? (K = 's' === L && !E.isNaN(i[Q]), "d.cookie" === Y + Q ? F(Y + Q, L) : K || F(Y + Q, i[Q])) : F(Y + Q, L), h++) {
		;
	}
	return A;

	function F(D, G) {
		if (!Object.prototype.hasOwnProperty.call(A, G)) {
			A[G] = [];
		}
		A[G].push(D);
	}
};

function getFingerPrint(Oe, Y, k, A, F, X) {
	try {
		Y = S.createElement("iframe");
		Y.style = "display: none";
		Y.tabIndex = '-1';
		S.body.appendChild(Y);
		k = Y.contentWindow;
		A = {};
		A = YldMH8(k, k, '', A);
		A = YldMH8(k, k.clientInformation || k.navigator, 'n.', A);
		A = YldMH8(k, Y.contentDocument, 'd.', A);
		S.body.removeChild(Y);
		F = {};
		F.r = A;
		F.e = null;
		return F;
	} catch (o) {
		X = {};
		X.r = {};
		X.e = o;
		return X;
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