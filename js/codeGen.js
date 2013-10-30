/**
 * codeGen.js - generates executable JavaScript from virtual machine code
 *
 * @param input
 * @constructor
 */
CodeGen = function (input){
	this.init(input);
};

/**
 * @return string
 * @type {Object}
 */
CodeGen.prototype = {
	init: function (input) {
		this.input = input;
		this.debug = {
			enabled: true,
			level: 1
		};
	},

	/**
	 * main function
	 *
	 * @return {String}
	 */
	generate: function () {
		var input = this.input,
			line = input.split("\n"),
			i,
			idx,
			j,
			inner,
			vars = [],
			constants = [],
			code = [],
			currentProc = -1,
			index = 0,
			closeBracket = [],
			openBrackets = 0,
			ifWhileIndex = [],
			procedures = [],
			keyword,
			first,
			k = 0,
			second;
		code[0] = [];

		for (i = 0; i < line.length; i++) {
			keyword = line[i].split(' ');
			switch (keyword[0]) {
				case 'EntryProc' :
					inner = line[i].split(' ');
					var oldProcId = currentProc,
						procId = parseInt(inner[2].replace(',', ''), 16),
						numVars = parseInt(inner[3].replace(',', ''), 16) / 4;
					vars[procId] = [];
					currentProc = procId;
					code[currentProc] = [];
					for (j = 0; j < numVars; j++) {
						vars[procId].push(0);
					}
					if (procId > 0) {
						code[currentProc].push('function p' + procId + '(){');
						openBrackets++;
						code[currentProc].push('var vars_p' + procId + ' = [' + vars[procId] + '];');

						//check if procedures are nested
						if (oldProcId > procId && procId !== 0 && oldProcId !== 0) {
							//add placeholder for next procedure
							code[currentProc].push({procedure: procId, expected: oldProcId});
						}
					} else {
						code[currentProc].push('var vars = [' + vars[procId] + '];');
						code[currentProc].push({procedure: procId, expected: procId + 1});
					}

					procedures[procId] = {
						startIndex: code.length - 1,
						endIndex: null
					};

					index += 7;
					break;

				case 'ReturnProc' :
					if (currentProc > 0) {
						if (openBrackets > 0) {
							code[currentProc].push('}');
							openBrackets--;
						}
					}

					procedures[procId].endIndex = code.length;
					index += 1;
					break;

				case 'JmpNot' :
					index += 3;
					inner = line[i].split(' ');
					closeBracket.push(index + parseInt(inner[1], 16));
					break;

				case 'Call' :
					inner = line[i].split(' ');
					code[currentProc].push('p' + parseInt(inner[1], 16) + '();');
					index += 3;
					break;

				case 'Const' :
					inner = line[i].split(' ');
					inner = inner[1].split(':');
					constants[parseInt(inner[0], 16)] = parseInt(inner[1], 16);
					break;

				case 'PushAdrVarMain' :
					inner = line[i].split(' ');
					code[currentProc].push('vars[' + parseInt(inner[1], 16) / 4 + "]");
					index += 3;
					break;

				case 'PushAdrVarLocal' :
					inner = line[i].split(' ');
					code[currentProc].push('vars_p' + currentProc + '[' + parseInt(inner[1],16 ) / 4 + "]");
					index += 3;
					break;

				case 'PushAdrVarGlobal' :
					inner = line[i].split(' ');
					code[currentProc].push('vars_p' + parseInt(inner[2], 16) + '[' + parseInt(inner[1].replace(', ', ''), 16 ) / 4 + "]");
					index += 5;
					break;

				case 'GetVal' :
					first = code[currentProc].pop();
					code[currentProc].push(first + ' = parseInt(prompt("Eingabe:", ""));');
					index += 1;
					break;

				case 'PutVal' :
					first = code[currentProc].pop();
					code[currentProc].push('alert(' + '"Ausgabe: " + (' + first + '));');
					index += 1;
					break;

				case 'PutString' :
					inner = line[i].split(' ');
					var codeString = '';
					for (j = 1; j < inner.length; j++) {
						codeString += inner[j];
						if (j !== inner.length - 1) {
							codeString += ' ';
						}
					}
					code[currentProc].push('alert("' + codeString + '");');
					index += 2 + codeString.length;
					break;

				case 'PushValVarMain' :
					inner = line[i].split(' ');
					code[currentProc].push('vars[' + parseInt(inner[1], 16) / 4 + "]");
					index += 3;
					break;

				case 'PushValVarLocal' :
					inner = line[i].split(' ');
					code[currentProc].push('vars_p' + currentProc +'[' + parseInt(inner[1], 16) / 4 + "]");
					index += 3;
					break;

				case 'PushValVarGlobal' :
					inner = line[i].split(' ');
					code[currentProc].push('vars_p' + parseInt(inner[2], 16) +'[' + parseInt(inner[1].replace(',', ''), 16) / 4 + "]");
					index += 3;
					break;

				case 'PushConst' :
					inner = line[i].split(' ');
					code[currentProc].push('constants[' + parseFloat(inner[1]) + "]");
					index += 3;
					break;

				case 'StoreVal' :
					first = code[currentProc].pop();
					second = code[currentProc].pop();
					if (second == 'xxx') {
						second = code[currentProc].pop();
						code[currentProc].push('xxx');
					}
					code[currentProc].push('xxx');
					code[currentProc].push(second + ' = ' + first + ';');
					index += 1;
					break;

				case 'VzMinus' :
					first = code[currentProc].pop();
					code[currentProc].push('-' + first);
					index += 1;
					break;

				case 'Mul' :
					second = code[currentProc].pop();
					first = code[currentProc].pop();
					if (first == 'xxx') {
						first = code[currentProc].pop();
						code[currentProc].push('xxx');
					}
					code[currentProc].push('xxx');
					code[currentProc].push('parseInt(' + first + ') * parseInt(' + second + ')');
					index += 1;
					break;

				case 'Add' :
					second  = code[currentProc].pop();
					first = code[currentProc].pop();
					if (first == 'xxx') {
						first = code[currentProc].pop();
						code[currentProc].push('xxx');
					}
					code[currentProc].push('xxx');
					code[currentProc].push('parseInt(' + first + ') + ' + 'parseInt(' + second + ')');
					index += 1;
					break;

				case 'Div' :
					second = code[currentProc].pop();
					first = code[currentProc].pop();
					if (first == 'xxx') {
						first = code[currentProc].pop();
						code[currentProc].push('xxx');
					}
					code[currentProc].push('xxx');
					code[currentProc].push('parseInt(' + first + ') / parseInt(' + second + ')');
					index += 1;
					break;

				case 'Sub' :
					second = code[currentProc].pop();
					first = code[currentProc].pop();
					if (first == 'xxx') {
						first = code[currentProc].pop();
						code[currentProc].push('xxx');
					}
					code[currentProc].push('xxx');
					code[currentProc].push('parseInt(' + first + ') - parseInt(' + second + ')');
					index += 1;
					break;

				case 'Odd' :
					first = code[currentProc].pop();
					if (first == 'xxx') {
						first = code[currentProc].pop();
						code[currentProc].push('xxx');
					}
					code[currentProc].push('if (' + first + '%2 == 0){');
					ifWhileIndex.push(code[currentProc].length - 1);
					index += 1;
					openBrackets++;
					break;

				case 'CmpEqual' :
					second = code[currentProc].pop();
					first = code[currentProc].pop();
					if (first == 'xxx') {
						first = code[currentProc].pop();
						code[currentProc].push('xxx');
					}
					code[currentProc].push('xxx');
					code[currentProc].push('if (' + first + '==' + second + '){');
					ifWhileIndex.push(code[currentProc].length - 1);
					index += 1;
					openBrackets++;
					break;

				case 'CmpNotEqual' :
					second = code[currentProc].pop();
					first = code[currentProc].pop();
					if (first == 'xxx') {
						first = code[currentProc].pop();
						code[currentProc].push('xxx');
					}
					code[currentProc].push('xxx');
					code[currentProc].push('if (' + first + '!=' + second + '){');
					ifWhileIndex.push(code[currentProc].length - 1);
					index += 1;
					openBrackets++;
					break;

				case 'CmpGreaterEqual' :
					second = code[currentProc].pop();
					first = code[currentProc].pop();
					if (first == 'xxx') {
						first = code[currentProc].pop();
						code[currentProc].push('xxx');
					}
					code[currentProc].push('xxx');
					code[currentProc].push('if (' + first + '>=' + second + '){');
					ifWhileIndex.push(code[currentProc].length - 1);
					index += 1;
					openBrackets++;
					break;

				case 'CmpLessThen' :
					second = code[currentProc].pop();
					first = code[currentProc].pop();
					code[currentProc].push('xxx');
					code[currentProc].push('if (' + first + '<' + second + '){');
					ifWhileIndex.push(code[currentProc].length - 1);
					index += 1;
					openBrackets++;
					break;

				case 'CmpGreaterThen' :
					second = code[currentProc].pop();
					first = code[currentProc].pop();
					code[currentProc].push('xxx');
					code[currentProc].push('if (' + first + '>' + second + '){');
					ifWhileIndex.push(code[currentProc].length - 1);
					index += 1;
					openBrackets++;
					break;

				case 'CmpLessEqual' :
					second = code[currentProc].pop();
					first = code[currentProc].pop();
					code[currentProc].push('xxx');
					code[currentProc].push('if (' + first + '<=' + second + '){');
					ifWhileIndex.push(code[currentProc].length - 1);
					index += 1;
					openBrackets++;
					break;

				case 'Jmp' :
					index += 3;
					inner = line[i].split(' ');
					var jumpBy = parseInt(inner[1], 16);
					if (jumpBy > 32767) {
						//negative jump -> we have a while loop
						var iwi = ifWhileIndex.pop();
						code[currentProc][iwi] = code[currentProc][iwi].replace('if', 'while');
						if (openBrackets > 0) {
							code[currentProc].push('}');
							openBrackets--;
						}
					} else {
						//positive jump -> we have an else directive
						ifWhileIndex.pop();
						code[currentProc].push('}else{');
						closeBracket.push(index + jumpBy);
						openBrackets++;
					}
					break;

				case 'Or' :
					//get the last two if conditions (there is always one placeholder between)
					var if2 = code[currentProc].pop(),
						placeHolder = code[currentProc].pop(),
						if1 = code[currentProc].pop();
					if2 = if2.replace('if (', '').replace('){', '');
					if1 = if1.replace('if (', '').replace('){', '');
					//add placeholders again for correct indices
					code[currentProc].push('xxx');
					code[currentProc].push('xxx');
					//rebuild the if directive
					code[currentProc].push('if(' + if1 + '||' + if2 + '){');
					break;

				case 'And' :
					//get the last two if conditions (there is always one placeholder between)
					var if2 = code[currentProc].pop(),
						placeHolder = code[currentProc].pop(),
						if1 = code[currentProc].pop();
					if2 = if2.replace('if (', '').replace('){', '');
					if1 = if1.replace('if (', '').replace('){', '');
					//add placeholders again for correct indices
					code[currentProc].push('xxx');
					code[currentProc].push('xxx');
					//rebuild the if directive
					code[currentProc].push('if(' + if1 + '&&' + if2 + '){');
					break;

				default :
					console.log('Unrecognized keyword: ', keyword[0]);
					break;
			}
			if (this.debug.level > 1) {
				console.log(keyword);
				console.log('Current Index: ', index);
			}
			if (openBrackets > 0 && index === closeBracket[closeBracket.length - 1]) {
				code[currentProc].push('}');
				openBrackets--;
				closeBracket.pop();
			}
		}
		//write constants block to beginning of code buffer
		code[0].unshift('var constants = [' + constants + '];');
		if (this.debug.level > 3) {
			for (i = code.length-1; i >= 0; i--) {
				console.log('code entry: ',i, code[i]);
			}
		}
		//clean up placeholders
		idx = code.indexOf('xxx');
		while (idx !== -1) {
			code.splice(idx, 1);
			idx = code.indexOf('xxx');
		}
		for (i = code.length-1; i >= 0; i--) {
			for (j = 0; j < code[i].length; j++) {
				//clean up placeholders inside
				idx = code[i].indexOf('xxx');
				while (idx !== -1) {
					code[i].splice(idx, 1);
					idx = code[i].indexOf('xxx');
				}
				//check for nested functions and resort
				if (typeof(code[i][j]) === 'object') {
					var expected = code[i][j].expected,
						expectedCode = code[expected];
					if (typeof(code[expected]) !== 'undefined') {
						idx = expectedCode.indexOf('xxx');
						while (idx !== -1) {
							expectedCode.splice(idx, 1);
							idx = code.indexOf('xxx');
						}
						code[i][j] = expectedCode.join("\n");
						//add placeholder
						code[expected] = 'xxx';
					} else {
						code[i][j] = 'xxx';
					}
				}
			}
		}
		//cleanup placeholders again
		idx = code.indexOf('xxx');
		while (idx !== -1) {
			code.splice(idx, 1);
			idx = code.indexOf('xxx');
		}
		if (this.debug.level > 4) {
			console.log('after combining: ', code.length);
			for (i = code.length-1; i >= 0; i--) {
				console.log('code entry: ',i, code[i]);
			}
		}
		while (code.length > 1) {
			//add non-nested procedures after constants and variables in main
			if (this.debug.level > 4) {
				console.log('we have some non-nested procedures.');
			}
			code[0].splice(2, 0, code[1].join("\n"));
			code.splice(1, 1);
		}

		for (var i = 0; i < code.length; i++) {
			if (typeof code[i] === 'object') {
				for (var j = 0; j < code[i].length; j++) {
					if (code[i][j] === 'xxx') {
						code[i].splice(j, 1);
					}
				}
			}
		}

		return code[0].join("\n");
	}
};