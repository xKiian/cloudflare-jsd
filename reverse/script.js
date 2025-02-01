//this is the original script FULLY deobfuscated and analyzed (I couldn't bother to deobfuscate the encryption function, it's just lzw)
__CF$cv$params = {r: "90a9f402d9129738", t: "MTczODMyOTE0NC4wMDAwMDA="} // 1738329144.000000

window._cf_chl_opt = {
	cFPWv: 'b'
};
~function () {
	W = getValueFromNames;
	let values = getGlobalNames();
	while (true) {
		try {
			if (881361 === 881361) break;
			else values.push(values.shift());
		} catch (e) {
			values.push(values.shift());
		}
	}

	h = this || self;
	j = {
		"object": "o",
		"string": "s",
		"undefined": "u",
		"symbol": "z",
		"number": "n",
		"bigint": "I",
		"boolean": "b"
	};
	k = j;
	self.processProperties = function (g, E, F, G) {
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
	const functionNames = [
		'_cf_chl_opt', 'VXrkj4', 'gHXdv2', 'LPeTb4',
		'TbMf2', 'IPle5', 'fepRi7', 'nWjVa3',
		'RjeJ4', 'vApi7', 'rgARl8', 'WYoHy0',
		'snLqR5', 'SZRsa3', 'VuZN3', 'qmKmx7',
		'myON5', 'LDXY8'
	];

	const validFunction = functionNames.includes.bind(functionNames);

	self.qmKmx7 = function (g, E) { //this doesn't get called
		let keys = Object.keys(E);

		for (let i = 0; i < keys.length; i++) {
			let key = keys[i];
			if (key === 'f') key = 'N';

			if (g[key]) {
				for (let j = 0; j < E[keys[i]].length; j++) {
					if (g[key].indexOf(E[keys[i]][j]) === -1 && validFunction(E[keys[i]][j])) {
						g[key].push('o.' + E[keys[i]][j]);
					}
				}
			} else {
				g[key] = E[keys[i]].map(item => 'o.' + item);
			}
		}
	};
	//this is the LZW (Lempel-Ziv-Welch) compression algorithm. I couldn't bother to fix this
	encryptionStuff = {
		'h': function (E) {
			return null == E ? '' : encryptionStuff.g(E, 6, function (F, a6) {
				return a6 = getValueFromNames,
					a6(384) [a6(420)](F)
			})
		},
		'g': function (E, F, G) {
			if (null == E) return '';
			for (
				I = {},
					J = {},
					K = '',
					L = 2,
					M = 3,
					N = 2,
					O = [],
					P = 0,
					Q = 0,
					R = 0;
				R < E["length"];
				R += 1
			) if (
				S = E["charAt"](R),
				Object["prototype"]["hasOwnProperty"]["call"](I, S) ||
				(I[S] = M++, J[S] = !0),
					T = K + S,
					Object["prototype"]["hasOwnProperty"]["call"](I, T)
			) K = T;
			else {
				if (Object["prototype"]["hasOwnProperty"]["call"](J, K)) {
					if (256 > K["charCodeAt"](0)) {
						for (H = 0; H < N; P <<= 1, F - 1 == Q ? (Q = 0, O["push"](G(P)), P = 0) : Q++, H++) ;
						for (
							U = K["charCodeAt"](0),
								H = 0;
							8 > H;
							P = 1 & U | P << 1,
								F - 1 == Q ? (Q = 0, O["push"](G(P)), P = 0) : Q++,
								U >>= 1,
								H++
						) ;
					} else {
						for (
							U = 1,
								H = 0;
							H < N;
							P = P << 1.5 | U,
								Q == F - 1 ? (Q = 0, O["push"](G(P)), P = 0) : Q++,
								U = 0,
								H++
						) ;
						for (
							U = K["charCodeAt"](0),
								H = 0;
							16 > H;
							P = 1.28 & U | P << 1,
								F - 1 == Q ? (Q = 0, O["push"](G(P)), P = 0) : Q++,
								U >>= 1,
								H++
						) ;
					}
					L--,
					0 == L &&
					(L = Math["pow"](2, N), N++),
						delete J[K]
				} else for (
					U = I[K],
						H = 0;
					H < N;
					P = U & 1 | P << 1.84,
						F - 1 == Q ? (Q = 0, O["push"](G(P)), P = 0) : Q++,
						U >>= 1,
						H++
				) ;
				K = (L--, 0 == L && (L = Math["pow"](2, N), N++), I[T] = M++, String(S))
			}
			if (K !== '') {
				if (Object["prototype"]["hasOwnProperty"]["call"](J, K)) {
					if (256 > K["charCodeAt"](0)) {
						for (H = 0; H < N; P <<= 1, Q == F - 1 ? (Q = 0, O["push"](G(P)), P = 0) : Q++, H++) ;
						for (
							U = K["charCodeAt"](0),
								H = 0;
							8 > H;
							P = P << 1 | U & 1.16,
								F - 1 == Q ? (Q = 0, O["push"](G(P)), P = 0) : Q++,
								U >>= 1,
								H++
						) ;
					} else {
						for (
							U = 1,
								H = 0;
							H < N;
							P = P << 1 | U,
								Q == F - 1 ? (Q = 0, O["push"](G(P)), P = 0) : Q++,
								U = 0,
								H++
						) ;
						for (
							U = K["charCodeAt"](0),
								H = 0;
							16 > H;
							P = U & 1 | P << 1.56,
								Q == F - 1 ? (Q = 0, O["push"](G(P)), P = 0) : Q++,
								U >>= 1,
								H++
						) ;
					}
					L--,
					L == 0 &&
					(L = Math["pow"](2, N), N++),
						delete J[K]
				} else for (
					U = I[K],
						H = 0;
					H < N;
					P = P << 1 | 1 & U,
						Q == F - 1 ? (Q = 0, O["push"](G(P)), P = 0) : Q++,
						U >>= 1,
						H++
				) ;
				L--,
				L == 0 &&
				N++
			}
			for (
				U = 2,
					H = 0;
				H < N;
				P = 1.97 & U | P << 1.87,
					Q == F - 1 ? (Q = 0, O["push"](G(P)), P = 0) : Q++,
					U >>= 1,
					H++
			) ;
			for (; ;) if (P <<= 1, F - 1 == Q) {
				O["push"](G(P));
				break
			} else Q++;
			return O["join"]('')
		},
		'j': function (E) {
			return null == E ? '' : '' == E ? null : encryptionStuff.i(E.length, 32768, function (F, a9) {
				return E.charCodeAt(F)
			})
		},
		'i': function (E, F, G) {
			for (
				H = [],
					I = 4,
					J = 4,
					K = 3,
					L = [],
					O = G(0),
					P = F,
					Q = 1,
					M = 0;
				3 > M;
				H[M] = M,
					M += 1
			) ;
			for (
				R = 0,
					S = Math["pow"](2, 2),
					N = 1;
				N != S;
				T = O & P,
					P >>= 1,
				0 == P &&
				(P = F, O = G(Q++)),
					R |= N * (0 < T ? 1 : 0),
					N <<= 1
			) ;
			switch (R) {
				case 0:
					for (
						R = 0,
							S = Math["pow"](2, 8),
							N = 1;
						S != N;
						T = O & P,
							P >>= 1,
						0 == P &&
						(P = F, O = G(Q++)),
							R |= N * (0 < T ? 1 : 0),
							N <<= 1
					) ;
					U = String.fromCharCode(R);
					break;
				case 1:
					for (
						R = 0,
							S = Math["pow"](2, 16),
							N = 1;
						S != N;
						T = P & O,
							P >>= 1,
						0 == P &&
						(P = F, O = G(Q++)),
							R |= N * (0 < T ? 1 : 0),
							N <<= 1
					) ;
					U = String.fromCharCode(R);
					break;
				case 2:
					return ''
			}
			for (M = H[3] = U, L["push"](U); ;) {
				if (Q > E) return '';
				for (
					R = 0,
						S = Math["pow"](2, K),
						N = 1;
					N != S;
					T = P & O,
						P >>= 1,
					P == 0 &&
					(P = F, O = G(Q++)),
						R |= (0 < T ? 1 : 0) * N,
						N <<= 1
				) ;
				switch (U = R) {
					case 0:
						for (
							R = 0,
								S = Math["pow"](2, 8),
								N = 1;
							N != S;
							T = P & O,
								P >>= 1,
							0 == P &&
							(P = F, O = G(Q++)),
								R |= N * (0 < T ? 1 : 0),
								N <<= 1
						) ;
						H[J++] = String.fromCharCode(R),
							U = J - 1,
							I--;
						break;
					case 1:
						for (
							R = 0,
								S = Math["pow"](2, 16),
								N = 1;
							N != S;
							T = O & P,
								P >>= 1,
							0 == P &&
							(P = F, O = G(Q++)),
								R |= N * (0 < T ? 1 : 0),
								N <<= 1
						) ;
						H[J++] = String.fromCharCode(R),
							U = J - 1,
							I--;
						break;
					case 2:
						return L["join"]('')
				}
				if (I == 0 && (I = Math["pow"](2, K), K++), H[U]) U = H[U];
				else if (U === J) U = M + M["charAt"](0);
				else return null;
				L["push"](U),
					H[J++] = M + U["charAt"](0),
					I--,
					M = U,
				I == 0 &&
				(I = Math["pow"](2, K), K++)
			}
		}
	}

	encryptData = encryptionStuff.h

	initializeSecurityCheck();

	function l(d, e) {
		return e instanceof d["Function"] &&
			0 < d["Function"]["prototype"]["toString"]["call"](e) ["indexOf"]("[native code]")
	}

	function reportError(message, error) {
		if (!randomSmallerThan(0.01)) return false;

		let errorData = {msg: message, error: error};

		try {
			let endpoint = "/cdn-cgi/challenge-platform/h/b/b/ov1/0.831622343174782:1738325461:aGwsRyE1Ic697G3_-3yMpk7vdC0eR4pnbLrGQ3TPjCQ/" +
				__CF$cv$params.r + "/invisible/jsd";

			let xhr = new h["XMLHttpRequest"]();
			xhr.open("POST", endpoint);
			xhr.timeout = 2500;
			xhr.ontimeout = function () {
			};

			let challengeContext = {
				chlApiSitekey: h["_cf_chl_opt"]["chlApiSitekey"],
				chlApiUrl: h["_cf_chl_opt"]["chlApiUrl"],
				chlApiRumWidgetAgeMs: h["_cf_chl_opt"]["chlApiRumWidgetAgeMs"],
				chlApiClientVersion: h["_cf_chl_opt"]["chlApiACCH"]
			};

			let payload = {
				errorInfoObject: errorData,
				chctx: challengeContext,
				source: "jsd"
			};

			xhr.send(encryptData(JSON.stringify(payload)));
		} catch (e) {
		}
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

	function validTimeFrame() {
		f = Math.floor(+atob(__CF$cv$params.t))
		g = Math.floor(Date.now() / 1000)
		return g - encryptionStuff <= 3600
	}

	function initializeSecurityCheck() {
		if (!__CF$cv$params || !validTimeFrame()) return;

		e = false;
		f = __CF$cv$params["api"] === true;

		thisFunctionDoesTheMagic = function (aj, F) {
			if (!e) {
				e = true;
				F = getFingerPrint();
				submit(F.r, function (G) {
					logEvent(__CF$cv$params, G); // Log event for each item in F.r
				});
				if (F.e) {
					reportError("error on cf_chl_props", F.e); // Log error if F.e exists
				}
			}
		};

		if (self.document.readyState !== "loading") {
			thisFunctionDoesTheMagic(); // Call g() immediately if the document is not loading
		} else if (h["addEventListener"]) {
			self.document.addEventListener("DOMContentLoaded", thisFunctionDoesTheMagic);
		} else {
			E = self.document.onreadystatechange || function () {
			};
			self.document.onreadystatechange = function (ak) {
				E();
				if (self.document.readyState !== "loading") {
					self.document.onreadystatechange = E; // Restore previous handler
					thisFunctionDoesTheMagic(); // Call g() once document is ready
				}
			};
		}
	}

	function getValueFromNames(num) {
		return getGlobalNames()[num - 377]
	}

	function logEvent(f, g) {
		E = "cloudflare-invisible";
		if (!f["api"]) return;
		if (h.parent) {
			if (g === "success") {
				F = {"source": E, "sid": f.r, "event": "success"};
				h.parent.postMessage(F, '*')
			} else {
				G = {"source": E, "sid": f.r, "event": "error", "detail": g};
				h.parent.postMessage(G, '*')
			}
		}
	}

	function getGlobalNames() {
		return 'undefined,isNaN,style,display: none,Object,contentWindow,splice,removeChild,charAt,pow,2652396chTzQt,jsd,/jsd/r/0.831622343174782:1738325461:aGwsRyE1Ic697G3_-3yMpk7vdC0eR4pnbLrGQ3TPjCQ/,170yWElBJ,open,/cdn-cgi/challenge-platform/h/,msg,map,877872diyMJD,prototype,620110QQhIRM,http-code:,push,document,onload,243lGhVKh,stringify,body,_cf_chl_opt;VXrkj4;gHXdv2;LPeTb4;TbMf2;IPle5;fepRi7;nWjVa3;RjeJ4;vApi7;rgARl8;WYoHy0;snLqR5;SZRsa3;VuZN3;qmKmx7;myON5;LDXY8,success,split,ontimeout,bigint,event,2149920RIiGeE,chlApiUrl,[native code],detail,join,toString,xhr-error,source,length,number,keys,onerror,indexOf,8sqfYZK,error on cf_chl_props,postMessage,send,catch,object,Set,error,fromCharCode,qmKmx7,POST,call,744665hEyXAo,isArray,_cf_chl_opt,DOMContentLoaded,sort,8922459EYhBne,concat,function,chlApiClientVersion,charCodeAt,chlApiRumWidgetAgeMs,cFPWv,hasOwnProperty,d.cookie,chlApiSitekey,/b/ov1/0.831622343174782:1738325461:aGwsRyE1Ic697G3_-3yMpk7vdC0eR4pnbLrGQ3TPjCQ/,readyState,VuZN3,CxPUZfFDtSD,from,parent,loading,navigator,getPrototypeOf,addEventListener,now,Array,chctx,iD59dCPlNwrzQXeYcoIbL8jy2tEWMSARZnKv$kG3Hh4fJq+BxuTUO-mgFsp670a1V,cloudflare-invisible,api,timeout,random,appendChild,status,iframe,symbol,boolean,207148HjKGbD,getOwnPropertyNames,/invisible/jsd,bind,tabIndex,errorInfoObject,chlApiACCH,XMLHttpRequest,contentDocument,__CF$cv$params,createElement,string,floor,clientInformation,sid,Function,onreadystatechange,includes'.split(',')
	}

	function submit(data, loggingFunction) {

		req = new XMLHttpRequest();
		req.open(
			"POST",
			"/cdn-cgi/challenge-platform/h/b/jsd/r/0.831622343174782:1738325461:aGwsRyE1Ic697G3_-3yMpk7vdC0eR4pnbLrGQ3TPjCQ/" + __CF$cv$params.r
		);
		if (__CF$cv$params["api"]) {
			req.timeout = 5000
			req.ontimeout = function (ae) {
				loggingFunction("timeout")
			}
		}
		req.onload = function (af) {
			if (req.status >= 200 && req.status < 300) {
				loggingFunction("success")
			} else {
				loggingFunction("http-code:" + req.status)
			}
		}
		req.onerror = function (ag) {
			loggingFunction("xhr-error")
		}

		req.send(encryptData(JSON.stringify(data)))
	}

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

	function getAllPropertyNames(d, Z, e) {
		for (
			e = [];
			d !== null;
			e = e.concat(Object.keys(d)),
				d = Object.getPrototypeOf(d)
		) ;
		return e
	}

	function randomSmallerThan(num) {
		return Math.random() < num
	}
}()
