/**
 * lexer_standalone.js - Test-Lexer without parser
 *
 * @param input
 */
StandaloneLexer = function(input){
	this.init(input);
};

/**
 * @type {Object}
 */
StandaloneLexer.prototype = {
	init: function(input, config){
		var defaults = { };
		this.vZKl = [
			/*     0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F      */
			/* 0*/ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, /* 0*/
			/*10*/ 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, /*10*/
			/*20*/ 7, 0, 8, 0, 0, 0, 0, 0, 0, 0,10, 0, 0, 0, 0, 9, /*20*/
			/*30*/ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 0, 5, 4, 6, 0, /*30*/
			/*40*/ 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, /*40*/
			/*50*/ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, /*50*/
			/*60*/ 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, /*60*/
			/*70*/ 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0  /*70*/
		];
		/*
		 * 0     special characters
		 * 1     numerals
		 * 2     letters
		 * 3     :
		 * 4     =
		 * 5     <
		 * 6     >
		 * 7     misc control characters
		 * 8     " for strings
		 * 9     / für comments
		 * 10    * für comments
		 * */
		this.vSMatrix = [
			//     sc     			       nu      		          le     			     ':'     		        '='     		        '<'     		       '>'    		          Space   		         '"'    			    '/'     		       '*'
			[/* 0*/{zs : 0, fkt : 'fslb'}, {zs : 1, fkt : 'fsl'}, {zs : 2, fkt : 'fgl'}, {zs : 3, fkt : 'fsl'}, {zs : 0, fkt : 'fslb'}, {zs : 4, fkt : 'fsl'}, {zs : 5, fkt : 'fsl'}, {zs : 0, fkt : 'fl' }, {zs : 9, fkt : 'fl' }, {zs :10, fkt : 'fsl'}, {zs : 0, fkt : 'fslb'}],
			[/* 1*/{zs : 0, fkt : 'fb'  }, {zs : 1, fkt : 'fsl'}, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }],
			[/* 2*/{zs : 0, fkt : 'fb'  }, {zs : 2, fkt : 'fsl'}, {zs : 2, fkt : 'fgl'}, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }],
			[/* 3*/{zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 6, fkt : 'fsl' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }],
			[/* 4*/{zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 7, fkt : 'fsl' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }],
			[/* 5*/{zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 8, fkt : 'fsl' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }],
			[/* 6*/{zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }],
			[/* 7*/{zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }],
			[/* 8*/{zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }],
			//strings
			[/* 9*/{zs : 9, fkt : 'fsl'  }, {zs : 9, fkt : 'fsl' }, {zs : 9, fkt : 'fsl' }, {zs : 9, fkt : 'fsl' }, {zs : 9, fkt : 'fsl'  }, {zs : 9, fkt : 'fsl' }, {zs : 9, fkt : 'fsl' }, {zs : 9, fkt : 'fsl' }, {zs : 0, fkt : 'flb' }, {zs : 9, fkt : 'fsl' }, {zs : 9, fkt : 'fsl'  }],
			//comments
			//reading first "*"
			[/*10*/{zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs :11, fkt : 'frl'}],
			//"/" after "*"
			[/*11*/{zs :11, fkt : 'frl'},  {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl' }, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :12, fkt : 'frl'}],
			//after second"*"
			[/*12*/{zs :11, fkt : 'frl'},  {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl' }, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs : 0, fkt : 'frl'}, {zs :12, fkt : 'frl'}]
		];
		//mapping keyword -> keyword code (lines: length, rows: initial letter)
		this.tKeyWordTab = [
			/* Len:   		2 			                3           			            4            				        5 			                        6         			            7         				            8         			            9     */
			/* A */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: 'ND', KWCode : 'zAND'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* B */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: 'EGIN', KWCode : 'zBGN'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* C */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: 'ALL',  KWCode : 'zCLL'}, {pKeyWord: 'ONST', KWCode : 'zCST'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* D */ [{pKeyWord: 'O'  , KWCode : 'zDO' },{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* E */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: 'ND', KWCode : 'zEND'},{pKeyWord: 'LSE',  KWCode : 'zELSE'},{pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* F */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* G */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* H */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* I */ [{pKeyWord: 'F'  , KWCode : 'zIF' },{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* J */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* K */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: 'ASE',  KWCode : 'zCASE'},{pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* L */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* M */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* N */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* O */ [{pKeyWord:  'R' , KWCode : 'zOR' },{pKeyWord: 'DD', KWCode : 'zODD'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* P */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: 'ROCEDURE',KWCode: 'zPRC'}],
			/* Q */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* R */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* S */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: 'WITCH', KWCode : 'zSWITCH'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* T */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: 'HEN',  KWCode : 'zTHN'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* U */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* V */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: 'AR', KWCode : 'zVAR'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* W */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: 'HILE', KWCode : 'zWHL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* X */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* Y */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* Z */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}]
		];

		if (input.input == '' || input.input === undefined) {
			this.pIF = 'var a,b,Max;.';
		} else {
			this.pIF = input.input;
		}
		this.fileIndex = 0;
		this.X = '';
		this.Z = 0;
		this.vBuf = '';

		this.Morph = {
			MC : 'mcEmpty',
			PosLine: 0,
			PosCol: 0,
			MLen: 0,
			Val: {
				Numb: 0,
				pStr: '',
				Symb: 0
			}
		};
		this.MorphInit = {
			MC : 'mcEmpty',
			PosLine: 0,
			PosCol: 0,
			MLen: 0,
			Val: {
				Numb: 0,
				pStr: '',
				Symb: 0
			}
		};
		if (this.pIF.length > 0) {
			this.X = this.pIF[0];
			this.fileIndex++;
		}
		var i = 0,
			res = [],
			resString = '',
			fail = false;
		while (this.Morph.Val.Symb != 'EOF' && this.Morph.Val.Symb != '.') {
			if (++i > 200) {
				console.log('probably hanging, so break.');
				break;
			}
			fail = this.lex();
			if (fail === false) {
				console.log('breaking because of error.');
				break;
			}
			resString += '\n' + 'Line ' + this.Morph.PosLine + ' column ' + this.Morph.PosCol + ': ';
			switch(this.Morph.MC) {
				case 'mcSymb' :
					if (this.Morph.Val.Symb == 'zErg') {
						console.log('Symbol :=');
						resString += 'Symbol :=';
						res.push({type: 'symbol', content : ':=', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zle') {
						console.log('Symbol lte');
						resString += 'Symbol lte';
						res.push({type: 'symbol', content : '<=', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zge') {
						console.log('Symbol gte');
						resString += 'Symbol gte';
						res.push({type: 'symbol', content : '>=', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zBGN') {
						console.log('Symbol _BEGIN');
						resString += 'Symbol _BEGIN';
						res.push({type: 'symbol', content : 'BEGIN', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zCLL') {
						console.log('Symbol _CALL');
						resString += 'Symbol _CALL';
						res.push({type: 'symbol', content : 'CALL', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zCST') {
						console.log('Symbol _CONST');
						console.log('got morph: ', this.Morph);
						resString += 'Symbol _CONST';
						res.push({type: 'symbol', content : 'CONST', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zDO') {
						console.log('Symbol _DO');
						resString += 'Symbol _DO';
						res.push({type: 'symbol', content : 'DO', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zEND') {
						console.log('Symbol _END');
						resString += 'Symbol _END';
						res.push({type: 'symbol', content : 'END', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zIF') {
						console.log('Symbol _IF');
						resString += 'Symbol _IF';
						res.push({type: 'symbol', content : 'IF', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zODD') {
						console.log('Symbol _ODD');
						resString += 'Symbol _ODD';
						res.push({type: 'symbol', content : 'ODD', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zPRC') {
						console.log('Symbol _PROCEDURE');
						resString += 'Symbol _PROCEDURE';
						res.push({type: 'symbol', content : 'PROCEDURE', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zTHN') {
						console.log('Symbol _THEN');
						resString += 'Symbol _THEN';
						res.push({type: 'symbol', content : 'THEN', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zVAR') {
						console.log('Symbol _VAR');
						resString += 'Symbol _VAR';
						res.push({type: 'symbol', content : 'VAR', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zWHL') {
						console.log('Symbol _WHILE');
						resString += 'Symbol _WHILE';
						res.push({type: 'symbol', content : 'WHILE', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zSWITCH') {
						console.log('Symbol _SWITCH');
						resString += 'Symbol _SWITCH';
						res.push({type: 'symbol', content : 'SWITCH', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (this.Morph.Val.Symb == 'zCASE') {
						console.log('Symbol _CASE');
						resString += 'Symbol _CASE';
						res.push({type: 'symbol', content : 'CASE', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else if (typeof(this.Morph.Val.Symb) !== 'undefined' && this.Morph.Val.Symb.charCodeAt(0) < 128) {
						console.log('Symbol ', this.Morph.Val.Symb);
						resString += 'Symbol ' + this.Morph.Val.Symb;
						res.push({type: 'symbol', content : this.Morph.Val.Symb, line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					else {
						console.log('Symbol EOF');
						this.Morph.Val.Symb = 'EOF';
						resString += 'Symbol EOF';
						res.push({type: 'symbol', content : 'EOF', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
					break;
				case 'mcNumb' :
					console.log('Zahl: ',this.Morph.Val.Numb);
					res.push({type: 'number', content : this.Morph.Val.Numb, line: this.Morph.PosLine, columns: this.Morph.PosCol});
					resString += 'Number: ' + this.Morph.Val.Numb;
					break;
				case 'mcIdent':
					console.log('Ident: ', this.Morph.Val.pStr);
					resString += 'Ident: ' + this.Morph.Val.pStr;
					res.push({type: 'ident', content : this.Morph.Val.pStr, line: this.Morph.PosLine, columns: this.Morph.PosCol});
					break;
				default:
					if(this.Morph.Val.pStr && (this.Morph.Val.pStr.length > 0)) {
						console.log('String: ', this.Morph.Val.pStr);
						resString += 'String: ' + this.Morph.Val.pStr;
						res.push({type: 'string', content : this.Morph.Val.pStr, line: this.Morph.PosLine, columns: this.Morph.PosCol});
					} else {
						console.log('mcEmpty');
						resString += 'mcEmpty';
						res.push({type: 'empty', content : '', line: this.Morph.PosLine, columns: this.Morph.PosCol});
					}
			}
			$('#output').val(resString);
			$('#loader').hide();
		}

		return 0;
	},

	fgetc: function (input) {
		if (typeof(this.fileIndex) === 'undefined' || typeof(input[this.fileIndex]) === 'undefined') {
			return;
		}
		var value = input[this.fileIndex];
		this.fileIndex++;
		return value;
	},

	lex: function() {
		var Zn,
			functionToCall = '';
		this.Morph = this.MorphInit;
		this.stop = 0;
		while (this.stop == 0) {
			if (typeof(this.X) === 'undefined') {
				return false;
			}
			console.log('checking ', this.X, ', alter zustand: ', this.Z);
			Zn = this.vSMatrix[this.Z][this.vZKl[this.X.charCodeAt(0)]].zs;
			functionToCall = this.vSMatrix[this.Z][this.vZKl[this.X.charCodeAt(0)]].fkt;
			console.log('Folgezustand: ', Zn, 'about to call ', functionToCall);
			this[functionToCall]();
			this.Z = Zn;
		}
		return this.Morph;
	},

	fl: function() {
		console.log('fl()');
		if(!this.pIF) {
			return;
		}
		this.X = this.fgetc(this.pIF);
		console.log('read ', this.X);

		if (this.X == '\n') {
			this.MorphInit.PosLine++;
			this.MorphInit.PosCol = 1;
		}
		else {
			this.MorphInit.PosCol++;
		}
	},

	fs: function() {
		this.vBuf += this.X;
		console.log('fs() x: ', this.X, ' vBuf now is: ', this.vBuf, ' zustand ', this.Z);
	},

	/* quit */
	fb: function() {
		console.log('fb() mit buffer ', this.vBuf, ' in Zustand ', this.Z, 'und vBuf[0] ', this.vBuf[0]);
		this.stop = 1;
		var chars ='_ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		switch(this.Z) {
			case 1: //numeral
				this.Morph.MC = 'mcNumb';
				this.Morph.Val.Numb = parseInt(this.vBuf);
				this.Morph.Val.pStr = null;
				this.Morph.Val.Symb = null;
				break;

			case 2: //identifier
				//search for identifier with initial letter and string length
				if (
					(this.vBuf.length > 1 && this.vBuf.length < 10)
						&&
						(this.tKeyWordTab[ parseInt(chars.indexOf(this.vBuf[0].toUpperCase()) - chars.indexOf('A')) ][(this.vBuf.length)-2].pKeyWord != '0L')
						&&
						(this.tKeyWordTab[ parseInt(chars.indexOf(this.vBuf[0].toUpperCase()) - chars.indexOf('A'))][(this.vBuf.length)-2].pKeyWord == this.vBuf.substr(1) )
					) {
					this.Morph.MC = 'mcSymb';
					this.Morph.Val.Symb = this.tKeyWordTab[parseInt(chars.indexOf(this.vBuf[0].toUpperCase()) - chars.indexOf('A'))][this.vBuf.length-2].KWCode;
					this.Morph.Val.pStr = null;
					this.Morph.Val.Numb = null;
				} else {
					this.Morph.MC = 'mcIdent';
					this.Morph.Val.pStr = this.vBuf;
					this.Morph.Val.Numb = null;
					this.Morph.Val.Symb = null;
				}
				break;

			case 0: //symbol
			case 3: //:
			case 4: //<
			case 5: //>
			case 10: //*
				this.Morph.MC = 'mcSymb';
				this.Morph.Val.Symb = this.vBuf[0];
				this.Morph.Val.pStr = null;
				this.Morph.Val.Numb = null;
				console.log('created morph', this.Morph.Val.Symb);
				break;

			case 6: //:=
				this.Morph.MC = 'mcSymb';
				this.Morph.Val.Symb = 'zErg';
				this.Morph.Val.pStr = null;
				this.Morph.Val.Numb = null;
				break;

			case 7: //<=
				this.Morph.MC = 'mcSymb';
				this.Morph.Val.Symb = 'zle';
				this.Morph.Val.pStr = null;
				this.Morph.Val.Numb = null;
				break;

			case 8: // >=
				this.Morph.MC = 'mcSymb';
				this.Morph.Val.Symb = 'zge';
				this.Morph.Val.pStr = null;
				this.Morph.Val.Numb = null;
				break;

			case 9:
				this.Morph.MC = 'mcStrng';
				this.Morph.Val.pStr = this.vBuf;
				this.Morph.Val.Symb = null;
				this.Morph.Val.Numb = null;
				break;

			case 11:
			case 12:
				break;
			default:
				this.Morph.MC = 'mcEmpty';
				this.Morph.Val.pStr = null;
				this.Morph.Val.Numb = null;
				this.Morph.Val.Symb = null;
		}
		this.Morph.MLen = this.vBuf.length;
		this.vBuf = '';
	},

	/* write uppercase + read */
	fgl: function() {
		console.log('fgl()');
		this.X = this.X.toUpperCase();
		this.fs();
		this.fl();
	},

	/* write + read*/
	fsl: function() {
		console.log('fsl()');
		this.fs();
		this.fl();
	},

	/* write + read + quit */
	fslb: function() {
		console.log('fslb()', this.vBuf);
		this.fs();
		this.fl();
		this.fb();
	},

	/* read + quit */
	flb: function() {
		console.log('flb()');
		this.fl();
		this.fb();
	},

	/* reset buffer */
	fr: function() {
		console.log('fr()');
		this.vBuf = '';
	},

	/* reset buffer + read */
	frl: function() {
		console.log('frl()');
		this.fr();
		this.fl();
	}
};

/* onload init */
var standaloneLexer = {};
jQuery(function ($) {
	$("#lexer-submit").click(function () {
		$('#loader').show();
		$('.nav-tabs .active').removeClass('active');
		$('.tab-content .tab-pane').removeClass('active');
		$('#output-wrap').addClass('active');
		$('#lex-nav').addClass('active');
		$('#output').val('');
		$('#parser-output').val('');
		$('#alert-message').html('');
		$('#parse-alert').hide();
		window.setTimeout(function () {
			standaloneLexer = new StandaloneLexer({input: $('#input').val()});
		}, 500);
	});
});