/**
 * virtualMachine.js - Virtual stack machine for code generation
 *
 * @param input
 * @constructor
 */
VM = function (input) {
	this.init(input);
};

/**
 * @type {Object}
 */
VM.prototype = {
	init: function (input) {
		this.input = input;
		this.stack = [];
		this.pC = 0;
		this.pS = 0;
		this.pConst = 0;
		this.iCProc = 0;
		this.iPrCnt = 0;
		this.timer = undefined;
		this.line = null;
		this.pInfProc = [];
		this.constants = [];
		this.code = [];
		this.vars = [];
		this.entryPoint = 0;
		this.resume = false;
		this.emergencyExit = 0;
		this.externalInput = null;
		this.returnTo = [];
		this.debug = {
			level: 0,
			enabled: true
		};
		if (typeof(window.terminal) !== 'undefined') {
			this.terminal = window.terminal;
		} else {
			this.terminal = undefined;
		}

		this.main();
	},

	/**
	 * push value of local variable to stack
	 */
	PushValVarLocal: function () {
		this.pC += 1;
		if (this.debug.level > 3) {
			console.log('VM: Pushing value of local address with index', this.code[this.pC], this.code[this.pC + 1]);
		}
		var localVars = this.vars.pop(),
			value = localVars[parseInt(this.code[this.pC] + this.code[this.pC + 1], 16)];

		this.stack.push({type: 'value', val: value});
		this.vars.push(localVars);
		this.pC += 2;

		this.doStep();
	},

	/**
	 * push value of main variable to stack
	 */
	PushValVarMain: function () {
		this.pC += 1;
		if (this.debug.level > 3) {
			console.log('VM: Pushing value of main variable with index ', this.code[this.pC], this.code[this.pC +1 ], ' to stack');
		}
		var value = this.vars[0][parseInt(this.code[this.pC] + this.code[this.pC + 1], 16)];
		this.stack.push({type: 'value', val: value.toString(16)});
		this.pC += 2;

		this.doStep();
	},

	/**
	 * push global variable to stack
	 */
	PushValVarGlobal: function () {
		this.pC += 1;
		var value = parseInt(this.code[this.pC] + this.code[this.pC + 1], 16),
			procedureIndex = parseInt(this.code[this.pC + 2] + this.code[this.pC + 3]);
		if (this.debug.level > 3) {
			console.log('VM: Pushing global value ', value);
		}
		this.stack.push({type: 'value', val: this.vars[procedureIndex][value], procedureIndex : procedureIndex});
		this.pC += 4;

		this.doStep();
	},

	/**
	 * push local address to stack
	 */
	PushAdrVarLocal: function () {
		this.pC += 1;
		this.stack.push({type: 'address', val: this.code[this.pC] + this.code[this.pC + 1], procedureIndex : this.iCProc});
		this.pC += 2;
		if (this.debug.level > 3) {
			console.log('VM: Pushing local var index ', this.code[this.pC] + this.code[this.pC + 1], ' to stack.');
		}

		this.doStep();
	},

	/**
	 * push main address to stack
	 */
	PushAdrVarMain: function () {
		this.pC += 1;
		if (this.debug.level > 3) {
			console.log('VM: Pushing main address ', this.code[this.pC], this.code[this.pC +1]);
		}
		this.stack.push({type: 'address', val: this.code[this.pC] + this.code[this.pC +1], procedureIndex : 0});
		this.pC += 2;

		this.doStep();
	},

	/**
	 * push global address to stack
	 */
	PushAdrVarGlobal: function () {
		this.pC += 1;
		var value = this.code[this.pC] + this.code[this.pC + 1];
		if (this.debug.level > 3) {
			console.log('VM: Pushing global address ', value, ' to stack.');
		}
		var procedureIndex = this.code[this.pC + 2] + this.code[this.pC + 3];
		this.stack.push({type: 'address', val: value, procedureIndex : procedureIndex});
		this.pC += 4;

		this.doStep();
	},

	/**
	 * push constant to stack
	 */
	PushConst: function () {
		this.pC += 1;
		if (this.debug.level > 3) {
			console.log('VM: Pushing constant ', this.code[this.pC] + this.code[this.pC + 1], ' to stack.');
		}
		this.stack.push({type: 'value', val: this.constants[this.code[this.pC] + this.code[this.pC + 1]]});
		this.pC += 2;

		this.doStep();
	},
	/**
	 * store value as hex to var
	 */
	StoreVal: function () {
		var value = this.stack.pop(),
			address = this.stack.pop(),
			localVars;
		if (this.debug.level > 3) {
			console.log('VM: Storing value ', value, ' to address ', address);
		}
		if (address.procedureIndex > 0) {
			if (parseInt(address.procedureIndex, 16) != this.iCProc) {
				this.vars[parseInt(address.procedureIndex, 16)][parseInt(address.val, 16)] = value.val;
			}
			localVars = this.vars.pop();
			localVars[parseInt(address.val, 16)] = value.val;
			this.vars.push(localVars);
		} else {
			this.vars[address.procedureIndex][parseInt(address.val, 16)] = value.val;
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * put value to stdout
	 */
	PutVal: function () {
		if (typeof(this.stack[this.stack.length - 1]) == 'object') {
			if (this.stack[this.stack.length - 1].type == 'value') {
				if (this.debug.level > 3) {
					console.log('VM: echo int', parseInt(this.stack[this.stack.length - 1].val, 16), 'hex', this.stack[this.stack.length - 1].val);
				}
				var programOutput = $('#program-output'),
					oldOutPutVal = programOutput.val(),
					newOutPut,
					outPutVal;
				outPutVal = parseInt(this.stack[this.stack.length - 1].val, 16);
				if (oldOutPutVal != '') {
					newOutPut = oldOutPutVal + "\n" + '> ' + outPutVal;
				} else {
					newOutPut = '> ' + outPutVal;
				}
				programOutput.val(newOutPut);
				this.terminal.echo(outPutVal);
			}
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * read value from stdin
	 */
	GetVal: function () {
		this.pC += 1;
		var temp,
			self = this,
			value,
			localVars,
			address;
		//use this.terminal if available
		if (typeof (this.terminal) !== 'undefined') {
			this.terminal.enable();
			this.getExternalInput = function () {
				temp = parseInt(self.externalInput, 10);
				self.stack.push({type: 'value', val: temp.toString(16)});
				value = self.stack.pop();
				address = self.stack.pop();
				if (address.procedureIndex > 0) {
					localVars = self.vars.pop();
					localVars[parseInt(address.val, 16)] = value.val;
					self.vars.push(localVars);
				} else {
					self.vars[address.procedureIndex][parseInt(address.val, 16)] = value.val;
				}
				if (typeof (this.terminal) !== 'undefined') {
					this.terminal.disable();
				}
				self.doStep();
			};
		} else {
			//otherwise use plain ol' JS prompt
			temp = parseInt(prompt('Eingabe:', ''), 10);
			self.stack.push({type: 'value', val: temp.toString(16)});

			value = self.stack.pop();
			address = self.stack.pop();
			if (address.procedureIndex > 0) {
				localVars = self.vars.pop();
				localVars[parseInt(address.val, 16)] = value.val;
				self.vars.push(localVars);
			} else {
				self.vars[address.procedureIndex][parseInt(address.val, 16)] = value.val;
			}
			self.doStep();
		}
	},

	/**
	 * negate value on top of stack
	 */
	VzMinus: function () {
		if (this.debug.level > 3) {
			console.log('VzMinus()');
		}
		var value = this.stack.pop();
		if (typeof(value) === 'object') {
			if (value.type == 'value') {
				value = -parseInt(value.val, 16);
				value = value.toString(16);
				this.stack.push({type: 'value', val: value});
			}
		} else {
			console.log('VM ERROR: could not negate.');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * check if odd
	 */
	Odd: function () {
		var value = this.stack.pop(),
			res = '0x00';
		if (this.debug.level > 3) {
			console.log('VM: Odd()');
		}
		if (typeof(value) === 'object') {
			if (value.type == 'value') {
				value = parseInt(value, 16);
				if (value % 2 == 0) {
					res = '0x01';
				}
				this.stack.push(res);
			}
		} else {
			console.log('VM ERROR: Cannot check for Odd on a non-value.');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * addition
	 */
	Add: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('VM: Add()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) + parseInt(second.val, 16);
				this.stack.push({type: 'value', val: res.toString(16)});
			}
		} else {
			console.log('VM ERROR: Could not add values.');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * subtract
	 */
	Sub: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('VM: Sub()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) - parseInt(second.val, 16);
				this.stack.push({type: 'value', val: res.toString(16)});
			}
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * multiply
	 */
	Mul: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;

		if (this.debug.level > 3) {
			console.log('Mul()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) * parseInt(second.val, 16);
				this.stack.push({type: 'value', val: res.toString(16)});
			}
		} else {
			console.log('VM ERROR: Could not multiply values.');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * divide
	 */
	Div: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('VM: Div()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) / parseInt(second.val, 16);
				this.stack.push({type: 'value', val: res.toString(16)});
			}
		} else {
			console.log('VM ERROR: Could not divide values.');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * compare if equal
	 */
	CmpEqual: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('VM: CmpEqual()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) === parseInt(second.val, 16);
				this.stack.push({type: 'value', val: (res === true) ? 0x01 : 0x00});
			}
		} else {
			console.log('VM ERROR: Could not compare values.');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * compare if greater or equal
	 */
	CmpGreaterEqual: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('VM: CmpGreaterEqual()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) >= parseInt(second.val, 16);
				this.stack.push({type: 'value', val: (res === true) ? 0x01 : 0x00});
			}
		} else {
			console.log('VM ERROR: Could not compare values.');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * compare if greater then
	 */
	CmpGreaterThen: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('VM: CmpGreaterThen()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) > parseInt(second.val, 16);
				this.stack.push({type: 'value', val: (res === true) ? 0x01 : 0x00});
			}
		} else {
			console.log('VM ERROR: Could not compare values');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * compare if less or equal
	 */
	CmpLessEqual: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('VM: CmpLessEqual()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) <= parseInt(second.val, 16);
				this.stack.push({type: 'value', val: (res === true) ? 0x01 : 0x00});
			}
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * compare if less then
	 */
	CmpLessThen: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('VM: CmpLessThen()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) < parseInt(second.val, 16);
				this.stack.push({type: 'value', val: (res === true) ? 0x01 : 0x00});
			}
		} else {
			console.log('VM ERROR: Could not compare values.');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * compare if not equal
	 */
	CmpNotEqual: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('VM: CmpNotEqual()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = parseInt(first.val, 16) != parseInt(second.val, 16);
				this.stack.push({type: 'value', val: (res === true) ? 0x01 : 0x00});
			}
		} else {
			console.log('VM ERROR: Could not compare values.');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * logical and
	 */
	And: function () {
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (this.debug.level > 3) {
			console.log('And()', first, second);
		}
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = first.val === 0x01 && second.val === 0x01;
				this.stack.push({type: 'value', val: (res === true) ? 0x01 : 0x00});
			}
		} else {
			console.log('VM ERROR: Could not AND');
		}
		this.pC += 1;

		this.doStep();
	},

	/**
	 * logical or
	 */
	Or: function () {
		if (this.debug.level > 3) {
			console.log('VM: Or()');
		}
		var second = this.stack.pop(),
			first = this.stack.pop(),
			res;
		if (typeof(second) === 'object' && typeof(first) === 'object') {
			if (second.type === 'value' && first.type === 'value') {
				res = first.val === 0x01 || second.val === 0x01;
				this.stack.push({type: 'value', val: (res === true) ? 0x01 : 0x00});
			}
		} else {
			console.log('VM ERROR: Could not OR values.');
		}
		this.pC += 1;
		this.doStep();
	},

	/**
	 * Jump
	 */
	Jmp: function () {
		this.pC += 1;
		var jumpBy = parseInt(this.code[this.pC] + this.code[this.pC + 1], 16);
		this.pC += 1;
		if (jumpBy > 32767) {
			//negative jump (while)
			jumpBy = 65535 - jumpBy;
			this.pC -= jumpBy;
		} else {
			//positive jump (else)
			this.pC += jumpBy + 1;
		}
		if (this.debug.level > 3) {
			console.log('VM: Jmp() by ', jumpBy, 'addresses, code there: ', this.code[this.pC]);
		}

		this.doStep();
	},

	/**
	 * Jump Not
	 */
	JmpNot: function () {
		if (this.debug.level > 3) {
			console.log('VM: JmpNot()');
		}
		this.pC += 1;
		var stackContent = this.stack.pop();
		if (typeof stackContent === 'object' && stackContent.type === 'value') {
			if (stackContent.val === 0x00) {
				this.pC += parseInt(this.code[this.pC] + this.code[this.pC + 1], 16) + 2;
			} else {
				this.pC += 2;
			}
		} else {
			console.log('VM ERROR: expected bool value before jump, got', stackContent);
		}

		this.doStep();
	},

	/**
	 * ReturnProc
	 */
	ReturnProc: function () {
		if (this.debug.level > 3) {
			console.log('VM: ReturnProc() returning to', this.returnTo);
		}
		var returnTo = this.returnTo.pop();
		if (typeof returnTo !== 'undefined') {
			this.pC = returnTo;
		} else {
			this.pC += 1;
		}
		this.vars.pop();//destroy local vars

		this.doStep();
	},

	/**
	 * EntryProc
	 */
	EntryProc: function () {
		if (this.debug.level > 3) {
			console.log('VM: EntryProc()');
		}
		this.pC += 1;
		this.iCProc = parseInt(this.code[this.pC + 2] + this.code[this.pC + 3], 16);
		var lVar = parseInt(this.code[this.pC + 4] + this.code[this.pC + 5], 16),
			temp = [];

		for (var j = 0; j <= lVar; j+=4) {
			temp[j] = 0;
		}
		this.vars.push(temp);
		this.pC += 6;

		this.doStep();
	},

	/**
	 * call procedure
	 */
	Call: function () {
		this.pC += 1;
		var newIndex = this.pInfProc[parseInt(this.code[this.pC] + this.code[this.pC + 1], 16)].pCodeIndex;
		if (this.debug.level > 3) {
			console.log('VM: Call() procedure ', parseInt(this.code[this.pC] + this.code[this.pC + 1], 16), 'with code index ', newIndex);
		}
		this.returnTo.push(this.pC + 2);
		this.pC = newIndex;

		this.doStep();
	},

	/**
	 * pop last stack entry
	 */
	Pop: function () {
		if (this.debug.level > 3) {
			console.log('VM: Pop()');
		}
		this.pC += 1;
		this.stack.pop();

		this.doStep();
	},

	/**
	 * change order of top two elements on stack
	 */
	Rot: function () {
		var second = this.stack.pop(),
			first = this.stack.pop();
		if (this.debug.level > 3) {
			console.log('VM: Rotating ', first, second);
		}
		this.stack.push(second);
		this.stack.push(first);
		this.pC += 1;

		this.doStep();
	},
	/**
	 * swap address/value
	 */
	Swap: function () {
		var stackContent = this.stack.pop(),
			address,
			procedureIndex,
			localVars,
			value;
		this.pC += 1;
		if (this.debug.level > 3) {
			console.log('VM: Swapping ', stackContent);
		}
		if (typeof(stackContent) === 'object' && stackContent.type === 'address') {
			address = stackContent.val;
			procedureIndex = stackContent.procedureIndex;

			if (procedureIndex > 0) {
				localVars = this.vars.pop();
				value = localVars[parseInt(address, 16)];
				this.vars.push(localVars);
				this.stack.push({type: 'value', val: value});
			} else {
				this.stack.push({type: 'value', val: this.vars[0][parseInt(address, 16)]});
			}
		} else {
			console.log('VM ERROR: cannot swap adress to value');
		}

		this.doStep();
	},

	/**
	 * echo string
	 */
	PutString: function () {
		this.pC += 1;
		var string = '',
			programOutput = $('#program-output'),
			oldOutPutVal = programOutput.val(),
			newOutPut;
		while (typeof(this.code[this.pC]) === 'object' && this.code[this.pC].type === 'string') {
			string += this.code[this.pC].val;
			this.pC++;
		}
		if (oldOutPutVal != '') {
			newOutPut = oldOutPutVal + "\n" + '> ' + string;
		} else {
			newOutPut = '> ' + string;
		}
		if (this.debug.level > 3) {
			console.log('VM: PutString() ', string);
		}
		if (typeof(this.terminal) !== 'undefined') {
			this.terminal.echo(string);
		} else {
			programOutput.val(newOutPut);
		}

		this.doStep();
	},

	/**
	 * generate code array with addresses compatible to Prof. Beck's VM
	 *
	 * @param line
	 */
	makeCodeArray: function (line) {
		var keyword,
			i;
		for (i = 0; i < line.length; i++) {
			keyword = line[i].split(' ');

			switch (keyword[0]) {
				case 'Const' :
					var constant = keyword[1].split(':');
					this.constants[constant[0]] = constant[1];
					
					break;
				
				case 'EntryProc' :
					this.iPrCnt++;
					this.code.push(keyword[0]);

					var procedureIndex = parseInt(keyword[2][0] + keyword[2][1] + keyword[2][2] + keyword[2][3], 16),
						temp = [];
					if (procedureIndex === 0) {
						this.entryPoint = this.code.length - 1;
					}
					this.pInfProc[procedureIndex] = ({pCodeIndex: this.code.length - 1, procedureIndex: procedureIndex});
					//first argument
					this.code.push(keyword[1][0] + keyword[1][1]);
					this.code.push(keyword[1][2] + keyword[1][3]);
					//second argument
					this.code.push(keyword[2][0] + keyword[2][1]);
					this.code.push(keyword[2][2] + keyword[2][3]);
					//third argument
					this.code.push(keyword[3][0] + keyword[3][1]);
					this.code.push(keyword[3][2] + keyword[3][3]);
					for (var j = 0; j <= 12; j+=4) {
						temp[j] = 0;
					}
					this.vars[parseInt(keyword[2].replace(',', ''), 16)] = temp;

					break;

				case 'PushAdrVarMain' :
				case 'PushAdrVarLocal' :
				case 'PushValVarMain' :
				case 'PushValVarLocal' :
				case 'PushConst' :
				case 'Jmp' :
				case 'JmpNot' :
				case 'Call' :
					this.code.push(keyword[0]);
					//argument
					this.code.push(keyword[1][0] + keyword[1][1]);
					this.code.push(keyword[1][2] + keyword[1][3]);
					
					break;

				case 'PushAdrVarGlobal' :
				case 'PushValVarGlobal' :
					this.code.push(keyword[0]);
					//first argument
					this.code.push(keyword[1][0] + keyword[1][1]);
					this.code.push(keyword[1][2] + keyword[1][3]);
					//second argument
					this.code.push(keyword[2][0] + keyword[2][1]);
					this.code.push(keyword[2][2] + keyword[2][3]);

					break;

				case 'ReturnProc' :
				case 'StoreVal' :
				case 'PutVal' :
				case 'Odd' :
				case 'Add' :
				case 'And' :
				case 'Or' :
				case 'Rot' :
				case 'Swap' :
				case 'Pop' :
				case 'Sub' :
				case 'Mul' :
				case 'Div' :
				case 'GetVal' :
				case 'VzMinus' :
				case 'CmpNotEqual' :
				case 'CmpEqual' :
				case 'CmpGreaterEqual' :
				case 'CmpLessThen' :
				case 'CmpGreaterThen' :
				case 'CmpLessEqual' :
					this.code.push(keyword[0]);

					break;
				
				case 'PutString' :
					this.code.push(keyword[0]);
					var x, y, stringPart;
					for (x = 1; x < keyword.length; x++) {
						stringPart = keyword[x];
						for (y = 0; y < stringPart.length; y++) {
							this.code.push({type: 'string', val: stringPart[y]});
						}
						if (x < keyword.length - 1) {
							this.code.push({type: 'string', val: ' '});
						}
					}

					break;
				
				default :
					console.log('VM: Unexpected code segment ', keyword[0]);

					break;
			}
		}
	},

	/**
	 * go to next code segment depending on code pointer
	 *
	 * @return {Boolean}
	 */
	doStep: function () {
		this.getExternalInput = function () { };
		if (this.debug.level > 3) {
			console.log('VM: Stepping to code address', this.pC);
		}
		this.emergencyExit += 1;
		if (this.emergencyExit >= 35000) {
			return false;
		}
		var code = this.code[this.pC];
		if (typeof this[code] === 'function') {
			this[code]();
		}

		return true;
	},

	/**
	 * main loop
	 */
	main: function () {
		if (typeof (this.terminal) !== 'undefined') {
			this.terminal.disable();
		}
		var input,
			line;

		input = this.input;
		line = input.split("\n");
		this.makeCodeArray(line);
		this.pC = this.entryPoint;
		if (this.code[this.entryPoint] !== 'EntryProc') {
			console.log('VM ERROR: Did not get a correct entry point.');
		}
		/*
			for debugging in your browser, use
			for(var i = 0;i<code.length;i++){console.log(i,code[i]);}
			to display code and addresses
		 */
		window.code = this.code;

		var res = this.doStep();
		return res !== false;
	}
};