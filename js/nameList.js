/**
 * nameList.js - Name list
 *
 * @constructor
 */
NameList = function () {
	this.init();
};

/**
 * @type {Object}
 */
NameList.prototype = {
	init: function () {
		this.debug = {
			enabled: true,
			level: -1
		};
		this.tVar = function (dspl) {
			this.tKz = 'KzVar';
			this.Dspl = dspl;
		};
		this.tConst = function (val, idx) {
			return {
				tKz: 'KzConst',
				Val: val,
				Idx: idx
			}
		};
		this.tProc = function (idx, parent, localList, spzzvar) {
			return {
				tKz: 'KzPrc',
				IdxProc: idx,
				pParent: parent,
				pLBez: localList,
				SpzzVar: spzzvar
			}
		};
		this.tBez = function (idx, pObj, pName, len) {
			return {
				tKz: 'KzBez',
				IdxProc: idx,
				pObj: pObj,
				pName: pName,
				Len: len,
				pLBez: []
			}
		};
		this.list = {
			list: null,
			pLConst: [],
			IdxCnst: 0,
			IdxProc: 0,
			pCurrPr: null,
			pLBez: []
		};
		this.IdxCnst = 0;    //number of constants in constants list
		this.IdxProc = 0;    //number or procedures
		this.pCurrPr = null; //current procedure id
		this.pLConst = [];   //constants list
		this.pMainPr = this.createProc(null);
		this.pCurrPr = this.pMainPr;
		this.list = undefined;//this.createBez('main', this.pMainPr);
	},

	/**
	 * create identifier
	 *
	 * @param pBez
	 * @param pObj
	 * @return {*}
	 */
	createBez: function (pBez, pObj) {
		if (typeof(pObj) === 'undefined') {
			pObj = null;
		}
		if (this.debug.level > 1) {
			console.log('NAMELIST: createBez() ', pBez, pObj);
		}
		if (pBez === null || pBez.length < 1 || this.pCurrPr === null) {
			return null;
		}
		if (pObj.tKz === 'KzPrc') {
			if (this.list == undefined) {
				this.list = this.pCurrPr;
			}
			else {
				this.list.pLBez.push(this.pCurrPr);
			}
			this.pCurrPr = pObj;
		}

		var bez = this.tBez(this.pCurrPr.IdxProc, pObj, pBez, 0);
		this.pCurrPr.pLBez.push(bez);
		return bez;
	},

	/**
	 * create constant
	 *
	 * @param val
	 * @return {*}
	 */
	createConst: function (val) {
		if (this.debug.level > 1) {
			console.log('NAMELIST: createConst() ', val);
		}
		if (val.length < 1 || this.pCurrPr === null || this.pLConst === null) {
			return null;
		}
		var cons = new this.tConst(val, this.IdxCnst++);
		this.pLConst.push(cons);
		return cons;
	},

	/**
	 * search for constant
	 *
	 * @param val
	 * @return {*}
	 */
	searchConst: function (val) {
		if (this.debug.level > 1) {
			console.log('NAMELIST: searchConst ', val);
		}
		if (this.debug.level > 3) {
			console.log('NAMELIST: searching for const with value ', val, ' in ', this.pLConst);
		}
		for (var i = 0; i< this.pLConst.length; i++) {
		//for (var i in this.pLConst) {
			if (this.pLConst[i].Val == val) {
				return this.pLConst[i];
			}
		}
		return null;
	},

	/**
	 * create variable
	 *
	 * @return {*}
	 */
	createVar: function () {
		if (this.debug.level > 1) {
			console.log('NAMELIST: createVar()');
		}
		if (this.pCurrPr === null) {
			return 0;
		}

		var variable = new this.tVar(this.pCurrPr.SpzzVar);
		this.pCurrPr.SpzzVar += 4;

		return variable;
	},

	/**
	 * create procedure
	 *
	 * @param pParent
	 * @return {this.tProc}
	 */
	createProc: function (pParent) {
		if (this.debug.level > 1) {
			console.log('NAMELIST: createProc() ', pParent);
		}
		return new this.tProc(this.IdxProc++, pParent, [], 0);
	},

	/**
	 * local search for identifier
	 *
	 * @param pProc
	 * @param pBez
	 * @return pBez|null
	 */
	searchBez: function (pProc, pBez) {
		if (this.debug.level > 1) {
			console.log('NAMELIST: searchBez ', pBez, ' in ', pProc);
		}
		if (pBez === null || typeof(pBez) === 'undefined' || pBez.length < 1) {
			return null;
		}
		for (var i = 0; i < pProc.pLBez.length; i++) {
			if (pProc.pLBez[i].pName !== undefined) {
				if (pProc.pLBez[i].pName == pBez) {
					return pProc.pLBez[i];
				}
			} else {
				//procedure name are in a proc object, not in a bez object
				if (pProc.pLBez[i].pLBez.length > 0) {
					if (pProc.pLBez[i].pLBez[0].pName == pBez) {
						return pProc.pLBez[i].pLBez[0];
					}
				}
			}
		}

		return null;
	},

	/**
	 * global search for identifier
	 *
 	 * @param pBez
	 * @return pBez|null
	 */
	searchBezGlobal: function (pBez) {
		if (this.debug.level > 1) {
			console.log('NAMELIST: searchBezGlobal ', pBez, ' in ', this.pCurrPr.pLBez);
		}
		if (pBez === null || typeof(pBez) === 'undefined' || pBez.length < 1) {
			return null;
		}
		var pPrc = this.pCurrPr,
			pTmp = null;
		while (pPrc !== null) {
			pTmp = this.searchBez(pPrc, pBez);
			if (pTmp === null) {
				pPrc = pPrc.pParent;
			} else {
				return pTmp;
			}
		}

		return pTmp;
	}
};