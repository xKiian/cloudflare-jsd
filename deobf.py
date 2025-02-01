# this script easily replaces aa(421) with "pow" in the first case
# NOTE THAT THE table IS DIFFERENT FROM THE ORIGINAL a() function, this is because everything before the loading got stripped (so it's harder to deobfuscate)
import re
table = 'loading,navigator,getPrototypeOf,addEventListener,now,Array,chctx,iD59dCPlNwrzQXeYcoIbL8jy2tEWMSARZnKv$kG3Hh4fJq+BxuTUO-mgFsp670a1V,cloudflare-invisible,api,timeout,random,appendChild,status,iframe,symbol,boolean,207148HjKGbD,getOwnPropertyNames,/invisible/jsd,bind,tabIndex,errorInfoObject,chlApiACCH,XMLHttpRequest,contentDocument,__CF$cv$params,createElement,string,floor,clientInformation,sid,Function,onreadystatechange,includes,undefined,isNaN,style,display: none,Object,contentWindow,splice,removeChild,charAt,pow,2652396chTzQt,jsd,/jsd/r/0.831622343174782:1738325461:aGwsRyE1Ic697G3_-3yMpk7vdC0eR4pnbLrGQ3TPjCQ/,170yWElBJ,open,/cdn-cgi/challenge-platform/h/,msg,map,877872diyMJD,prototype,620110QQhIRM,http-code:,push,document,onload,243lGhVKh,stringify,body,_cf_chl_opt;VXrkj4;gHXdv2;LPeTb4;TbMf2;IPle5;fepRi7;nWjVa3;RjeJ4;vApi7;rgARl8;WYoHy0;snLqR5;SZRsa3;VuZN3;qmKmx7;myON5;LDXY8,success,split,ontimeout,bigint,event,2149920RIiGeE,chlApiUrl,[native code],detail,join,toString,xhr-error,source,length,number,keys,onerror,indexOf,8sqfYZK,error on cf_chl_props,postMessage,send,catch,object,Set,error,fromCharCode,qmKmx7,POST,call,744665hEyXAo,isArray,_cf_chl_opt,DOMContentLoaded,sort,8922459EYhBne,concat,function,chlApiClientVersion,charCodeAt,chlApiRumWidgetAgeMs,cFPWv,hasOwnProperty,d.cookie,chlApiSitekey,/b/ov1/0.831622343174782:1738325461:aGwsRyE1Ic697G3_-3yMpk7vdC0eR4pnbLrGQ3TPjCQ/,readyState,VuZN3,CxPUZfFDtSD,from,parent'.split(',')

key = 377 # this is the key that shifts the values (see script.js -> getValueFromNames())
func_name = "aa"
script = """function (E, F, G, aa, H, I, J, K, L, M, N, O, P, Q, R, S, U, T) {
					for (
						aa = a5,
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
							S = Math[aa(421)](2, 2),
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
									S = Math[aa(421)](2, 8),
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
									S = Math[aa(421)](2, 16),
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
					for (M = H[3] = U, L[aa(434)](U); ;) {
						if (Q > E) return '';
						for (
							R = 0,
								S = Math[aa(421)](2, K),
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
										S = Math[aa(421)](2, 8),
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
										S = Math[aa(421)](2, 16),
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
								return L[aa(450)]('')
						}
						if (I == 0 && (I = Math[aa(421)](2, K), K++), H[U]) U = H[U];
						else if (U === J) U = M + M[aa(420)](0);
						else return null;
						L[aa(434)](U),
							H[J++] = M + U[aa(420)](0),
							I--,
							M = U,
						I == 0 &&
						(I = Math[aa(421)](2, K), K++)
					}
				}"""

found = re.findall(fr"{func_name}\((.+?)\)", script)

for d in found:
    print(d, "->", table[int(d) - key])
    script = script.replace(f"{func_name}({d})", f'"{table[int(d) - key]}"')

print(script)