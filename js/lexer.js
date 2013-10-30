/**
 * lexer.js - Lexer
 *
 * @param input
 */
Lexer = function (input) {
	this.init(input);
};

/**
 *
 * @type {Object}
 */
Lexer.prototype = {
	init: function (input) {
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
		/**
		 * character classes:
		 * 0     special characters
		 * 1     numerals
		 * 2     letters
		 * 3     :
		 * 4     =
		 * 5     <
		 * 6     >
		 * 7     misc control characters
		 * 8     " for Strings
		 * 9     / for comments
		 * 10    * for comments
		 **/
		//table for finite state machine  (rows: state, row: character class)
		this.vSMatrix = [
			//     special character        numeral               character     	     ':'     		        '='     		        '<'     		       '>'    		          space   		         '"'    			    '/'     		       '*'
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
			[/* 9*/{zs : 9, fkt : 'fsl' }, {zs : 9, fkt : 'fsl'}, {zs : 9, fkt : 'fsl'}, {zs : 9, fkt : 'fsl'}, {zs : 9, fkt : 'fsl' }, {zs : 9, fkt : 'fsl'}, {zs : 9, fkt : 'fsl'}, {zs : 9, fkt : 'fsl'}, {zs : 0, fkt : 'flb'}, {zs : 9, fkt : 'fsl'}, {zs : 9, fkt : 'fsl' }],
			//comments
			//reading first "*"
			[/*10*/{zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb'  }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs : 0, fkt : 'fb' }, {zs :11, fkt : 'frl' }],
			//"/" or else after "*"
			[/*11*/{zs :11, fkt : 'frl'},  {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl' }, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :12, fkt : 'frl' }],
			//reading second "*"
			[/*12*/{zs :11, fkt : 'frl'},  {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl' }, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs :11, fkt : 'frl'}, {zs : 0, fkt : 'frl'}, {zs :12, fkt : 'frl' }]
		];
		//Mapping keyword -> keyword code (rows: length of keyword, columns: initial letter)
		this.tKeyWordTab = [
			/* Len:   		2 			                3           			            4            				        5 			                        6         			            7         				            8         			              9     */
			/* A */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: 'ND', KWCode : 'zAND'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* B */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: 'EGIN', KWCode : 'zBGN'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* C */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: 'ALL',  KWCode : 'zCLL'}, {pKeyWord: 'ONST', KWCode : 'zCST'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* D */ [{pKeyWord: 'O'  , KWCode : 'zDO' },{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* E */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: 'ND', KWCode : 'zEND'},{pKeyWord: 'LSE',  KWCode : 'zELSE'},{pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* F */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: 'OR', KWCode : 'zFOR'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: 'UNCTION',KWCode : 'zFNC'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* G */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* H */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* I */ [{pKeyWord: 'F'  , KWCode : 'zIF' },{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* J */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* K */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: 'ASE',  KWCode : 'zCASE'},{pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* L */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* M */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* N */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* O */ [{pKeyWord:  'R' , KWCode : 'zOR' },{pKeyWord: 'DD', KWCode : 'zODD'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* P */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: 'ROCEDURE',KWCode: 'zPRC'}],
			/* Q */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* R */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: 'ETURN', KWCode : 'zRTN'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* S */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: 'WITCH', KWCode : 'zSWITCH'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* T */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: 'HEN',  KWCode : 'zTHN'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* U */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* V */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: 'AR', KWCode : 'zVAR'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* W */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: 'HILE', KWCode : 'zWHL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* X */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* Y */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}],
			/* Z */ [{pKeyWord: '0L' , KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',   KWCode : 'zNIL'}, {pKeyWord: '0L',   KWCode : 'zNIL'},{pKeyWord: '0L',    KWCode : 'zNIL'},   {pKeyWord: '0L', KWCode : 'zNIL'},{pKeyWord: '0L',     KWCode : 'zNIL'},{pKeyWord: '0L', KWCode : 'zNIL'}]
		];
		//debug mode levels
		this.debug = {
			enabled: true,
			level: -1
		};
		this.input = input.input; //input string
		this.fileIndex = 0; //index of current character in input string
		this.X = ''; //current character
		this.Z = 0; //current state
		this.vBuf = ''; //character buffer
		this.pIF = null; //input "file"
		//morphem prototype
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
		this.res = []; //result array
		this.resString = ''; //result string for debugging
	},

	/**
	 * initialize lexer
	 *
	 * @return {Boolean}
	 */
	initLex: function () {
		if (this.input == '' || this.input === undefined) {
			this.pIF = 'var a,b,Max;.';
		} else {
			this.pIF = this.input;
		}
		if (this.debug.level > 1) {
			console.log('LEXER: Lexer init with ', this.pIF);
		}
		if (this.pIF.length > 0) {
			this.X = this.pIF[0];
			this.fileIndex++;
		}
		return true;
	},

	/**
	 * read next character from input
	 *
	 * @param input
	 * @return {*}
	 */
	fgetc: function (input) {
		if (typeof(this.fileIndex) === 'undefined' || typeof(input[this.fileIndex]) === 'undefined') {
			return;
		}
		var value = input[this.fileIndex];
		this.fileIndex++;
		return value;
	},

	/**
	 * lex main function
	 *
	 * @return {*}
	 */
	lex: function () {
		var Zn,
			functionToCall = '';
		this.Morph = this.MorphInit;
		this.stop = 0;
		while (this.stop == 0) {
			if (typeof(this.X) === 'undefined') {
				return false;
			}
			Zn = this.vSMatrix[this.Z][this.vZKl[this.X.charCodeAt(0)]].zs;
			functionToCall = this.vSMatrix[this.Z][this.vZKl[this.X.charCodeAt(0)]].fkt;
			this[functionToCall]();
			this.Z = Zn;
		}
		this.resString += '\n' + 'Line ' + this.Morph.PosLine + ' column ' + this.Morph.PosCol + ': ';
		switch(this.Morph.MC) {
			case 'mcSymb' :
				if (this.Morph.Val.Symb == 'zErg') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol :=');
					}
					this.resString += 'Symbol :=';
					this.res.push({type: 'symbol', content : ':=', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zle') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol lte');
					}
					this.resString += 'Symbol lte';
					this.res.push({type: 'symbol', content : '<=', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zge') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol gte');
					}
					this.resString += 'Symbol gte';
					this.res.push({type: 'symbol', content : '>=', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zBGN') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _BEGIN');
					}
					this.resString += 'Symbol _BEGIN';
					this.res.push({type: 'symbol', content : 'BEGIN', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zCLL') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _CALL');
					}
					this.resString += 'Symbol _CALL';
					this.res.push({type: 'symbol', content : 'CALL', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zCST') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _CONST');
					}
					this.resString += 'Symbol _CONST';
					this.res.push({type: 'symbol', content : 'CONST', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zDO') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _DO');
					}
					this.resString += 'Symbol _DO';
					this.res.push({type: 'symbol', content : 'DO', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zEND') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _END');
					}
					this.resString += 'Symbol _END';
					this.res.push({type: 'symbol', content : 'END', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zIF') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _IF');
					}
					this.resString += 'Symbol _IF';
					this.res.push({type: 'symbol', content : 'IF', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zFOR') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _FOR');
					}
					this.resString += 'Symbol _FOR';
					this.res.push({type: 'symbol', content : 'FOR', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zAND') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _AND');
					}
					this.resString += 'Symbol _AND';
					this.res.push({type: 'symbol', content : 'AND', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zOR') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _OR');
					}
					this.resString += 'Symbol _OR';
					this.res.push({type: 'symbol', content : 'OR', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zELSE') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _ELSE');
					}
					this.resString += 'Symbol _ELSE';
					this.res.push({type: 'symbol', content : 'ELSE', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zODD') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _ODD');
					}
					this.resString += 'Symbol _ODD';
					this.res.push({type: 'symbol', content : 'ODD', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zPRC') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _PROCEDURE');
					}
					this.resString += 'Symbol _PROCEDURE';
					this.res.push({type: 'symbol', content : 'PROCEDURE', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zFNC') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _FUNCTION');
					}
					this.resString += 'Symbol _FUNCTION';
					this.res.push({type: 'symbol', content : 'FUNCTION', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zRTN') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _RETURN');
					}
					this.resString += 'Symbol _RETURN';
					this.res.push({type: 'symbol', content : 'RETURN', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zTHN') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _THEN');
					}
					this.resString += 'Symbol _THEN';
					this.res.push({type: 'symbol', content : 'THEN', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zVAR') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _VAR');
					}
					this.resString += 'Symbol _VAR';
					this.res.push({type: 'symbol', content : 'VAR', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zWHL') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _WHILE');
					}
					this.resString += 'Symbol _WHILE';
					this.res.push({type: 'symbol', content : 'WHILE', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zSWITCH') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _SWITCH');
					}
					this.resString += 'Symbol _SWITCH';
					this.res.push({type: 'symbol', content : 'SWITCH', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (this.Morph.Val.Symb == 'zCASE') {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol _CASE');
					}
					this.resString += 'Symbol _CASE';
					this.res.push({type: 'symbol', content : 'CASE', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else if (typeof(this.Morph.Val.Symb) !== 'undefined' && this.Morph.Val.Symb.charCodeAt(0) < 128) {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol ', this.Morph.Val.Symb);
					}
					this.resString += 'Symbol ' + this.Morph.Val.Symb;
					this.res.push({type: 'symbol', content : this.Morph.Val.Symb, line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				else {
					if (this.debug.level > 0) {
						console.log('LEXER: Symbol EOF');
					}
					this.Morph.Val.Symb = 'EOF';
					this.resString += 'Symbol EOF';
					this.res.push({type: 'symbol', content : 'EOF', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
				break;
			case 'mcNumb' :
				if (this.debug.level > 0) {
					console.log('LEXER: Zahl: ',this.Morph.Val.Numb);
				}
				this.res.push({type: 'number', content : this.Morph.Val.Numb, line: this.Morph.PosLine, columns: this.Morph.PosCol});
				this.resString += 'Number: ' + this.Morph.Val.Numb;
				break;
			case 'mcIdent':
				if (this.debug.level > 0) {
					console.log('LEXER: Ident: ', this.Morph.Val.pStr);
				}
				this.resString += 'Ident: ' + this.Morph.Val.pStr;
				this.res.push({type: 'ident', content : this.Morph.Val.pStr, line: this.Morph.PosLine, columns: this.Morph.PosCol});
				break;
			default:
				if (this.Morph.Val.pStr && (this.Morph.Val.pStr.length > 0)) {
					if (this.debug.level > 0) {
						console.log('LEXER: String: ', this.Morph.Val.pStr);
					}
					this.resString += 'String: ' + this.Morph.Val.pStr;
					this.res.push({type: 'string', content : this.Morph.Val.pStr, line: this.Morph.PosLine, columns: this.Morph.PosCol});
				} else {
					if (this.debug.level > 0) {
						console.log('LEXER: mcEmpty');
					}
					this.resString += 'mcEmpty';
					this.res.push({type: 'empty', content : '', line: this.Morph.PosLine, columns: this.Morph.PosCol});
				}
		}
		if (this.debug.level > 4) {
			console.log('LEXER: lexer run got ', this.Morph);
		}
		return this.Morph;
	},

	/**
	 * read next character
	 */
	fl: function () {
		if (this.debug.level > 4) {
			console.log('LEXER: fl()');
		}
		if (!this.pIF) {
			return;
		}
		this.X = this.fgetc(this.pIF);
		if (this.X == '\n') {
			this.MorphInit.PosLine++;
			this.MorphInit.PosCol = 1;
		}
		else {
			this.MorphInit.PosCol++;
		}
	},

	/**
	 *  write character
	 */
	fs: function () {
		if (this.debug.level > 4) {
			console.log('LEXER: fs()');
		}
		this.vBuf += this.X;
	},

	/**
	 * exit
	 */
	fb: function () {
		if (this.debug.level > 4) {
			console.log('LEXER: fb()', this.vBuf, ' got Z: ', this.Z);
		}
		this.stop = 1;
		//helper for index calculation
		var chars ='_ABCDEFGHIJKLMNOPQRSTUVWXYZ';

		switch(this.Z) {
			case 1: //numeral
				this.Morph.MC = 'mcNumb';
				this.Morph.Val.Numb = parseInt(this.vBuf);
				this.Morph.Val.pStr = null;
				this.Morph.Val.Symb = null;
				break;

			case 2: //variable/symbol
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

	/**
	 * write uppercase
	 */
	fgl: function () {
		if (this.debug.level > 4) {
			console.log('LEXER: fgl()');
		}
		this.X = this.X.toUpperCase();
		this.fs();
		this.fl();
	},

	/**
	 * write and read
	 */
	fsl: function () {
		if (this.debug.level > 4) {
			console.log('LEXER: fsl()');
		}
		this.fs();
		this.fl();
	},

	/**
	 * write, read and exit
	 */
	fslb: function () {
		if (this.debug.level > 4) {
			console.log('LEXER: fslb()', this.vBuf);
		}
		this.fs();
		this.fl();
		this.fb();
	},

	/**
	 * read and exit
	 */
	flb: function () {
		if (this.debug.level > 4) {
			console.log('LEXER: flb()');
		}
		this.fl();
		this.fb();
	},

	/**
	 * reset buffer
	 */
	fr: function () {
		if (this.debug.level > 4) {
			console.log('LEXER: fr()');
		}
		this.vBuf = '';
	},

	/**
	 * reset buffer and read
 	 */
	frl: function () {
		if (this.debug.level > 4) {
			console.log('LEXER: frl()');
		}
		this.fr();
		this.fl();
	}
};