/**
 * parser.js - Parser
 *
 * @param input
 * @param readyFunction
 * @constructor
 */
Parser = function (input, readyFunction) {
	this.init(input, readyFunction);
};

/**
 * @type {Object}
 */
Parser.prototype = {
	init: function (input, readyFunction) {
		var gFact = [
			/* 0*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: 'fa2',iNext: 5, iAlt: 1, dbg: {block: 'gFact', id: 0}}, /*(0)---ident--->(E)*/
			/* 1*/ {bgd: 'BgMo', bgx: {x: 'mcNumb' }, fx: 'fa1',iNext: 5, iAlt: 2, dbg: {block: 'gFact', id: 1}}, /* +---number--->(E)*/
			/* 2*/ {bgd: 'BgSy', bgx: {x: '('      }, fx: null, iNext: 3, iAlt: 0, dbg: {block: 'gFact', id: 2}}, /*(+)----'('---->(3)*/
			/* 3*/ {bgd: 'BgGr', bgx: {x: 'gExpr'  }, fx: null, iNext: 4, iAlt: 0, dbg: {block: 'gFact', id: 3}}, /*(1)---express->(4)*/
			/* 4*/ {bgd: 'BgSy', bgx: {x: ')'      }, fx: null, iNext: 5, iAlt: 0, dbg: {block: 'gFact', id: 4}}, /*(0)----')'---->(E)*/
			/* 5*/ {bgd: 'BgEn', bgx: {x: 0        }, fx: null, iNext: 0, iAlt: 0, dbg: {block: 'gFact', id: 5}}  /*(E)--------(ENDE) */
		];
		var gTerm = [
			/* 0*/ {bgd: 'BgGr', bgx: {x: 'gFact'}, fx: null, iNext: 1, iAlt: 0, dbg: {block: 'gTerm', id: 0}},
			/* 1*/ {bgd: 'BgSy', bgx: {x: '*'    }, fx: null, iNext: 3, iAlt: 2, dbg: {block: 'gTerm', id: 1}},
			/* 2*/ {bgd: 'BgSy', bgx: {x: '/'    }, fx: null, iNext: 4, iAlt: 5, dbg: {block: 'gTerm', id: 2}},
			/* 3*/ {bgd: 'BgGr', bgx: {x: 'gFact'}, fx: 'te1',iNext: 1, iAlt: 0, dbg: {block: 'gTerm', id: 3}},
			/* 4*/ {bgd: 'BgGr', bgx: {x: 'gFact'}, fx: 'te2',iNext: 1, iAlt: 0, dbg: {block: 'gTerm', id: 4}},
			/* 5*/ {bgd: 'BgEn', bgx: {x: 0      }, fx: null, iNext: 0, iAlt: 0, dbg: {block: 'gTerm', id: 5}}
		];
		var gExpr = [
			/* 0*/ {bgd: 'BgSy', bgx: {x: '-'    }, fx: null, iNext: 2, iAlt: 1, dbg: {block: 'gExpr', id: 0}}, //A------'-'--->(B)
			/* 1*/ {bgd: 'BgNl', bgx: {x: 0      }, fx: null, iNext: 3, iAlt: 0, dbg: {block: 'gExpr', id: 1}}, //+------------>(B)
			/* 2*/ {bgd: 'BgGr', bgx: {x: 'gTerm'}, fx: 'ex1',iNext: 4, iAlt: 0, dbg: {block: 'gExpr', id: 2}}, //(B)----term--->(C)
			/* 3*/ {bgd: 'BgGr', bgx: {x: 'gTerm'}, fx: null, iNext: 4, iAlt: 0, dbg: {block: 'gExpr', id: 3}}, //(B2)---term--->(C)
			/* 4*/ {bgd: 'BgNl', bgx: {x: 0      }, fx: null, iNext: 5, iAlt: 0, dbg: {block: 'gExpr', id: 4}}, //(C)----------->(D)

			/* 5*/ {bgd: 'BgSy', bgx: {x: '+'    }, fx: null, iNext: 6, iAlt: 7, dbg: {block: 'gExpr', id: 5}}, //(C)-----'+'--->(D)
			/* 6*/ {bgd: 'BgGr', bgx: {x: 'gTerm'}, fx: 'ex2',iNext: 4, iAlt: 0, dbg: {block: 'gExpr', id: 6}}, //(D)----term--->(C)

			/* 7*/ {bgd: 'BgSy', bgx: {x: '-'    }, fx: null, iNext: 8, iAlt: 9, dbg: {block: 'gExpr', id: 7}}, //+------'-'---->(E)
			/* 8*/ {bgd: 'BgGr', bgx: {x: 'gTerm'}, fx: 'ex3',iNext: 4, iAlt: 0, dbg: {block: 'gExpr', id: 8}}, //(E)----term--->(C)

			/* 9*/ {bgd: 'BgEn', bgx: {x: 0      }, fx: null, iNext: 0, iAlt: 0, dbg: {block: 'gExpr', id: 9}}  //+------------->(Ende)
		];
		var gCond = [
			/* 0*/ {bgd: 'BgSy', bgx: {x: 'zODD' },   fx: null,  iNext:  1, iAlt:  2, dbg: {block: 'gCond',  id:  0}}, //(A)----'odd'--->(B)
			/* 1*/ {bgd: 'BgGr', bgx: {x: 'gExpr'},   fx: 'co1', iNext: 10, iAlt:  0, dbg: {block: 'gCond',  id:  1}}, //(B)-Expression->(E)
			/* 2*/ {bgd: 'BgGr', bgx: {x: 'gExpr'},   fx: null,  iNext:  3, iAlt:  0, dbg: {block: 'gCond',  id:  2}}, //(A)-Expression->(C)
			/* 3*/ {bgd: 'BgSy', bgx: {x: '='    },   fx: 'co2', iNext:  9, iAlt:  4, dbg: {block: 'gCond',  id:  3}}, //(C)----'='----->(D)
			/* 4*/ {bgd: 'BgSy', bgx: {x: '#'    },   fx: 'co3', iNext:  9, iAlt:  5, dbg: {block: 'gCond',  id:  4}}, //(C)----'#'----->(D)
			/* 5*/ {bgd: 'BgSy', bgx: {x: '<'    },   fx: 'co4', iNext:  9, iAlt:  6, dbg: {block: 'gCond',  id:  5}}, //(C)----'<'----->(D)
			/* 6*/ {bgd: 'BgSy', bgx: {x: 'zle'  },   fx: 'co5', iNext:  9, iAlt:  7, dbg: {block: 'gCond',  id:  6}}, //(C)----'<='---->(D)
			/* 7*/ {bgd: 'BgSy', bgx: {x: '>'    },   fx: 'co6', iNext:  9, iAlt:  8, dbg: {block: 'gCond',  id:  7}}, //(C)----'>'----->(D)
			/* 8*/ {bgd: 'BgSy', bgx: {x: 'zge'  },   fx: 'co7', iNext:  9, iAlt:  0, dbg: {block: 'gCond',  id:  8}}, //(C)----'>='---->(D)
			/* 9*/ {bgd: 'BgGr', bgx: {x: 'gExpr'},   fx: 'co8', iNext: 10, iAlt:  0, dbg: {block: 'gCond',  id:  9}}, //(D)-Expression->(E)
			/*10*/ {bgd: 'BgSy', bgx: {x: 'zOR'},     fx: 'co9',iNext: 12, iAlt: 11, dbg: {block: 'gCond',  id: 10}}, //(D)-Expression->(E)
			/*11*/ {bgd: 'BgSy', bgx: {x: 'zAND'},    fx: 'co10',iNext: 12, iAlt: 13, dbg: {block: 'gCond',  id: 11}}, //(D)-Expression->(E)
			/*12*/ {bgd: 'BgGr', bgx: {x: 'gCond'},   fx: null,  iNext: 14, iAlt:  0, dbg: {block: 'gCond',  id: 12}}, //(D)-Expression->(E)
			/*13*/ {bgd: 'BgNl', bgx: {x: 0      },   fx: null,  iNext: 14, iAlt:  0, dbg: {block: 'gCond',  id: 13}}, //(D)-Expression->(E)
			/*14*/ {bgd: 'BgEn', bgx: {x: 0      },   fx: null,  iNext:  0, iAlt:  0, dbg: {block: 'gCond',  id: 14}}  //(E)------------>(Ende)
		];
		var gStatem = [
			/* 0*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: 'st1', iNext:  1, iAlt:  3, dbg: {block: 'gStatem', id:  0}}, //(A)----ident--->(B)
			/* 1*/ {bgd: 'BgSy', bgx: {x: 'zErg'   }, fx: null,  iNext:  2, iAlt:  0, dbg: {block: 'gStatem', id:  1}}, //(B)----':='---->(C)
			/* 2*/ {bgd: 'BgGr', bgx: {x: 'gExpr'  }, fx: 'st2', iNext: 21, iAlt:  0, dbg: {block: 'gStatem', id:  2}}, //(C)-Expression->(A)

			/* 3*/ {bgd: 'BgSy', bgx: {x: 'zIF'    }, fx: null,  iNext:  4, iAlt:  7, dbg: {block: 'gStatem', id:  3}}, //(A)----'if'---->(E)
			/* 4*/ {bgd: 'BgGr', bgx: {x: 'gCond'  }, fx: 'st3', iNext:  5, iAlt:  0, dbg: {block: 'gStatem', id:  4}}, //(E)--condition->(F)
			/* 5*/ {bgd: 'BgSy', bgx: {x: 'zTHN'   }, fx: null,  iNext:  6, iAlt:  0, dbg: {block: 'gStatem', id:  5}}, //(F)----'then'-->(G)
			/* 6*/ {bgd: 'BgGr', bgx: {x: 'gStatem'}, fx: 'st4', iNext: 23, iAlt:  0, dbg: {block: 'gStatem', id:  6}}, //(G)--statement->(A)

			/* 7*/ {bgd: 'BgSy', bgx: {x: 'zWHL'   }, fx: 'st5', iNext:  8, iAlt: 11, dbg: {block: 'gStatem', id:  7}}, //(A)----'while'->(H)
			/* 8*/ {bgd: 'BgGr', bgx: {x: 'gCond'  }, fx: 'st6', iNext:  9, iAlt:  0, dbg: {block: 'gStatem', id:  8}}, //(H)--condition->(I)
			/* 9*/ {bgd: 'BgSy', bgx: {x: 'zDO'    }, fx: null,  iNext: 10, iAlt:  0, dbg: {block: 'gStatem', id:  9}}, //(I)----'do'---->(J)
			/*10*/ {bgd: 'BgGr', bgx: {x: 'gStatem'}, fx: 'st7', iNext: 21, iAlt:  0, dbg: {block: 'gStatem', id: 10}}, //(J)--statement->(A)

			/*11*/ {bgd: 'BgSy', bgx: {x: 'zBGN'   }, fx: null,  iNext: 12, iAlt: 15, dbg: {block: 'gStatem', id: 11}}, //(A)----'begin'->(K)
			/*12*/ {bgd: 'BgGr', bgx: {x: 'gStatem'}, fx: null,  iNext: 14, iAlt:  0, dbg: {block: 'gStatem', id: 12}}, //(K)--statement->(L)
			/*13*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext: 12, iAlt:  0, dbg: {block: 'gStatem', id: 13}}, //(L)----';'----->(K)
			/*14*/ {bgd: 'BgSy', bgx: {x: 'zEND'   }, fx: null,  iNext: 21, iAlt: 13, dbg: {block: 'gStatem', id: 14}}, //(K)----'end'--->(A)

			/*15*/ {bgd: 'BgSy', bgx: {x: 'zCLL'   }, fx: null,  iNext: 16, iAlt: 17, dbg: {block: 'gStatem', id: 15}}, //(A)----'call'-->(M)
			/*16*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: 'st8', iNext:  0, iAlt:  0, dbg: {block: 'gStatem', id: 16}}, //(M)-----ident-->(A)

			/*17*/ {bgd: 'BgSy', bgx: {x: '?'      }, fx: null,  iNext: 18, iAlt: 19, dbg: {block: 'gStatem', id: 17}}, //(A)----'?'----->(N)
			/*18*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: 'st9', iNext: 21, iAlt:  0, dbg: {block: 'gStatem', id: 18}}, //(N)----ident--->(A)

			/*19*/ {bgd: 'BgSy', bgx: {x: '!'      }, fx: null,  iNext: 22, iAlt: 27, dbg: {block: 'gStatem', id: 19}}, //(A)----'!'----->(O)
			/*20*/ {bgd: 'BgGr', bgx: {x: 'gExpr'  }, fx: 'st10',iNext: 21, iAlt:  0, dbg: {block: 'gStatem', id: 20}}, //(O)-expression->(A)

			/*21*/ {bgd: 'BgEn', bgx: {x: 0        }, fx: null,  iNext:  0, iAlt:  0, dbg: {block: 'gStatem', id: 21}}, //(A)------------>(Ende)

			/* extensions */
			/*22*/ {bgd: 'BgMo', bgx: {x: 'mcStrng'}, fx: 'st11',iNext: 21, iAlt: 20, dbg: {block: 'gStatem', id: 22}}, //(O)---string--->(A)

			/*23*/ {bgd: 'BgSy', bgx: {x: 'zELSE'},   fx: 'st12',iNext: 24, iAlt: 21, dbg: {block: 'gStatem', id: 23}}, //(A)---'else'--->(B)
			/*24*/ {bgd: 'BgGr', bgx: {x: 'gStatem'}, fx: 'st13',iNext: 21, iAlt:  0, dbg: {block: 'gStatem', id: 24}}, //(B)-statement-->(C)

			/* 25 and 26 not active - moved to condition */
			/*25*/ {bgd: 'BgSy', bgx: {x: 'zOR'},     fx: 'co9',iNext: 4, iAlt:  26, dbg: {block: 'gStatem', id: 25}}, //(S)----'or'---->(S)
			/*26*/ {bgd: 'BgSy', bgx: {x: 'zAND'},    fx: 'co10',iNext: 4, iAlt:   5, dbg: {block: 'gStatem', id: 26}}, //(S)----'and'--->(S)


			/*27*/ {bgd: 'BgSy', bgx: {x: 'zSWITCH'}, fx: null,  iNext: 28, iAlt: 34, dbg: {block: 'gStatem', id: 27}}, //(A)---'zSWI'--->(B)
			/*28*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: null,  iNext: 29, iAlt:  0, dbg: {block: 'gStatem', id: 28}}, //(B)--'ident'--->(C)
			/*29*/ {bgd: 'BgSy', bgx: {x: 'zCASE'},   fx: null,  iNext: 30, iAlt:  0, dbg: {block: 'gStatem', id: 29}}, //(C)---'case'--->(D)
			/*30*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: null,  iNext: 31, iAlt:  0, dbg: {block: 'gStatem', id: 30}}, //(D)---'ident'-->(E)
			/*31*/ {bgd: 'BgSy', bgx: {x: ':'},       fx: null,  iNext: 32, iAlt:  0, dbg: {block: 'gStatem', id: 31}}, //(E)-----':'---->(F)
			/*32*/ {bgd: 'BgGr', bgx: {x: 'gStatem'}, fx: null,  iNext: 33, iAlt:  0, dbg: {block: 'gStatem', id: 32}}, //(F)--'gStatem'->(G)
			/*33*/ {bgd: 'BgSy', bgx: {x: ','},       fx: null,  iNext: 29, iAlt: 21, dbg: {block: 'gStatem', id: 33}}, //(G)----','----->(H)

			/*34*/ {bgd: 'BgSy', bgx: {x: '('      }, fx: null,  iNext: 35, iAlt: 40, dbg: {block: 'gStatem', id: 34}}, //(A)----'('----->(N)
			/*35*/ {bgd: 'BgGr', bgx: {x: 'gExpr'  }, fx: null,  iNext: 36, iAlt: 38, dbg: {block: 'gStatem', id: 35}}, //(A)---'gExpr'-->(N)
			/*36*/ {bgd: 'BgSy', bgx: {x: ','      }, fx: null,  iNext: 37, iAlt: 39, dbg: {block: 'gStatem', id: 36}}, //(A)----','----->(N)
			/*37*/ {bgd: 'BgGr', bgx: {x: 'gExpr'  }, fx: null,  iNext: 36, iAlt:  0, dbg: {block: 'gStatem', id: 37}}, //(A)----')'----->(N)
			/*38*/ {bgd: 'BgNl', bgx: {x: 0        }, fx: null,  iNext: 39, iAlt:  0, dbg: {block: 'gStatem', id: 38}}, //(A)----')'----->(N)
			/*39*/ {bgd: 'BgSy', bgx: {x: ')'      }, fx: null,  iNext: 21, iAlt:  0, dbg: {block: 'gStatem', id: 38}},  //(A)---')'----->(N)

			/*40*/ {bgd: 'BgSy', bgx: {x: 'zFOR'   }, fx: null,  iNext: 41, iAlt: 21, dbg: {block: 'gStatem', id: 40}}, //(A)---'for----->(B)
			/*41*/ {bgd: 'BgSy', bgx: {x: '('      }, fx: null,  iNext: 42, iAlt:  0, dbg: {block: 'gStatem', id: 41}}, //(B)----'('----->(C)
			/*42*/ {bgd: 'BgGr', bgx: {x: 'gAssign'}, fx: null,  iNext: 43, iAlt:  0, dbg: {block: 'gStatem', id: 42}}, //(C)---':='----->(D)
			/*43*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext: 44, iAlt:  0, dbg: {block: 'gStatem', id: 43}}, //(D)----';'----->(E)
			/*44*/ {bgd: 'BgGr', bgx: {x: 'gCond'  }, fx: null,  iNext: 45, iAlt:  0, dbg: {block: 'gStatem', id: 44}}, //(E)--'gCond'--->(F)
			/*45*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext: 46, iAlt:  0, dbg: {block: 'gStatem', id: 45}}, //(F)----';'----->(G)
			/*46*/ {bgd: 'BgGr', bgx: {x: 'gAssign'}, fx: null,  iNext: 47, iAlt:  0, dbg: {block: 'gStatem', id: 46}}, //(G)----':='---->(H)
			/*47*/ {bgd: 'BgSy', bgx: {x: ')'      }, fx: null,  iNext: 48, iAlt:  0, dbg: {block: 'gStatem', id: 47}}, //(H)----')'----->(I)
			/*48*/ {bgd: 'BgGr', bgx: {x: 'gStatem'}, fx: null,  iNext: 21, iAlt:  0, dbg: {block: 'gStatem', id: 48}}  //(I)--'gStatem'->(J)
		];
		var gAssign = [
			/* 0*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: 'st1', iNext:  1, iAlt:  0, dbg: {block: 'gAssign', id:  0}}, //(A)----ident--->(B)
			/* 1*/ {bgd: 'BgSy', bgx: {x: 'zErg'   }, fx: null,  iNext:  2, iAlt:  0, dbg: {block: 'gAssign', id:  1}}, //(B)----':='---->(C)
			/* 2*/ {bgd: 'BgGr', bgx: {x: 'gExpr'  }, fx: 'st2', iNext:  3, iAlt:  0, dbg: {block: 'gAssign', id:  2}}, //(C)-Expression->(D)
			/* 3*/ {bgd: 'BgEn', bgx: {x: 0        }, fx: null,  iNext:  0, iAlt:  0, dbg: {block: 'gAssign', id:  3}}  //(D)------------>(Ende)
		];
		var gProg = [
			/* 0*/ {bgd: 'BgGr', bgx: {x: 'gBlock'},  fx: null,  iNext: 1,  iAlt: 0,  dbg: {block: 'gProg',  id:  0}}, //A----block--->(B)
			/* 1*/ {bgd: 'BgSy', bgx: {x: '.'     },  fx: 'pr1', iNext: 2,  iAlt: 0,  dbg: {block: 'gProg',  id:  2}}, //(B)----'.'---->(C)
			/* 2*/ {bgd: 'BgEn', bgx: {x: 0       },  fx: null,  iNext: 0,  iAlt: 0,  dbg: {block: 'gProg',  id:  2}}  //(C)----------->(Ende)
		];
		var gBlock = [
			/* 0*/ {bgd: 'BgSy', bgx: {x: 'zCST'   }, fx: null,  iNext:  1, iAlt:  6, dbg: {block: 'gBlock', id:  0}}, //A----'const'-->(B)
			/* 1*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: 'bl1', iNext:  2, iAlt:  0, dbg: {block: 'gBlock', id:  1}}, //(B)----ident--->(C)
			/* 2*/ {bgd: 'BgSy', bgx: {x: '='      }, fx: null,  iNext:  3, iAlt:  0, dbg: {block: 'gBlock', id:  2}}, //(C)---'='------>(D)
			/* 3*/ {bgd: 'BgMo', bgx: {x: 'mcNumb' }, fx: 'bl2', iNext:  4, iAlt:  0, dbg: {block: 'gBlock', id:  3}}, //(D)--numeral--->(E)
			/* 4*/ {bgd: 'BgSy', bgx: {x: ','      }, fx: null,  iNext:  1, iAlt:  5, dbg: {block: 'gBlock', id:  4}}, //(E)---','------>(B)
			/* 5*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext:  6, iAlt:  0, dbg: {block: 'gBlock', id:  5}}, //(E)-----';'---->(A)

			/* 6*/ {bgd: 'BgSy', bgx: {x: 'zVAR'   }, fx: null,  iNext:  7, iAlt: 10, dbg: {block: 'gBlock', id:  6}}, //(A)----var----->(F)
			/* 7*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: 'bl3', iNext:  8, iAlt:  0, dbg: {block: 'gBlock', id:  7}}, //(F)----ident--->(G)
			/* 8*/ {bgd: 'BgSy', bgx: {x: ','      }, fx: null,  iNext:  7, iAlt:  9, dbg: {block: 'gBlock', id:  8}}, //(G)---','------>(F)
			/* 9*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext: 10, iAlt:  0, dbg: {block: 'gBlock', id:  9}}, //(G)---';'------>(A)

			/*10*/ {bgd: 'BgSy', bgx: {x: 'zPRC'   }, fx: null,  iNext: 11, iAlt: 22, dbg: {block: 'gBlock', id: 10}}, //(A)'procedure'->(H)
			/*11*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: 'bl4', iNext: 12, iAlt:  0, dbg: {block: 'gBlock', id: 11}}, //(H)-'ident'---->(I)
			/*12*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext: 13, iAlt: 18, dbg: {block: 'gBlock', id: 12}}, //(I)---';'------>(J)
			/*13*/ {bgd: 'BgGr', bgx: {x: 'gBlock' }, fx: null,  iNext: 14, iAlt:  0, dbg: {block: 'gBlock', id: 13}}, //(J)---block---->(K)
			/*14*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext: 10, iAlt:  0, dbg: {block: 'gBlock', id: 14}}, //(K)---';'------>(A)

			/*15*/ {bgd: 'BgNl', bgx: {x: 0        }, fx: 'bl6', iNext: 16, iAlt:  0, dbg: {block: 'gBlock', id: 15}}, //(A)------------>(L)
			/*16*/ {bgd: 'BgGr', bgx: {x: 'gStatem'}, fx: 'bl5', iNext: 17, iAlt:  0, dbg: {block: 'gBlock', id: 16}}, //(L)-statement-->(M)
			/*17*/ {bgd: 'BgEn', bgx: {x: 0        }, fx: null,  iNext:  0, iAlt:  0, dbg: {block: 'gBlock', id: 17}},  //(M)------------>(Ende)

			/* extension */
			/* parameters for procedures */
			/*18*/ {bgd: 'BgSy', bgx: {x: '('      }, fx: null,  iNext: 19, iAlt:  0, dbg: {block: 'gBlock', id: 18}}, //(K)---';'------>(A)
			/*19*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: null,  iNext: 20, iAlt:  0, dbg: {block: 'gBlock', id: 19}}, //(K)---';'------>(A)
			/*20*/ {bgd: 'BgSy', bgx: {x: ','      }, fx: null,  iNext: 19, iAlt: 21, dbg: {block: 'gBlock', id: 20}}, //(K)---';'------>(A)
			/*21*/ {bgd: 'BgSy', bgx: {x: ')'      }, fx: null,  iNext: 12, iAlt:  0, dbg: {block: 'gBlock', id: 21}}, //(K)---';'------>(A)

			/* function */
			/*22*/ {bgd: 'BgSy', bgx: {x: 'zFNC'   }, fx: null,  iNext: 23, iAlt: 15, dbg: {block: 'gBlock', id: 22}}, //(A)--'function'->(B)
			/*23*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: 'bl4', iNext: 24, iAlt:  0, dbg: {block: 'gBlock', id: 23}}, //(B)---ident----->(C)
			/*24*/ {bgd: 'BgSy', bgx: {x: '('      }, fx: null,  iNext: 25, iAlt:  0, dbg: {block: 'gBlock', id: 24}}, //(C)----'('------>(D)
			/*25*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: null,  iNext: 26, iAlt: 29, dbg: {block: 'gBlock', id: 25}}, //(D)---'ident'--->(E)
			/*26*/ {bgd: 'BgSy', bgx: {x: ','      }, fx: null,  iNext: 27, iAlt: 28, dbg: {block: 'gBlock', id: 26}}, //(E)---','------->(F)
			/*27*/ {bgd: 'BgMo', bgx: {x: 'mcIdent'}, fx: null,  iNext: 26, iAlt:  0, dbg: {block: 'gBlock', id: 27}}, //(F)---ident----->(G)
			/*28*/ {bgd: 'BgNl', bgx: {x: 0        }, fx: null,  iNext: 30, iAlt:  0, dbg: {block: 'gBlock', id: 28}}, //(K)------------->(A)
			/*29*/ {bgd: 'BgNl', bgx: {x: 0        }, fx: null,  iNext: 30, iAlt:  0, dbg: {block: 'gBlock', id: 29}}, //(K)------------->(A)
			/*30*/ {bgd: 'BgSy', bgx: {x: ')'      }, fx: null,  iNext: 31, iAlt:  0, dbg: {block: 'gBlock', id: 30}}, //(E)---')'------->(F)
			/*31*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext: 32, iAlt:  0, dbg: {block: 'gBlock', id: 31}}, //(K)---';'------->(A)
			/*32*/ {bgd: 'BgGr', bgx: {x: 'gBlock' }, fx: null,  iNext: 33, iAlt:  0, dbg: {block: 'gBlock', id: 32}}, //(K)---block------>(A)
			/*33*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext: 34, iAlt:  0, dbg: {block: 'gBlock', id: 33}}, //(K)-----';'------>(A)
			/*34*/ {bgd: 'BgSy', bgx: {x: 'zRTN'   }, fx: null,  iNext: 35, iAlt:  0, dbg: {block: 'gBlock', id: 34}}, //(K)---'return'--->(A)
			/*35*/ {bgd: 'BgGr', bgx: {x: 'gExpr'  }, fx: null,  iNext: 36, iAlt:  0, dbg: {block: 'gBlock', id: 35}}, //(K)---expression->(A)
			/*36*/ {bgd: 'BgSy', bgx: {x: ';'      }, fx: null,  iNext: 22, iAlt:  0, dbg: {block: 'gBlock', id: 36}}  //(K)-----';'------>(A)
		];
		this.tBog = {
			gProg:   {name: 'program',    type:   gProg},
			gBlock:  {name: 'block',      type:  gBlock},
			gStatem: {name: 'statement',  type: gStatem},
			gCond:   {name: 'condition',  type:   gCond},
			gExpr:   {name: 'expression', type:   gExpr},
			gTerm:   {name: 'term',       type:   gTerm},
			gFact:   {name: 'factor',     type:   gFact},
			gAssign: {name: 'assignment', type:   gAssign}
		};
		//debug level
		this.debug = {
			enabled: true,
			level: -1
		};
		if (this.debug.enabled === false) {
			console.log = function () {};
		}
		this.relAddress = 0;//counter for procedure length
		this.lastAddedNamedConst = [];
		this.jumpLabels = [];//labels for conditional jumps
		this.whileLabels = [];//labels for while jumps
		this.andOrBuffer = [];//labels for bool operators
		this.EntryProcIndex = undefined;
		this.conditionTemp = '';//tmp string for conditions
		this.parserOutput = '';//output string
		this.parserInstances = 0;//for debugging purposes
		this.codeOutput = [];//array for output
		this.lexer = lexer;//lexer
		this.lexer.initLex();
		this.readyCallbacks = [readyFunction];
		this.nameList = new NameList(); //name list
		var res = this.pars(this.tBog.gProg, 0);
		if (this.debug.level > 1) {
			console.log('PARSER: quit with code ', (res === 1 || res === true) ? 'OK' : 'ERROR');
		}
		$('#output').val(this.lexer.resString);
		$('#parser-output').val(this.parserOutput);
		$('#code-output').val(this.codeOutput.join("\n"));
		$('#loader').hide();
		if (res === 1 || res === true) {
			$('#parse-ok').show();
		}
		if (input === 'generateCode') {
			var codeGen = new CodeGen(this.codeOutput.join("\n")),
				code = codeGen.generate();
			$('#js-output').val(js_beautify(code));
			//execute script
			if (res === 1 || res === true) {
				eval(code);
			}
		}
		this.setReady();

		return 0;
	},

	/**
	 * callback function when ready
	 */
	setReady: function () {
		for (var i = 0; i < this.readyCallbacks.length; i++) {
			if (typeof (this.readyCallbacks[i]) === 'function') {
				this.readyCallbacks[i]();
			}
		}
	},

	/**
	 * convert integer to hex
	 *
	 * @param d
	 * @return {String}
	 */
	decimalToHex: function (d) {
		var hex = Number(d).toString(16);
		while (hex.length < 4) {
			hex = '0' + hex;
		}

		return hex.toUpperCase();
	},

	/**
	 * main function
	 *
	 * @param pGraph
	 * @param index
	 * @return {*}
	 */
	pars: function (pGraph, index) {
		this.parserInstances++;
		var tabs = '';
		if (this.debug.level > 4) {
			if (this.parserInstances == 2) {
				tabs = '222 ';
			}
			if (this.parserInstances == 3) {
				tabs = '222333 ';
			}
			if (this.parserInstances == 4) {
				tabs = '222333444 ';
			}
			if (this.parserInstances == 5) {
				tabs = '222333444555 ';
			}
			if (this.parserInstances == 6) {
				tabs = '222333444555666 ';
			}
			if (this.parserInstances == 7) {
				tabs = '222333444555666777 ';
			}
		}
		if (this.debug.level > 3) {
			console.log(tabs + 'parsing new graph ', pGraph.name, 'on index ', index);
		}
		var success = false,
			tokenEaten = 0,
			morph,
			pBog = pGraph.type[index];
		if (this.debug.level > 3) {
			console.log('PARSER: current pBog now is ', pBog);
		}
		if (this.lexer.Morph.MC === 'mcEmpty') {
			morph = this.lexer.lex();
			if (morph === false) {
				console.log('### ERROR in lexer ###');
			}
		}
		if (this.debug.level > 3) {
			console.log('PARSER: current morphem now is ', this.lexer.Morph, this.lexer.Morph.Val);
		}
		while (true) {
			if (this.debug.level > 4) {
				console.log('PARSER: current pBog now is ', pBog.dbg.block, pBog.dbg.id);
			}
			switch(pBog.bgd) {
				case 'BgNl':
					success = true;
					if (this.debug.level > 3) {
						console.log('PARSER: found BgNl, success.');
					}
					break;
				case 'BgSy':
					success = (this.lexer.Morph.Val.Symb === pBog.bgx.x);
					if (this.debug.level > 3) {
						console.log('PARSER: found BgSy ', this.lexer.Morph.Val.Symb, '  success now is ', success);
					}
					break;
				case 'BgMo':
					success = (this.lexer.Morph.MC === pBog.bgx.x);
					if (this.debug.level > 3) {
						console.log('PARSER: found BgMo, success now is ', success);
						console.log('PARSER: morph MC: ', this.lexer.Morph.MC, ' pBog m: ', pBog.bgx);
					}
					break;
				case 'BgGr':
					if (this.debug.level > 4) {
						console.log(tabs + 'parsing new graph');
					}
					success = this.pars(this.tBog[pBog.bgx.x], 0);
					if (this.debug.level > 3) {
						console.log('PARSER: found BgGr');
					}
					break;
				case 'BgEn':
					this.parserInstances--;
					if (this.debug.level > 3) {
						console.log(tabs + 'leaving graph', pGraph.name);
					}
					return true;
			}
			if (success !== true) {
				if (pBog.iAlt !== 0) {
					if (this.debug.level > 5) {
						console.log('PARSER: Trying alternative ', pBog.iAlt);
					}
					index++;
					pBog = pGraph.type[pBog.iAlt];
				}
				else {
					var msg = $('#alert-message'),
						oldHtml = msg.html();
					msg.html(oldHtml + "\n" + 'Could not parse pBog ' + pBog.bgd + ' in graph ' + pGraph.name + ' (Error in line ' + this.lexer.Morph.PosLine + ', row ' + this.lexer.Morph.PosCol + ')<br />');
					$('#parse-alert').show();
					if (tokenEaten > 0) {
						console.log(tabs + 'ERROR: Could not parse pBog', pBog, ' in graph ', pGraph.name, ', current morphem: ', this.lexer.Morph);
						return -1;
					}
					console.log(tabs + 'ERROR: Parser quit with error and no alternative.', pBog.bgd);
					return 0;
				}
			} else {
				if (this.debug.level > 4) {
					console.log(tabs + ' morphem accepted');
				}
				//formally accepted morphem
				if (pBog.fx !== null) {
					//execute associated function
					var success2 = this[pBog['fx']]();
					if (success2 !== true) {
						console.log('ERROR: ', pBog.fx, ' returned ', success);
						return false;
					}
				}
				if (pBog.bgd === 'BgSy' || pBog.bgd === 'BgMo') {
					if (this.debug.level > 3) {
						console.log('PARSER: accepted ', pBog.bgd);
					}
					this.parserOutput += '\n Bogen: ' + pBog.bgd + ' in graph ' + pGraph.name;
					if (this.debug.level > 3 && typeof(morph) !== 'undefined') {
						console.log('PARSER: Morphem accepted: ', this.lexer.Morph.Val.Symb, this.lexer.Morph.Val.pStr, this.lexer.Morph.Val.Numb);
					}
					morph = this.lexer.lex();
					tokenEaten++;
				}
				if (this.debug.level > 3) {
					console.log('PARSER: parsing pBog.iNext ', pBog.iNext);
				}
				pBog = pGraph.type[pBog.iNext];
			}
		}
	},

	/**
	 * generate corresponding intermediate code
	 *
	 * @param code
	 */
	generateCode: function (code) {
		if (this.debug.level > 1) {
			console.log('PARSER: generating code for ', code);
		}
		var nameList = this.nameList;
		switch (code) {
			case 'entryProc' :
				this.relAddress = 0;
				this.codeOutput.push(['EntryProc', 0, nameList.pCurrPr.IdxProc, nameList.pCurrPr.SpzzVar]);
				this.relAddress += 7;
				this.EntryProcIndex = this.codeOutput.length - 1;
				break;
			case 'retProc' :
				this.codeOutput.push('ReturnProc');
				this.relAddress += 1;
				var newEntryProc = 'EntryProc ' + this.decimalToHex(this.relAddress) + ', ' + this.decimalToHex(this.codeOutput[this.EntryProcIndex][2]) + ', ' + this.decimalToHex(this.codeOutput[this.EntryProcIndex][3]);
				this.codeOutput[this.EntryProcIndex] = newEntryProc;
				this.relAddress = 0;
				break;
			case 'opAdd' :
				this.codeOutput.push('Add');
				this.relAddress += 1;
				break;
			case 'opSub' :
				this.codeOutput.push('Sub');
				this.relAddress += 1;
				break;
			case 'vzMinus' :
				this.codeOutput.push('VzMinus');
				this.relAddress += 1;
				break;
			case 'opMul':
				this.codeOutput.push('Mul');
				this.relAddress += 1;
				break;
			case 'opDiv' :
				this.codeOutput.push('Div');
				this.relAddress += 1;
				break;
			case 'storeval' :
				this.codeOutput.push('StoreVal');
				this.relAddress += 1;
				break;
			case 'odd' :
				this.codeOutput.push('Odd');
				this.relAddress += 1;
				break;
			case 'putVal' :
				this.codeOutput.push('PutVal');
				this.relAddress += 1;
				break;
			case 'CmpGreaterThen' :
				this.codeOutput.push('CmpGreaterThen');
				this.relAddress += 1;
				break;
			case 'CmpEqual' :
				this.codeOutput.push('CmpEqual');
				this.relAddress += 1;
				break;
			case 'CmpNotEqual' :
				this.codeOutput.push('CmpNotEqual');
				this.relAddress += 1;
				break;
			case 'CmpGreaterEqual' :
				this.codeOutput.push('CmpGreaterEqual');
				this.relAddress += 1;
				break;
			case 'CmpLessThen' :
				this.codeOutput.push('CmpLessThen');
				this.relAddress += 1;
				break;
			case 'CmpLessEqual' :
				this.codeOutput.push('CmpLessEqual');
				this.relAddress += 1;
				break;
			case 'constBlock' :
				for (var i = 0; i < nameList.pLConst.length; i++) {
					this.codeOutput.push('Const ' + this.decimalToHex(i) + ':' + this.decimalToHex(nameList.pLConst[i].Val));
				}
				break;
			default :
				break;
		}
	},

	/**
	 * program
	 *
	 * @return {Boolean}
	 */
	pr1: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: pr1()');
		}
		//write constants block to code file
		//write number of procedures to beginning of code file
		this.generateCode('constBlock');

		return true;
	},

	/**
	 * constants identifier
	 *
	 * @return {Boolean}
	 */
	bl1: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: bl1()');
		}
		var pCurrPr = this.nameList.pCurrPr,
			morph = this.lexer.Morph,
			nameList = this.nameList,
			pConst;

		//local search for identifier
		if (nameList.searchBez(pCurrPr, morph.Val.pStr)) {
			//found -> error
			console.log('ERROR: bez ', morph.Val.pStr, ' already exists.');
			return false;
		}
		//not found -> create identifier
		this.lastAddedNamedConst.push({pConst: pConst, morph: morph.Val.pStr});

		return true;
	},

	/**
	 * constants values
	 *
	 * @return {*}
	 */
	bl2: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: bl2()');
		}
		var la = this.lastAddedNamedConst.pop(),
			nameList = this.nameList,
			pConst,
			constSearched,
			returnValue;
		if (nameList.pCurrPr === null) {
			console.log('Error: parser got no pCurrPr');
			return false;
		}
		//searching for constant in constants block
		constSearched = nameList.searchConst(this.lexer.Morph.Val.Numb);
		if (this.debug.level > 3) {
			console.log('PARSER: bl2() found ', constSearched);
		}
		if (!constSearched) {
			//create constant and write index to constant declaration
			if (!(pConst = nameList.createConst(this.lexer.Morph.Val.Numb))) {
				console.log('ERROR: cannot create pConst with ', this.lexer.Morph.Val.Numb);
				return false;
			}
			returnValue = (this.nameList.createBez(la.morph, pConst) !== null);
		} else {
			//create identifier with existing value
			returnValue = (this.nameList.createBez(la.morph, constSearched) !== null);
		}

		return returnValue;
	},

	/**
	 * variables
	 *
	 * @return {Boolean}
	 */
	bl3: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: bl3()');
		}
		var pVar,
			pBez,
			nameList = this.nameList;
		if (nameList.pCurrPr === null) {
			return false;
		}
		//local search for identifier
		//already exists -> error
		if (nameList.searchBez(nameList.pCurrPr, this.lexer.Morph.Val.pStr)) {
			console.log('ERROR: bez ', this.lexer.Morph.Val.pStr, ' already exists.');
			return false;
		}
		//create variable declaration
		if (!(pVar = nameList.createVar())) {
			console.log('ERROR: could not create var.');
			return false;
		} else {
			if (this.debug.level > 3) {
				console.log('pVar ', pVar, ' successfully created.');
			}
		}
		//create identifier
		if (!(pBez = nameList.createBez(this.lexer.Morph.Val.pStr, pVar))) {
			console.log('ERROR: could not create pBez for', this.lexer.Morph.Val.pStr);
			return false;
		} else {
			if (this.debug.level > 3) {
				console.log('PARSER: pBez ', pBez, ' successfully created.');
			}
		}

		return true;
	},

	/**
	 * procedure ident
	 *
	 * @return {Boolean}
	 */
	bl4: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: bl4()');
		}
		var pProc,
			nameList = this.nameList;

		if (nameList.pCurrPr === null) {
			return false;
		}
		//local search for identifier
		//already exists -> error
		if (nameList.searchBez(nameList.pCurrPr, this.lexer.Morph.Val.pStr)) {
			console.log('ERROR: bez ', this.lexer.Morph.Val.pStr, ' already exists.');
			return false;
		}
		//create procedure declaration
		if (!(pProc = nameList.createProc(nameList.pCurrPr))) {
			return false;
		}
		//create identifier
		if (!(nameList.createBez(this.lexer.Morph.Val.pStr, pProc))) {
			return false;
		}
		//createProc() sets new procedure to current procedure

		return true;
	},

	/**
	 * end of procedure
	 *
	 * @return {Boolean}
	 */
	bl5: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: bl5()');
		}
		var nameList = this.nameList;
		this.generateCode('retProc');
		//parent procedure becomes new current procedure
		if (nameList.pCurrPr.pParent !== null) {
			nameList.list.pLBez.push(nameList.pCurrPr);
			nameList.pCurrPr = nameList.pCurrPr.pParent;
		}

		return true;
	},

	/**
	 * entryProc
	 *
	 * @return {Boolean}
	 */
	bl6: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: bl6()');
		}
		this.generateCode('entryProc');

		return true;
	},

	/**
	 * after ident in assignment statement
	 *
	 * @return {Boolean}
	 */
	st1: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st1()');
		}
		var nameList = this.nameList,
			ident;
		if (nameList.pCurrPr === null) {
			return false;
		}
		//global search for identifier
		ident = nameList.searchBezGlobal(this.lexer.Morph.Val.pStr);
		if (!ident) {
			//does not exist -> error
			console.log('ERROR: ident bez ', this.lexer.Morph.Val.pStr, ' does not exist.');
			return false;
		} else {
			//identifier is a variable?
			if (ident.pObj.tKz === 'KzVar') {
				//yes -> ok,
				if (ident.IdxProc === 0) {
					this.codeOutput.push('PushAdrVarMain ' + this.decimalToHex(ident.pObj.Dspl));
					this.relAddress += 3;
				} else if (ident.IdxProc === nameList.pCurrPr.IdxProc) {
					this.codeOutput.push('PushAdrVarLocal ' + this.decimalToHex(ident.pObj.Dspl));
					this.relAddress += 3;
				} else {
					this.codeOutput.push('PushAdrVarGlobal ' + this.decimalToHex(ident.pObj.Dspl) + ', ' + this.decimalToHex(ident.IdxProc));
					this.relAddress += 5;
				}

				return true;
			} else {
				//No, a constant or procedure -> error
				console.log('ERROR: expected KzVar, got ', ident.pObj.tKz);

				return false;
			}
		}
	},

	/**
	 * storeVal after expression in assignment statement
	 *
	 * @return {Boolean}
	 */
	st2: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st2()');
		}
		this.generateCode('storeval');

		return true;
	},

	/**
	 * if condition
	 *
	 * @return {Boolean}
	 */
	st3: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st3()');
		}
		if (this.andOrBuffer.length > 0) {
			var andOr = this.andOrBuffer.pop();
			if (andOr === 'and') {
				this.codeOutput.push('And');
			} else if (andOr === 'or') {
				this.codeOutput.push('Or');
			} else {
				console.log('ERROR: expected "and" or "or", but got ', andOr);
			}
		} else {

		}
		this.codeOutput.push('JmpNot 0000');
		this.jumpLabels.push({address: this.relAddress, index: this.codeOutput.length - 1});
		this.relAddress += 3;

		return true;
	},

	/**
	 * after if statement
	 *
	 * @return {Boolean}
	 */
	st4: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st4()');
		}
		var label = this.jumpLabels.pop(),
			begin = label.address,
			outputIndex = label.index,
			offset = this.decimalToHex(this.relAddress - begin - 3);
		this.jumpLabels.push({address: this.relAddress, index: outputIndex, offset: this.relAddress - begin - 3});
		this.codeOutput[outputIndex] = 'JmpNot ' + offset;

		return true;
	},

	/**
	 * after while
	 *
	 * @return {Boolean}
	 */
	st5: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st5()');
		}
		var label = {address: this.relAddress, index: null};
		this.whileLabels.push(label);

		return true;
	},

	/**
	 * while after condition
	 *
	 * @return {Boolean}
	 */
	st6: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st6()');
		}
		var label = this.whileLabels.pop();
		this.codeOutput.push('JmpNot 0000');
		this.relAddress += 3;
		label.index = this.codeOutput.length - 1;
		this.whileLabels.push(label);
		this.jumpLabels.push({address: this.relAddress, index: this.codeOutput.length - 1});

		return true;
	},

	/**
	 * while after statement
	 *
	 * @return {Boolean}
	 */
	st7: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st7()');
		}
		//jmp label
		var label = this.whileLabels.pop(),
			begin,
			outputIndex,
			offset;
		this.relAddress += 3;
		/* dirty hack for negative hex numbers */
		offset = parseInt(this.relAddress - label.address) - 1;
		offset = 65535 - offset;
		offset = this.decimalToHex(offset);
		this.codeOutput.push('Jmp ' + offset);

		//jmpnot label
		label = this.jumpLabels.pop();
		begin = label.address;
		outputIndex = label.index;
		offset = this.decimalToHex(this.relAddress - begin);
		this.codeOutput[outputIndex] = 'JmpNot ' + offset;

		return true;
	},

	/**
	 * call
	 *
	 * @return {Boolean}
	 */
	st8: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st8()');
		}
		var nameList = this.nameList;

		if (nameList.pCurrPr === null) {
			return false;
		}
		//global search for identifier
		var ident = nameList.searchBezGlobal(this.lexer.Morph.Val.pStr);
		//does not exist -> error
		if (!ident) {
			console.log('ERROR: call procedure ident ', this.lexer.Morph.Val.pStr, ' does not exist.');
			return false;
		} else {
			//is it a variable?
			if (ident.pObj.tKz === 'KzPrc') {
				//yes -> ok
				this.codeOutput.push('Call ' + this.decimalToHex(ident.IdxProc));
				this.relAddress += 3;
				return true;
			} else {
				//no, a procedure or constant -> error
				console.log('ERROR: expected identifier with type variable, got ', ident.pObj.tKz);
				return false;
			}
		}
	},

	/**
	 * input
	 *
	 * @return {Boolean}
	 */
	st9: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st9()');
		}
		var nameList = this.nameList;
		if (nameList.pCurrPr === null) {
			return false;
		}
		//global search for identifier
		var ident = nameList.searchBezGlobal(this.lexer.Morph.Val.pStr);
		if (!ident) {
			//does not exist? -> error
			console.log('ERROR: ident bez ', this.lexer.Morph.Val.pStr, ' does not exist.');
			return false;
		} else {
			//is it a variable?
			if (ident.pObj.tKz === 'KzVar') {
				//yes -> ok
				this.codeOutput.push('PushAdrVarMain ' + this.decimalToHex(ident.pObj.Dspl));
				this.codeOutput.push('GetVal');
				this.relAddress += 4;

				return true;
			} else {
				//no, constant or procedure -> error
				return false;
			}
		}
	},

	/**
	 * output
	 *
	 * @return {Boolean}
	 */
	st10: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st10()');
		}
		this.generateCode('putVal');

		return true;
	},

	/**
	 * string
	 *
	 * @return {Boolean}
	 */
	st11: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st11()');
		}
		this.codeOutput.push('PutString ' + this.lexer.Morph.Val.pStr);
		this.relAddress += (2 + this.lexer.Morph.Val.pStr.length);

		return true;
	},

	/**
	 * else
	 *
	 * @return {Boolean}
	 */
	st12: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: st12()');
		}
		this.codeOutput.push('Jmp 0000');
		var previousLabel = this.jumpLabels.pop(),
			label = {address: this.relAddress, index: this.codeOutput.length - 1};
		if (typeof(previousLabel.offset) !== 'undefined') {
			this.codeOutput[previousLabel.index] = 'JmpNot ' + this.decimalToHex(parseInt(previousLabel.offset) + 3);
		}
		this.jumpLabels.push(label);
		this.relAddress += 3;

		return true;
	},

	/**
	 * after else
	 *
	 * @return {Boolean}
	 */
	st13: function () {
		var label = this.jumpLabels.pop(),
			begin = label.address,
			outputIndex = label.index,
			offset = this.decimalToHex(this.relAddress - begin - 3);
		this.codeOutput[outputIndex] = 'Jmp ' + offset;

		return true;
	},

	/**
	 * negative value
	 *
	 * @return {Boolean}
	 */
	ex1: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: ex1()');
		}
		this.generateCode('vzMinus');

		return true;
	},

	/**
	 * plus
	 *
	 * @return {Boolean}
	 */
	ex2: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: ex2()');
		}
		this.generateCode('opAdd');

		return true;
	},

	/**
	 * minus
	 *
	 * @return {Boolean}
	 */
	ex3: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: ex3()');
		}
		this.generateCode('opSub');

		return true;
	},

	/**
	 * multiplication
	 *
	 * @return {Boolean}
	 */
	te1: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: te1()');
		}
		this.generateCode('opMul');

		return true;
	},

	/**
	 * division
	 *
	 * @return {Boolean}
	 */
	te2: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: te2()');
		}
		this.generateCode('opDiv');

		return true;
	},

	/**
	 * numeral
	 *
	 * @return {Boolean}
	 */
	fa1: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: fa1()');
		}
		var nameList = this.nameList,
			pConst;

		if (nameList.pCurrPr === null) {
			return false;
		}
		//searching for constant in constants block
		if (!(pConst = nameList.searchConst(this.lexer.Morph.Val.Numb))) {
			//write constant to constants block and add index to constant description
			if (!(pConst = nameList.createConst(this.lexer.Morph.Val.Numb))) {
				return false;
			}
		}
		this.codeOutput.push('PushConst ' + this.decimalToHex(pConst.Idx));
		this.relAddress += 3;

		return true;

	},

	fa2: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: fa2()');
		}
		var nameList = this.nameList,
			ident;

		if (nameList.pCurrPr === null) {
			return false;
		}
		//global search for identifier
		ident = nameList.searchBezGlobal(this.lexer.Morph.Val.pStr);
		if (!ident) {
			//does not exist? -> error
			console.log('ERROR: ident bez ', this.lexer.Morph.Val.pStr, ' does not exist.');
			return false;
		} else {
			//is it a variable or constant?
			if (ident.pObj.tKz === 'KzVar') {
				//yes -> ok
				if (ident.IdxProc === 0) {
					this.codeOutput.push('PushValVarMain ' + this.decimalToHex(ident.pObj.Dspl));
					this.relAddress += 3;
				} else if (ident.IdxProc === nameList.pCurrPr.IdxProc) {
					this.codeOutput.push('PushValVarLocal ' + this.decimalToHex(ident.pObj.Dspl));
					this.relAddress += 3;
				} else {
					this.codeOutput.push('PushValVarGlobal ' + this.decimalToHex(ident.pObj.Dspl) + ', ' + this.decimalToHex(ident.IdxProc));
					this.relAddress += 5;
				}

				return true;
			} else if (ident.pObj.tKz === 'KzConst') {
				this.codeOutput.push('PushConst ' + this.decimalToHex(ident.pObj.Idx));
				this.relAddress += 3;

				return true;
			} else {
				//no, procedure -> error
				return false;
			}
		}
	},

	/**
	 * odd
	 *
	 * @return {Boolean}
	 */
	co1: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co1()');
		}
		this.generateCode('odd');

		return true;
	},

	/**
	 * =
	 *
	 * @return {Boolean}
	 */
	co2: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co2()');
		}
		this.conditionTemp = 'CmpEqual';

		return true;
	},

	/**
	 * #
	 *
	 * @return {Boolean}
	 */
	co3: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co3()');
		}
		this.conditionTemp = 'CmpNotEqual';

		return true;
	},

	/**
	 * <
	 *
	 * @return {Boolean}
	 */
	co4: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co4()');
		}
		this.conditionTemp = 'CmpLessThen';

		return true;
	},

	/**
	 * <=
	 *
	 * @return {Boolean}
	 */
	co5: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co5()');
		}
		this.conditionTemp = 'CmpLessEqual';

		return true;
	},

	/**
	 * >
	 *
	 * @return {Boolean}
	 */
	co6: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co6()');
		}
		this.conditionTemp = 'CmpGreaterThen';

		return true;
	},

	/**
	 * >=
	 *
	 * @return {Boolean}
	 */
	co7: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co7()');
		}
		this.conditionTemp = 'CmpGreaterEqual';

		return true;
	},

	/**
	 * after expression
	 *
	 * @return {Boolean}
	 */
	co8: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co8()');
		}
		this.generateCode(this.conditionTemp);

		return true;
	},

	/**
	 * or
	 *
	 * @return {Boolean}
	 */
	co9: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co9()');
		}
		this.relAddress += 1;
		this.andOrBuffer.push('or');

		return true;
	},

	/**
	 * and
	 *
	 * @return {Boolean}
	 */
	co10: function () {
		if (this.debug.level > 3) {
			console.log('PARSER: co10()');
		}
		this.relAddress += 1;
		this.andOrBuffer.push('and');

		return true;
	}
};