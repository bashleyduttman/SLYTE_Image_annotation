(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["@zoho/lyte-dom"], factory);
	}
	else {
		factory($L);
	}
})(
	function ($L) {
		$L.snippets = {
			getBuilder: function (language, str) {
				return new builder(language, str);
			}
		};

		var builder = function (language, str) {
			this.tokenizer = $L.snippets.getTokenizer(language, str);
		}

		var space = {
			"value": " ",
			"tokenInfo": {
				"token": "whitespace"
			}
		};

		/**
		 * The tab spaces are added based on the number of nested blocks
		 * Used for CSS, HTML, JSON, XML, JS
		 * @param {int} nestedLoop the number of loops
		 * @returns the whitespace string after adding required number of tab spaces
		*/
		function addTabSpaces(nestedLoop) {
			var tabSpaces = "";
			for (let i = 0; i < nestedLoop; i++) {
				tabSpaces = tabSpaces + '\t';
			}
			tabSpaces = "\n" + tabSpaces
			return tabSpaces
		}

		/**
		 * Used to find the end of the corresponding Switch block of java and javascript
		 * @param {object} tokens The tokens array
		 * @param {int} startIndex The index where the corresponding block starts
		 * @returns the end index of switch block
		 */
		function identifySwitchEnd(tokens, startIndex) {
			var nestedBlocks = 0;
			for (var i = startIndex; i < tokens.length; i++) {
				var token = tokens[i];
				var value = token.value;

				if (value === '{') {
					nestedBlocks++;
				}
				else if (value === '}') {
					if (nestedBlocks === 1) {
						return i;
					}
					nestedBlocks--;
				}
			}
			return 0
		}

		/**
		 * used to identify each case blocks of a switch statements of Java and Javascript
		 * @param {object} tokens
		 * @param {int} index
		 * @returns the end index of the corresponding case block
		 */
		function identifyCaseBlocks(tokens, index) {
			for (let i = index; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenValue = token.value;

				if (tokenValue === 'case' || tokenValue === 'default') {
					var endIndex = i - 1;
					return endIndex;
				}
			}
			return tokens.length - 1;
		}

		// CSS
		/**
		 * Add spaces, tab spaces and new line to indent the code
		 * @param {object} tokens
		 * @returns the indented tokens array
		 */
		function indentCss(tokens) {
			var nestedLoop = 0;
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;
				var tokenValue = token.value;
				let nextTokenType, nextTokenValue

				if (i + 1 < tokens.length) {
					nextTokenValue = tokens[i + 1].value;
					nextTokenType = tokens[i + 1].tokenInfo.token;
				}

				if (tokenType === 'punctuation') {
					// To add tab spaces rightly
					if (tokenValue === '{') {
						nestedLoop++;
					}
					else if (tokenValue === '}') {
						nestedLoop--;
					}
					if (tokenValue === '}') {
						if (nextTokenType && nextTokenType === "selector") {
							var indentedValue = addTabSpaces(nestedLoop);
							var temp = {
								"value": indentedValue,
								"tokenInfo": {
									"token": "whitespace"
								}
							}
							tokens.splice(i + 1, 0, temp);
							i++;
						}
						else if (i !== tokens.length - 1) {
							var indentedValue = addTabSpaces(nestedLoop - 1);
							var temp = {
								"value": indentedValue,
								"tokenInfo": {
									"token": "whitespace"
								}
							}
							tokens.splice(i + 1, 0, temp);
							i++;
						}
					}
					else if (tokenValue === '{') {
						var indentedValue = addTabSpaces(nestedLoop);
						var temp = {
							"value": indentedValue,
							"tokenInfo": {
								"token": "whitespace"
							}
						}
						tokens.splice(i + 1, 0, temp);
						i++;
					}

					else if (tokenValue === ';') {
						if (nextTokenValue === '}') {
							var indentedValue = addTabSpaces(nestedLoop - 1);
							var temp = {
								"value": indentedValue,
								"tokenInfo": {
									"token": "whitespace"
								}
							}
							tokens.splice(i + 1, 0, temp);
							i++;
						}
						else {
							var indentedValue = addTabSpaces(nestedLoop);
							var temp = {
								"value": indentedValue,
								"tokenInfo": {
									"token": "whitespace"
								}
							}
							tokens.splice(i + 1, 0, temp);
							i++;
						}
					}

					else if (tokenValue === ':') {
						tokens.splice(i + 1, 0, space);
						i++;
					}
					else if (tokenValue === '=') {
						tokens.splice(i, 0, space);
						tokens.splice(i + 2, 0, space);
						i = i + 2;
					}
				}

				else if (tokenType === 'whitespace') {
					if (!(/^[\s\t\n]*$/.test(tokenValue))) {
						tokens.splice(i + 1, 0, space);
					}
				}

				else if (tokenType === 'selector') {
					tokens.splice(i + 1, 0, space);
					tokenValue = tokenValue.replace(/,/g, ", ");
					token.value = tokenValue;
					tokens[i] = token;
				}

				else if (tokenType === 'rule-value') {
					if (!(tokens[i + 1].value.startsWith(';'))) {
						tokens.splice(i + 1, 0, space);
					}
				}

				else if (tokenType === 'rule-name') {
					if (!(tokens[i - 1].value.includes('\n')) && (tokens[i - 1].tokenInfo.token !== 'whitespace')) {
						var indentedValue = addTabSpaces(tokenValue, nestedLoop);
						var temp = {
							"value": indentedValue,
							"tokenInfo": {
								"token": "whitespace"
							}
						}
						tokens.splice(i, 0, temp);
						i++;
					}
				}
				else if (tokenType === 'comment') {
					if (nextTokenType && nextTokenType !== 'whitespace' && !nextTokenValue.includes('\n')) {
						tokens.splice(i + 1, 0, {
							"value": "\n",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
					}
				}
				else if (tokenType === "media-words") {
					if (nextTokenType && nextTokenType !== 'whitespace' && !nextTokenValue.includes('\n')) {
						tokens.splice(i + 1, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
					}
				}
			}
			return tokens;
		}

		/**
		 * Manages the indentation of CSS code
		 * remove the whitespaces and clean the code
		 * @param {object} tokens
		 * @returns the indented array
		 */
		function handleCSS(tokens) {
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;
				var tokenValue = token.value;

				if (tokenType === 'whitespace') {
					if (/^[\s\t\n]*$/.test(tokenValue)) {
						tokens.splice(i, 1);
						i--;  // Decrement the index to account for the removed token
					}
					else {
						var replacedStr = tokenValue.replace(/[^\S\n\t]+/g, '').trim();
						var whitespace = { value: replacedStr, tokenInfo: { token: 'whitespace' } };
						tokens[i] = whitespace;
					}
				}

				else if (tokenType === 'selector' || tokenType === 'rule-name' || tokenType === 'rule-value') {
					tokenValue = tokenValue.trim();
					token.value = tokenValue;
					tokens[i] = token;
				}
			}
			tokens = indentCss(tokens);
			return tokens;
		}

		// JSON
		/**
		 * Find the json object blocks and indent them rightly
		 * @param {object} tokens
		 * @returns the tokens array
		*/
		function handleObject(tokens) {
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;

				if (tokenType === 'whitespace') {
					tokens.splice(i, 1);
					i--;  // Decrement the index to account for the removed token
				}
			}

			var nestedLoops = 0;
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;
				var tokenValue = token.value;

				//JSON
				if (tokenType === 'punctuation' || tokenType === 'punctuator') {
					if (tokenValue === '{') {
						nestedLoops++;
						if (tokens[i + 1].value !== "}") {
							var spaces = addTabSpaces(nestedLoops)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i + 1, 0, spaceToken);
						}
					}

					else if (tokenValue === '}') {
						nestedLoops--;
						let prevToken = tokens[i - 1];
						let prevTokenValue = prevToken.value;
						let prevTokenType = prevToken.tokenInfo.token;
						if (prevTokenType !== 'whitespace' && prevTokenValue !== "{") {
							var spaces = addTabSpaces(nestedLoops)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i, 0, spaceToken);
							i++;
						}
					}

					else if (tokenValue === ',') {
						var spaces = addTabSpaces(nestedLoops)
						var spaceToken = {
							"value": spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						};
						tokens.splice(i + 1, 0, spaceToken);
						i++;
					}

					else if (tokenValue === ':') {
						if (tokens[i + 1].tokenInfo.token !== 'whitespace') {
							tokens.splice(i + 1, 0, space);
							i++;
						}
					}
				}
			};
			return tokens;
		}

		// JS
		/**
		 * Manages the spacing of parenthesis, ie, the conditions of if, else if and while blocks
		 * @param {integer} startIndex
		 * @param {object(Array)} tokens
		 * @returns the updated tokens
		 */
		function handleCondBlock(startIndex, tokens) {
			var loop = 0;
			for (let i = startIndex; i < tokens.length; i++) {
				const token = tokens[i];
				var tokenValue = token.value;
				var tokenType = token.tokenInfo.token;
				let nextToken, nextTokenType;
				let prevToken, prevTokenType, prevTokenValue;

				if (i + 1 < tokens.length) {
					nextToken = tokens[i + 1];
					nextTokenType = nextToken.tokenInfo.token;
				}
				if (i > 0) {
					prevToken = tokens[i - 1];
					prevTokenType = prevToken.tokenInfo.token;
					prevTokenValue = prevToken.value;
				}

				if (tokenType === "punctuator") {
					if (tokenValue === "(") {
						if (nextTokenType !== "punctuator" && nextTokenType !== "whitespace") {
							tokens.splice(i + 1, 0, {
								"value": " ",
								"tokenInfo": {
									"token": "whitespace"
								}
							});
							i++;
						}
						loop++;
					}
					else if (tokenValue === ")") {
						loop--;
						if (prevTokenType !== "punctuator" && prevTokenType !== "whitespace") {
							tokens.splice(i, 0, {
								"value": " ",
								"tokenInfo": {
									"token": "whitespace"
								}
							});
							i++;
						}
						if (loop === 0) {
							return ({ endIndex: i, tokens });
						}
					}
					else if (tokenValue === ";") {
						if (nextToken) {
							if (nextTokenType !== "whitespace") {
								tokens.splice(i + 1, 0, {
									"value": " ",
									"tokenInfo": {
										"token": "whitespace"
									}
								});
							}
						}
						else {
							tokens.splice(i + 1, 0, {
								"value": " ",
								"tokenInfo": {
									"token": "whitespace"
								}
							});
						}

						if (prevTokenValue === "(") {
							tokens.splice(i, 0, {
								"value": " ",
								"tokenInfo": {
									"token": "whitespace"
								}
							});
						}
					}
				}
				else if (tokenType === "keyword" && nextTokenType !== "operator" && nextTokenType !== "punctuator") {
					tokens.splice(i + 1, 0, {
						"value": " ",
						"tokenInfo": {
							"token": "whitespace"
						}
					});
					i++;
				}

				else if (tokenType === "operator" && tokenValue !== ".") {
					if (prevTokenType !== "whitespace") {
						if (!(tokenValue === "++" || tokenValue === "--" || tokenValue === "**")) {

							tokens.splice(i, 0, {
								"value": " ",
								"tokenInfo": {
									"token": "whitespace"
								}
							});
							i++;
						}
					}
					if (tokenValue !== "!" && nextTokenType !== "whitespace") {
						tokens.splice(i + 1, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
				}

			}
			return ({ endIndex: 0, tokens });
		}

		/**
		 * New line characters and tab spaces are added based on the number of blocks
		 * @param {object} tokens
		 * @returns the tokens with added new line, tab spaces and spaces as whitespace token
		 */
		function indentJs(tokens) {
			var nestedLoops = 0;
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;
				var tokenValue = token.value;
				let nextToken, nextTokenValue, nextTokenType, prevToken, prevTokenValue, prevTokenType;

				if (i + 1 < tokens.length) {
					nextToken = tokens[i + 1];
					nextTokenValue = nextToken.value;
					nextTokenType = nextToken.tokenInfo.token;
				}
				if (i - 1 >= 0) {
					prevToken = tokens[i - 1];
					prevTokenValue = prevToken.value;
					prevTokenType = prevToken.tokenInfo.token;
				}

				if (tokenType === "punctuator") {
					if (tokenValue === "{") {
						nestedLoops++;
					}
					else if (tokenValue === "}") {
						nestedLoops--;

					}
					if (tokenValue === ';') {
						if (i !== tokens.length - 1) {
							if (nextToken && nextTokenValue === "}" && nextTokenType !== "whitespace") {
								var tab_spaces = addTabSpaces(nestedLoops - 1)
								tokens.splice(i + 1, 0, {
									"value": tab_spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								});
								i++;
							}
							else if (nextToken && nextTokenType !== "whitespace") {
								var tab_spaces = addTabSpaces(nestedLoops)
								tokens.splice(i + 1, 0, {
									"value": tab_spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								});
								i++;
							}
						}
					}
					else if (tokenValue === '{') {
						if (nextToken && nextTokenValue !== "}" && nextTokenType !== "whitespace") {
							var tab_spaces = addTabSpaces(nestedLoops)
							tokens.splice(i + 1, 0, {
								"value": tab_spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							});
							i++;
						}
					}
					else if (tokenValue === '}') {
						if (prevTokenValue !== "{") {
							if (prevToken && prevTokenType !== "whitespace") {
								var tab_spaces = addTabSpaces(nestedLoops)
								tokens.splice(i, 0, {
									"value": tab_spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								});
								i++;
							}
							if (i - 1 >= 0) {
								prevToken = tokens[i - 1];
								prevTokenValue = prevToken.value;
								prevTokenType = prevToken.tokenInfo.token;
							}
							if (i + 1 < tokens.length) {
								nextToken = tokens[i + 1];
								nextTokenValue = nextToken.value;
								nextTokenType = nextToken.tokenInfo.token;
							}
							if (nextToken && nextTokenValue !== ")" && nextTokenValue !== "," && nextTokenValue !== "." && nextTokenValue !== ";" && nextTokenValue !== "]" && i !== tokens.length - 1) {
								if (prevToken && (prevTokenType !== "whitespace") && prevTokenValue !== "{") {
									var tab_spaces = addTabSpaces(nestedLoops)
									tokens.splice(i, 0, {
										"value": tab_spaces,
										"tokenInfo": {
											"token": "whitespace"
										}
									});
									i++;
								}

								if (nextToken && (nextTokenType === "function-call" || nextTokenType === "comment" || nextTokenType === "Indentifier" || nextTokenType === "keyword")) {
									var tab_spaces = addTabSpaces(nestedLoops)
									tokens.splice(i + 1, 0, {
										"value": tab_spaces,
										"tokenInfo": {
											"token": "whitespace"
										}
									});
									i++;
								}
								else if (nextToken && nextTokenType !== "whitespace") {
									var tab_spaces = addTabSpaces(nestedLoops - 1)
									tokens.splice(i + 1, 0, {
										"value": tab_spaces,
										"tokenInfo": {
											"token": "whitespace"
										}
									});
									i++;
								}
							}
							else if (nextToken && nextTokenValue === ")") {
								if (i + 2 < tokens.length && (tokens[i + 2].value === "," || tokens[i + 2].value === ";") && i + 2 !== tokens.length - 1) {
									if (i + 3 < tokens.length && tokens[i + 3].value !== "}" && tokens[i + 3].tokenInfo.token !== "whitespace") {
										var tab_spaces = addTabSpaces(nestedLoops)
										tokens.splice(i + 3, 0, {
											"value": tab_spaces,
											"tokenInfo": {
												"token": "whitespace"
											}
										});
										i = i + 2;
									}
								}
							}
							else if (nextToken && nextTokenValue === "," && i + 1 !== tokens.length - 1) {
								if (i + 2 < tokens.length && tokens[i + 2].value === "}") {
									var tab_spaces = addTabSpaces(nestedLoops - 1)
									tokens.splice(i + 2, 0, {
										"value": tab_spaces,
										"tokenInfo": {
											"token": "whitespace"
										}
									});
									i++;
								}
								else if (i + 2 < tokens.length && tokens[i + 2].tokenInfo.token !== "whitespace") {
									var tab_spaces = addTabSpaces(nestedLoops)
									tokens.splice(i + 2, 0, {
										"value": tab_spaces,
										"tokenInfo": {
											"token": "whitespace"
										}
									});
									i++;
								}
								else if (i + 2 < tokens.length) {
									var tab_spaces = addTabSpaces(nestedLoops)
									tokens.splice(i + 2, 0, {
										"value": tab_spaces,
										"tokenInfo": {
											"token": "whitespace"
										}
									});
									i++;
								}
							}
						}
						else if (nextToken && nextTokenValue === "," && i + 1 !== tokens.length - 1) {
							if (i + 2 < tokens.length && tokens[i + 2].tokenInfo.token !== "whitespace") {
								var tab_spaces = addTabSpaces(nestedLoops)
								tokens.splice(i + 2, 0, {
									"value": tab_spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								});
								i++;
							}
						}
					}
					else if (tokenValue === ",") {
						if (nextTokenType !== "whitespace") {
							tokens.splice(i + 1, 0, {
								"value": " ",
								"tokenInfo": {
									"token": "whitespace"
								}
							});
							i++;
						}
					}
					else if (tokenValue === "(" && nextTokenValue !== "{" && nextTokenValue !== "[" && nextTokenValue !== ")") {
						tokens.splice(i + 1, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
					else if (tokenValue === ")" && prevTokenValue !== "}" && prevTokenValue !== ")" && prevTokenValue !== "]" && prevTokenValue !== "(") {
						tokens.splice(i, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
					else if (tokenValue === '[' && (nextTokenType === "Indentifier" || nextTokenType === "keyword" || nextTokenType === "literal")) {
						tokens.splice(i + 1, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
					else if (tokenValue === ']' && (prevTokenType === "Indentifier" || prevTokenType === "keyword" || prevTokenType === "literal")) {
						tokens.splice(i, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
					// Dealing the objects of javascript
					else if (tokenValue === ":") {
						if (nextToken) {
							if (nextTokenType === "literal" || nextTokenType === "Indentifier") {
								if (i + 2 < tokens.length) {
									let next2Token = tokens[i + 2];
									let next2TokenValue = next2Token.value;
									if (next2TokenValue === ",") {
										var tab_spaces = addTabSpaces(nestedLoops)
										tokens.splice(i + 3, 0, {
											"value": tab_spaces,
											"tokenInfo": {
												"token": "whitespace"
											}
										});
									}
								}
							}
						}
						if (nextToken && nextTokenType !== "whitespace") {
							tokens.splice(i + 1, 0, {
								"value": " ",
								"tokenInfo": {
									"token": "whitespace"
								}
							});
							i++;
						}
					}
				}
				else if (tokenType === 'comment') {
					if (i !== 0 && prevToken && prevTokenType !== "whitespace") {
						var tab_spaces = addTabSpaces(nestedLoops)
						tokens.splice(i, 0, {
							"value": tab_spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
					else if (i !== 0 && prevToken && prevTokenType === "whitespace" && !prevTokenValue.includes("\n")) {
						var tab_spaces = addTabSpaces(nestedLoops)
						tokens[i - 1] = {
							"value": tab_spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						}
					}
					if (nextTokenValue === "}") {
						var tab_spaces = addTabSpaces(nestedLoops - 1)
						tokens.splice(i + 1, 0, {
							"value": tab_spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						});
					}
					else if (i !== tokens.length - 1 && nextTokenType !== "whitespace") {
						var tab_spaces = addTabSpaces(nestedLoops)
						tokens.splice(i + 1, 0, {
							"value": tab_spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						});
					}
				}
				else if (tokenType === "operator" && tokenValue !== ".") {
					if (prevTokenType !== "whitespace" && prevTokenType !== "operator" && tokenValue !== "++" && tokenValue !== "--" && tokenValue !== "**") {
						tokens.splice(i, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
					if (tokenValue !== "!" && nextTokenType !== "whitespace" && nextTokenType !== "operator" && nextTokenValue !== ";") {
						tokens.splice(i + 1, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}

				}
				else if (tokenType === "keyword" || tokenType === "function-call") {
					if (nextTokenType !== "operator" && nextTokenType !== "punctuator") {
						tokens.splice(i + 1, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
					else if (tokenValue === "return") {
						tokens.splice(i + 1, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
					if (tokenValue === "if" || tokenValue === "for" || tokenValue === "while") {
						if (prevToken && prevTokenType !== "whitespace") {
							var tab_spaces = addTabSpaces(nestedLoops)
							tokens.splice(i, 0, {
								"value": tab_spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							});
						}
						var result = handleCondBlock(i, tokens);
						if (result.endIndex !== 0) {
							i = result.endIndex;
							var j = result.endIndex;
							tokens = result.tokens
							if (i + 1 < tokens.length) {
								var tempToken = tokens[j + 1];
								var tempTokenValue = tempToken.value;

								if (tempTokenValue !== "{" && tempTokenValue !== ";") {
									var tab_spaces = addTabSpaces(nestedLoops + 1)
									tokens.splice(j + 1, 0, {
										"value": tab_spaces,
										"tokenInfo": {
											"token": "whitespace"
										}
									});
								}
							}
						}
					}
					if (tokenValue === "switch") {
						var switchEnd = identifySwitchEnd(tokens, i);
						if (switchEnd > 0) {
							var switchBlock = tokens.slice(i + 1, switchEnd + 1);
							const part1 = tokens.slice(0, i + 1);
							const newPart1 = JSON.parse(JSON.stringify(part1));
							const part3 = tokens.slice(switchEnd + 1, tokens.length);
							const newPart3 = JSON.parse(JSON.stringify(part3));
							var newPart2 = indentSwitchJs(switchBlock, nestedLoops);
							tokens = newPart1.concat(newPart2, newPart3);
						}
					}
				}
				else if (tokenType === "Indentifier") {
					if (nextToken && nextTokenType !== "operator" && nextTokenType !== "punctuator") {
						tokens.splice(i + 1, 0, {
							"value": " ",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
				}
			}
			return tokens;
		}

		/**
		* Handles the indentation of the switch blocks in Js
		* @param {object} tokens
		* @returns the tokens array
		*/
		function indentSwitchJs(tokens, nestedLoops) {
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenValue = token.value;
				if (i > 0) {
					var prevTokenType = tokens[i - 1].tokenInfo.token
				}
				if (tokenValue === 'case' || tokenValue === 'default') {
					if (prevTokenType !== "whitespace") {
						var tab_spaces = addTabSpaces(nestedLoops + 1)
						tokens.splice(i, 0, {
							"value": tab_spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
					var startIndex = i + 1;
					var end = identifyCaseBlocks(tokens, startIndex);

					while (i < end) {
						var token = tokens[i];
						var tokenValue = token.value;
						var tokenType = token.tokenInfo.token
						let nextToken, nextTokenValue, nextTokenType;

						if (i + 1 < tokens.length) {
							nextToken = tokens[i + 1];
							nextTokenValue = tokens[i + 1].value;
							nextTokenType = tokens[i + 1].tokenInfo.token;
						}
						if (tokenType === "punctuator") {
							if (tokenValue === ":") {
								var tab_spaces = addTabSpaces(nestedLoops + 2)
								tokens.splice(i + 1, 0, {
									"value": tab_spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								});
								end++;
							}
							else if (tokenValue === ";" && nextTokenValue !== "case" && nextTokenValue !== "default") {
								if (nextToken && nextTokenValue === "}" && nextTokenType !== "whitespace") {
									var tab_spaces = addTabSpaces(nestedLoops)
									tokens.splice(i + 1, 0, {
										"value": tab_spaces,
										"tokenInfo": {
											"token": "whitespace"
										}
									});
									end++;
								}
								else if (nextToken && nextTokenType !== "whitespace") {
									var tab_spaces = addTabSpaces(nestedLoops + 2)
									tokens.splice(i + 1, 0, {
										"value": tab_spaces,
										"tokenInfo": {
											"token": "whitespace"
										}
									});
									end++;
								}
							}

						}
						else if (tokenType === "comment") {
							if (nextToken && nextTokenValue !== "}") {
								var tab_spaces = addTabSpaces(nestedLoops + 2)
								tokens.splice(i + 1, 0, {
									"value": tab_spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								});
								end++;
							}
							if (nextToken && nextTokenValue === "}") {
								var tab_spaces = addTabSpaces(nestedLoops)
								tokens.splice(i + 1, 0, {
									"value": tab_spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								});
								end++;
							}
						}
						i++;
					}
				}
			}
			return tokens;
		}

		/**
		 * Remove the whitespaces of Js and add the right indentation
		 * @param {object} tokens
		 * @returns the tokens array
		 */
		function handleJs(tokens) {
			// Remove end trailing whitespace
			var whitespacePattern = /^[\s\n\t]*$/;
			var endIndex = tokens.length;
			if (tokens[endIndex - 1].tokenInfo.token === 'whitespace' && whitespacePattern.test(tokens[endIndex - 1].value)) {
				tokens.splice(endIndex - 1, 1)
			}

			//remove all the whitespaces
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;

				if (tokenType === 'whitespace') {
					tokens.splice(i, 1);
					i--;  // Decrement the index to account for the removed token
				}
			}
			tokens = indentJs(tokens);
			return tokens;
		}

		// HTML
		/**
		 * Identify the end index of the corresponding html tag
		 * Used in the case of style and script tags
		 * @param {object} tokens
		 * @param {int} startIndex
		 * @param {*string} startingTag
		 * @returns the end index of the html tag block
		 */
		function identifyEndHtml(tokens, startIndex, startingTag) {
			var nestedBlocks = 0;
			for (var i = startIndex + 2; i < tokens.length; i++) {
				var token = tokens[i];

				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;
				var tokenValue = token.value;

				if (tokenType === 'tag-name') {
					if (tokenValue === startingTag) {
						var prevValue = tokens[i - 1].value;
						if (prevValue === '</') {
							if ((i + 1 < tokens.length) && (tokens[i + 1].value === '>')) {
								if (nestedBlocks === 0) {
									return i + 1;
								}
								else {
									nestedBlocks--;
								}
							}
						}
						else {
							nestedBlocks++;
						}
					}
				}
			}
			return 0
		}

		/**
		 * Removes the unwanted spacings and remove them
		 * @param {object} tokens
		 * @returns the tokens array
		 */
		function trimSpacesHtml(tokens) {
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;
				var tokenValue = token.value;
				var pattern = /^[\n\t\s]*$/;

				if (tokenType === 'whitespace' || pattern.test(tokenValue)) {
					tokens.splice(i, 1);
				}
			}
			return tokens;
		}

		/**
		* Add indentation for tokens inside script and style tags
		* @param {object} tokens
		* @returns the tokens array
		*/
		function indentSpecialTagsHtml(tokens, nestedLoops, blockName) {
			var tabSpaces = addTabSpaces(nestedLoops)
			tabSpaces = tabSpaces.replace(/\n/g, '');
			var new_line_tabspace
			if (nestedLoops > 1) {
				var tab_spaces = tabSpaces;
				new_line_tabspace = {
					"value": "\n" + tabSpaces,
					"tokenInfo": {
						"token": "whitespace"
					}
				};
			}
			else {
				tab_spaces = "\t";
				new_line_tabspace = {
					"value": "\n\t",
					"tokenInfo": {
						"token": "whitespace"
					}
				};
			}

			// indent CSS can't be used because trailing spaces has to be eliminated
			if (blockName === "style") {
				tokens = handleCSS(tokens)
			}
			else if (blockName === "script") {
				tokens = indentJs(tokens)
			}

			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenValue = token.value;
				var tokenType = token.tokenInfo.token;
				let nextTokenValue, nextToken;

				if (i + 1 < tokens.length) {
					nextToken = tokens[i + 1];
					nextTokenType = nextToken.tokenInfo.token;
					nextTokenValue = nextToken.value;
				}
				if (tokenType === "whitespace" && tokenValue.includes("\n")) {
					if (nextToken && nextTokenValue === '}') {
						tokenValue = tokenValue + tab_spaces;
					}
					else {
						tokenValue = tokenValue + tab_spaces;
					}
					token.value = tokenValue;
					tokens[i] = token;
				}
			}
			tokens.unshift(new_line_tabspace)
			return tokens;
		}

		/**
		 * Add indentation using the count of nested tags
		 * @param {object} tokens
		 * @returns
		 */
		function indentHtml(tokens) {
			var nestedLoops = 0;

			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenValue = token.value;
				var tokenType = token.tokenInfo.token;
				let prevToken, prevTokenType, prevTokenValue;
				let nextToken, nextTokenType, nextTokenValue;

				var spaces = "";
				if (i + 1 < tokens.length) {
					nextToken = tokens[i + 1];
					nextTokenValue = nextToken.value;
					nextTokenType = nextToken.tokenInfo.token;
				}
				if (i > 0) {
					prevToken = tokens[i - 1];
					prevTokenValue = prevToken.value;
					prevTokenType = prevToken.tokenInfo.token;
				}

				if (tokenType === "punctuation") {
					if (tokenValue === "<") {
						if (nextToken && nextTokenType === "tag-name") {
							nestedLoops++;
						}
						if (prevToken && prevTokenType !== "whitespace") {
							spaces = addTabSpaces(nestedLoops - 1)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i, 0, spaceToken);
							i++;
						}
					}
					else if (tokenValue === "</") {
						if (nextToken && nextTokenType !== "whitespace") {
							spaces = addTabSpaces(nestedLoops - 1)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i, 0, spaceToken);
							i++;
						}
						else if (!nextToken) {
							spaces = addTabSpaces(nestedLoops - 1)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i, 0, spaceToken);
							i++;
						}
						nestedLoops--;
					}

					else if (tokenValue === ">") {
						if (nextToken && (nextTokenValue === "<" || nextTokenType === "content" || nextTokenType === "comment")) {
							if (prevTokenValue === "/") {
								spaces = addTabSpaces(nestedLoops)
								var spaceToken = {
									"value": spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								};
								tokens.splice(i + 1, 0, spaceToken);
								i++;
							}
							else {
								spaces = addTabSpaces(nestedLoops)
								var spaceToken = {
									"value": spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								};
								tokens.splice(i + 1, 0, spaceToken);
								i++;
							}
						}
					}
					else if (tokenValue === '/>') {
						nestedLoops--;
						if (nextToken && nextTokenType !== "whitespace" && nextTokenValue !== "</") {
							spaces = addTabSpaces(nestedLoops)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i + 1, 0, spaceToken);
							i++;
						}
						else if (!nextToken) {
							spaces = addTabSpaces(nestedLoops)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i + 1, 0, spaceToken);
							i++;
						}
					}
				}
				else if (tokenType === "content" && nextToken && nextTokenValue === "<" && prevToken && prevTokenType !== "whitespace") {
					if (nextTokenType !== "whitespace") {
						spaces = addTabSpaces(nestedLoops)
						var spaceToken = {
							"value": spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						};
						tokens.splice(i + 1, 0, spaceToken);
						i++;
					}
				}

				else if (tokenType === 'tag-name' && prevTokenValue !== "</") {
					var blockName = tokenValue;
					if (blockName === "style" || blockName === "script") {
						var blockStartIndex = i - 1;
						var blockEndIndex = identifyEndHtml(tokens, blockStartIndex, blockName);

						var startIndex, endIndex;
						for (var j = blockStartIndex; i < blockEndIndex - 2; j++) {
							var token = tokens[j];
							var tokenValue = token.value;

							if (tokenValue === '>') {
								if ((tokens[j - 2].value !== ('</'))) {
									startIndex = j + 1;
									endIndex = blockEndIndex - 2;
									break;
								}
							}
						}
						if (startIndex !== endIndex) {
							var part1 = tokens.slice(0, startIndex);
							var part2 = tokens.slice(startIndex, endIndex);
							var part3 = tokens.slice(endIndex, tokens.length);

							if (blockName === "style" || blockName === "script") {
								part2 = indentSpecialTagsHtml(part2, nestedLoops, blockName)
							}
							tokens = part1.concat(part2, part3);
							i = blockEndIndex - 1;
						}
						else {
							i = blockEndIndex - 1;
							nestedLoops--;
						}
					}
				}

				else if (tokenType === 'attribute-name') {
					tokenValue = tokenValue.trim();
					token.value = tokenValue;
					tokens[i] = token;

					tokens.splice(i, 0, space);
					tokens.splice(i + 2, 0, space);
					i = i + 1;
				}

				else if (tokenType === 'attribute-equals') {
					tokenValue = tokenValue.trim();
					token.value = tokenValue;
					tokens[i] = token;
					tokens.splice(i + 1, 0, space);
					i++;
				}

				else if (tokenType === 'attribute-value') {
					tokenValue = tokenValue.replace(/:/g, ":").replace(/;/g, ";");
					token.value = tokenValue;
					tokens[i] = token;
				}

				else if (tokenType === 'comment') {
					if (prevToken && prevTokenType !== "whitespace") {
						spaces = addTabSpaces(nestedLoops)
						var spaceToken = {
							"value": spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						};
						tokens.splice(i, 0, spaceToken);
						i++;
					}
					if (nextToken && nextTokenType === "content") {
						spaces = addTabSpaces(nestedLoops)
						var spaceToken = {
							"value": spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						};
						tokens.splice(i + 1, 0, spaceToken);
						i++;
					}
				}
			}
			return tokens;
		}

		/**
		 * Add indentation to the html code
		 * @param {object} tokens
		 * @returns the tokens array
		 */
		function handleHtml(tokens) {
			tokens = trimSpacesHtml(tokens);
			tokens = indentHtml(tokens);
			return tokens;
		}

		// XML

		/**
		 * Add indentation using the count of nested tags
		 * @param {object} tokens
		 * @returns
		 */
		function indentXml(tokens) {
			var nestedLoops = 0;

			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenValue = token.value;
				var tokenType = token.tokenInfo.token;
				let prevToken, prevTokenType, prevTokenValue;
				let nextToken, nextTokenType, nextTokenValue;

				var spaces = "";
				if (i + 1 < tokens.length) {
					nextToken = tokens[i + 1];
					nextTokenValue = nextToken.value;
					nextTokenType = nextToken.tokenInfo.token;
				}
				if (i > 0) {
					prevToken = tokens[i - 1];
					prevTokenValue = prevToken.value;
					prevTokenType = prevToken.tokenInfo.token;
				}

				if (tokenType === "punctuation") {
					if (tokenValue === "<") {
						if (nextToken && nextTokenType === "tag-name") {
							nestedLoops++;
						}
						if (prevToken && (prevTokenValue.trim() === "+" || prevTokenValue.trim() === "-")) {
							prevTokenValue = prevTokenValue.trim() + " ";
							tokens[i - 1].value = prevTokenValue;
						}
						else if (prevToken && prevTokenType !== "whitespace") {
							spaces = addTabSpaces(nestedLoops - 1)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i, 0, spaceToken);
							i++;
						}
					}

					else if (tokenValue === "</") {
						if (prevToken && prevTokenType !== "whitespace") {
							spaces = addTabSpaces(nestedLoops - 1)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i, 0, spaceToken);
							i++;
						}
						nestedLoops--;
					}

					else if (tokenValue === ">") {
						if (nextToken && (nextTokenValue === "<" || nextTokenType === "content" || nextTokenType === "comment")) {
							if (prevTokenValue === "/") {
								spaces = addTabSpaces(nestedLoops)
								var spaceToken = {
									"value": spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								};
								tokens.splice(i + 1, 0, spaceToken);
								i++;
							}
							else {
								spaces = addTabSpaces(nestedLoops)
								var spaceToken = {
									"value": spaces,
									"tokenInfo": {
										"token": "whitespace"
									}
								};
								tokens.splice(i + 1, 0, spaceToken);
								i++;
							}
						}
					}
					else if (tokenValue === '/>') {
						nestedLoops--;
						if (nextToken && nextTokenType !== "whitespace" && nextTokenValue !== "</") {
							spaces = addTabSpaces(nestedLoops)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i + 1, 0, spaceToken);
							i++;
						}

						// This works only if the xml tokenizer is corrected
						else if (!nextToken) {
							spaces = addTabSpaces(nestedLoops)
							var spaceToken = {
								"value": spaces,
								"tokenInfo": {
									"token": "whitespace"
								}
							};
							tokens.splice(i + 1, 0, spaceToken);
							i++;
						}
					}
				}

				else if (tokenType === "content" && nextToken && nextTokenValue === "<" && prevToken && prevTokenType !== "whitespace") {
					if (nextTokenType !== "whitespace") {
						spaces = addTabSpaces(nestedLoops)
						var spaceToken = {
							"value": spaces,
							"tokenInfo": {
								"token": "whitespace"
							}
						};
						tokens.splice(i + 1, 0, spaceToken);
						i++;
					}
				}

				else if (tokenType === 'attribute-name') {
					tokenValue = tokenValue.trim();
					token.value = tokenValue;
					tokens[i] = token;
					tokens.splice(i, 0, space);
					tokens.splice(i + 2, 0, space);
					i = i + 1;
				}

				else if (tokenType === 'attribute-equals') {
					tokenValue = tokenValue.trim();
					token.value = tokenValue;
					tokens[i] = token;
					tokens.splice(i + 1, 0, space);
					i++;
				}

				else if (tokenType === 'attribute-value') {
					tokenValue = tokenValue.replace(/:/g, ": ").replace(/;/g, "; ");
					token.value = tokenValue;
					tokens[i] = token;
				}
			}
			return tokens;
		}

		/**
		 * Handle the xml blocks
		 * @param {object} tokens
		 * @returns the tokens array
		 */
		function handleXml(tokens) {
			tokens = trimSpacesHtml(tokens);
			tokens = indentXml(tokens);
			return tokens;
		}

		// Python
		/**
		 * The whitespace is added based on types of token
		 * Extra whitespaces are removed
		 * @param {object} tokens
		 * @returns the tokens array
		 */
		function manageSpacePy(tokens) {
			var excludePunctuators = ['(', ')', '{', '}', '[', ']', ';', ":"]
			var excludeOperators = ['.']
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;

				var tokenType = tokenInfo.token;
				var tokenValue = token.value;
				let nextToken, nextTokenType;
				if (i + 1 < tokens.length) {
					nextToken = tokens[i + 1];
					nextTokenType = nextToken.tokenInfo.token;
					nextTokenValue = nextToken.value;
				}

				let prevToken, prevTokenType;
				if (i - 1 > -1) {
					prevToken = tokens[i - 1];
					prevTokenType = prevToken.tokenInfo.token;
					prevTokenValue = prevToken.value;
				}

				if (tokenType === 'punctuator') {
					if (!excludePunctuators.includes(tokenValue)) {
						if (nextToken && nextTokenType !== 'whitespace') {
							tokens.splice(i + 1, 0, space);
						}
					}
				}
				else if (tokenType === 'operator') {
					if (!excludeOperators.includes(tokenValue)) {
						if (prevToken && prevTokenType !== 'whitespace') {
							tokens.splice(i, 0, space);
							i++;
						}
						if (nextToken && nextTokenType !== 'whitespace') {
							tokens.splice(i + 1, 0, space);
						}
					}
				}
			}
			return tokens;
		}

		/**
		 * Indent the tokens and return the intended tokens of python code
		 * @param {object} tokens Array of all the tokens
		 * @returns the indented tokens
		 */
		function handlePython(tokens) {
			var whitespacePattern = /^[\s\n\t]*$/;

			var endIndex = tokens.length;
			if (tokens[endIndex - 1].tokenInfo.token === 'whitespace' && whitespacePattern.test(tokens[endIndex - 1].value)) {
				tokens.splice(endIndex - 1, 1)
			}
			// Remove the trailing spaces from the beginning
			if (tokens[0].tokenInfo.token === 'whitespace') {
				tokens.shift();
			}
			tokens = manageSpacePy(tokens)
			return tokens;
		}

		// Java
		/**
		 * Find the parenthesis of condition block of the for loop of Java
		 * @param {object} tokens
		 * @returns
		 */
		function identifyParenthesisOfForBlockJava(tokens) {
			for (var i = 0; i < tokens.length; i++) {

				var token = tokens[i];
				var tokenValue = token.value;

				if (tokenValue === '(') {
					// Start of the condition block
					var conditionStartIndex = i;
					var parenthesesCount = 1;

					// Iterate through the tokens to find the end of the condition block
					for (var j = i + 1; j < tokens.length; j++) {
						let nextToken = tokens[j];
						let nextValue = nextToken.value;

						if (nextValue === '(') {
							parenthesesCount++;
						}
						else if (nextValue === ')') {
							parenthesesCount--;
							if (parenthesesCount === 0) {
								// End of the condition block
								var conditionEndIndex = j;
								// Process the condition block as needed
								return ([conditionStartIndex, conditionEndIndex]);
							}
						}
					}
				}
			}
			return [];
		}

		/**
		 * The whitespace is added based on operators, identifiers, keywords and punctuators
		 * @param {object} tokens
		 * @returns the tokens array
		 */
		function manageSpaceJava(tokens) {
			var excludeOperators = ['.', '++', '--', '**']
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;

				var tokenType = tokenInfo.token;
				var tokenValue = token.value;
				let nextToken, nextTokenType, nextTokenValue;
				if (i + 1 < tokens.length) {
					nextToken = tokens[i + 1];
					nextTokenType = nextToken.tokenInfo.token;
					nextTokenValue = nextToken.value;
				}

				let prevToken, prevTokenType, prevTokenValue;
				if (i - 1 > -1) {
					prevToken = tokens[i - 1];
					prevTokenType = prevToken.tokenInfo.token;
					prevTokenValue = prevToken.value;
				}

				if (tokenType === 'keyword') {
					if (nextToken && nextTokenType !== 'whitespace' && nextTokenValue !== '.') {
						tokens.splice(i + 1, 0, space);
					}
				}
				else if (tokenType === 'operator') {
					if (!excludeOperators.includes(tokenValue)) {
						if (prevToken && prevTokenType !== 'whitespace') {
							tokens.splice(i, 0, space);
							i++;
						}
						if (nextToken && nextTokenType !== 'whitespace') {
							tokens.splice(i + 1, 0, space);
						}
					}
				}
				else if (tokenType === 'punctuator') {
					if (tokenValue === ',' || tokenValue === '|') {
						if (nextToken && nextTokenType !== 'whitespace') {
							tokens.splice(i + 1, 0, space);
						}
					}
					else if (tokenValue === '->') {
						if (prevToken && prevTokenType !== 'whitespace') {
							tokens.splice(i, 0, space);
							i++;
						}
					}

				}
				else if (tokenType === 'identifier') {
					if (nextToken && !excludeOperators.includes(nextTokenValue)) {
						if (nextToken && nextTokenType !== 'whitespace' && nextTokenType !== 'punctuator' && nextTokenValue !== '.') {
							tokens.splice(i + 1, 0, space);
						}
					}
					if (prevToken && prevTokenType !== 'whitespace' && prevTokenValue !== '.' && prevTokenValue !== '(') {
						tokens.splice(i, 0, space);
						i++;
					}
				}
			}
			var lastToken = tokens[tokens.length - 1];
			if (lastToken) {
				var lastTokenType = lastToken.tokenInfo.token;
				if (lastTokenType === 'whitespace') {
					tokens.pop();
				}
			}
			return tokens;
		}

		/**
		 * New line character added after the semicolon
		 * @param {object} tokens
		 * @returns the tokens with added new line character as whitespace
		 */
		function identifyLinesJava(tokens) {
			for (var i = 0; i < tokens.length; i++) {
				var new_line = {
					"value": "\n",
					"tokenInfo": {
						"token": "whitespace"
					}
				};
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;
				var tokenValue = token.value;
				let nextToken, nextTokenValue, nextTokenType, prevToken, prevTokenValue, prevTokenType;
				if (i + 1 < tokens.length) {
					var next = i + 1;
					nextToken = tokens[i + 1];
					nextTokenValue = nextToken.value;
					nextTokenType = nextToken.tokenInfo.token;
				}
				if (i - 1 >= 0) {
					var prev = i - 1;
					prevToken = tokens[i - 1];
					prevTokenValue = prevToken.value;
					prevTokenType = prevToken.tokenInfo.token;
				}
				if (tokenValue === ';') {
					if (nextToken) {
						if (nextTokenType === 'whitespace') {
							nextToken.value = '\n' + nextTokenValue;
							tokens[i + 1] = nextToken;
						}
						else {
							tokens.splice(i + 1, 0, new_line);
							i++;
						}
					}
					else {
						tokens.splice(i + 1, 0, new_line);
						i++;
					}
				}
				else if (tokenValue === '{') {
					if (nextToken && nextTokenValue !== '}') {
						if (nextTokenType === 'whitespace') {
							nextToken.value = '\n' + nextTokenValue;
							tokens[i + 1] = nextToken;
						}
						else {
							tokens.splice(i + 1, 0, new_line);
							i++;
						}
					}
				}
				else if (tokenValue === '}') {
					if (nextToken && nextTokenValue !== ';' && nextTokenValue !== '{') {
						if (nextTokenType === 'whitespace') {
							nextToken.value = '\n' + nextTokenValue;
							tokens[i + 1] = nextToken;
						}
						else {
							tokens.splice(i + 1, 0, new_line);
							i++;
						}
					}
					else {
						// add check whether prevtoken is whitespace
						if (prevToken && prevTokenType !== 'whitespace') {
							tokens.splice(i, 0, new_line);
							i++;
						}
					}
				}
				else if (tokenType === 'comment') {

					if (i !== 0) {
						if (prevToken && prevTokenType === 'whitespace' && !prevTokenValue.includes('\n')) {
							prevToken.value = prevTokenValue + '\n';
							tokens[prev] = prevToken;
						}
						else if (prevToken && prevTokenType !== 'whitespace') {
							tokens.splice(i, 0, {
								"value": "\n",
								"tokenInfo": {
									"token": "whitespace"
								}
							});
							i++;
						}
					}
					if (nextToken && nextTokenType === 'whitespace' && !nextTokenValue.includes('\n')) {
						nextToken.value = '\n' + nextTokenValue;
						tokens[next] = nextToken;
					}
					else if (nextToken && nextTokenType !== 'whitespace') {
						tokens.splice(i + 1, 0, {
							"value": "\n",
							"tokenInfo": {
								"token": "whitespace"
							}
						});
						i++;
					}
				}
			}
			return tokens;
		}

		/**
		 * The tab spaces are add based on the number of blocks inside which the line is placed
		 * @param {string} tokenValue the whitespace value
		 * @param {int} nestedLoop the number of loops
		 * @returns the whitespace string after adding required number of tab spaces
		 */
		function addTabSpacesJava(tokenValue, nestedLoop) {
			for (let i = 0; i < nestedLoop; i++) {
				tokenValue = tokenValue + '\t';
			}
			return tokenValue
		}

		/**
		* Handles the indentation of the switch blocks in java
		* @param {object} tokens
		* @returns the tokens array
		*/
		function indentSwitchJava(tokens) {
			var new_line = {
				"value": "\n",
				"tokenInfo": {
					"token": "whitespace"
				}
			};
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;

				var tokenType = tokenInfo.token;
				var tokenValue = token.value;
				if (tokenValue === 'case' || tokenValue === 'default') {
					if ((tokens[i - 1].value.includes('\n'))) {
						var value = tokens[i - 1].value + '\t'
						var whitespace = {
							"value": value,
							"tokenInfo": {
								"token": "whitespace"
							}
						};
						tokens[i - 1] = whitespace;
					}
					else if ((tokens[i - 1].value === ':')) {
						tokens.splice(i, 0, new_line);
					}
					var startIndex = i + 1;
					var end = identifyCaseBlocks(tokens, startIndex);

					while (i < end - 1) {
						token = tokens[i];
						tokenInfo = token.tokenInfo;
						tokenType = tokenInfo.token;
						tokenValue = token.value;

						if (tokenType === 'whitespace') {
							if (tokenValue.includes('\n')) {
								var value = tokens[i].value + '\t';
								var whitespace = {
									"value": value,
									"tokenInfo": {
										"token": "whitespace"
									}
								};
								tokens[i] = whitespace;
							}
						}
						if (tokenValue === ':') {
							var nextTokenValue = tokens[i + 1].value;
							var nextTokenType = tokens[i + 1].tokenInfo.token;

							if ((!nextTokenValue.includes('\n') && (nextTokenType !== 'comment') && (nextTokenType !== 'whitespace'))) {
								tokens.splice(i + 1, 0, new_line);
							}
						}
						i++;
						end = identifyCaseBlocks(tokens, startIndex);
					}
				}
			}

			var index = tokens.length - 2;
			if (index > -1) {
				let prevToken = tokens[index];
				let prevTokenValue = prevToken.value;
				let prevTokenType = prevToken.tokenInfo.token;
				if ((prevTokenType !== 'whitespace') && (!prevTokenValue.includes('\n'))) {
					tokens.splice(index + 1, 0, new_line);
				}
			}
			return tokens;
		}

		/**
		 * Add the right indentation for the java code
		 * @param {object} tokens
		 * @returns the indented array of tokens
		 */
		function indentJava(tokens) {
			var nestedLoop = 0;
			var switchEnd;
			for (let i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;
				var tokenValue = token.value;

				if (tokenType === 'punctuator') {
					if (tokenValue === '{') {
						nestedLoop++;
					}
					else if (tokenValue === '}') {
						nestedLoop--;
					}
				}

				else if (tokenType === 'whitespace') {
					var nextToken, nextTokenValue;
					if (i + 1 < tokens.length) {
						nextToken = tokens[i + 1];
						nextTokenValue = nextToken.value;
					}
					if (nextToken && nextTokenValue !== '}' && nextTokenValue !== 'case' && nextTokenValue !== 'default') {
						if (tokenValue.includes("\n")) {
							var indentedValue = addTabSpacesJava(tokenValue, nestedLoop);
							tokens[i].value = indentedValue;
						}
					}

					if (nextToken && (nextTokenValue === '}' || nextTokenValue === 'case' || nextTokenValue === 'default')) {
						if (tokenValue.includes("\n")) {
							var indentedValue = addTabSpacesJava(tokenValue, nestedLoop - 1);
							tokens[i].value = indentedValue;
						}
					}
					else if (!nextToken) {
						if (tokenValue.includes("\n")) {
							var indentedValue = addTabSpacesJava(tokenValue, nestedLoop);
							tokens[i].value = indentedValue;
						}
					}
				}
				else if (tokenType === 'keyword') {
					if (tokenValue === 'switch') {
						switchEnd = identifySwitchEnd(tokens, i);
						if (switchEnd > 0) {
							var switchBlock = tokens.slice(i, switchEnd + 1);
							const part1 = tokens.slice(0, i);
							const newPart1 = JSON.parse(JSON.stringify(part1));
							const part3 = tokens.slice(switchEnd + 1, tokens.length);
							const newPart3 = JSON.parse(JSON.stringify(part3));
							var newPart2 = indentSwitchJava(switchBlock);
							tokens = newPart1.concat(newPart2, newPart3);
						}
					}
					else if (tokenValue === 'for') {
						var forBlock = tokens.slice(i, tokens.length);

						var startIndex, endIndex;
						var [startIndex, endIndex] = identifyParenthesisOfForBlockJava(forBlock);
						startIndex = i + startIndex;
						endIndex = i + endIndex;

						if (startIndex && endIndex) {
							for (let j = startIndex + 1; j < endIndex; j++) {
								var tempToken = tokens[j];
								var tempTokenValue = tempToken.value;
								var tempTokenType = tempToken.tokenInfo.token;
								if (tempTokenType === 'whitespace' && tempTokenValue.includes('\n')) {
									tempToken.value = ' '
									tokens[j] = tempToken;
								}
							}
						}
					}
				}
			}
			return tokens;
		}

		/**
		 * Remove the whitespaces of Java and add the right indentation
		 * @param {object} tokens
		 * @returns the tokens array
		 */
		function handleJava(tokens) {

			// Remove end trailing whitespace
			var whitespacePattern = /^[\s\n\t]*$/;
			var endIndex = tokens.length;
			if (tokens[endIndex - 1].tokenInfo.token === 'whitespace' && whitespacePattern.test(tokens[endIndex - 1].value)) {
				tokens.splice(endIndex - 1, 1)
			}

			//remove all the whitespaces
			for (var i = 0; i < tokens.length; i++) {
				var token = tokens[i];
				var tokenInfo = token.tokenInfo;
				var tokenType = tokenInfo.token;

				if (tokenType === 'whitespace') {
					tokens.splice(i, 1);
					i--;  // Decrement the index to account for the removed token
				}
			}
			tokens = identifyLinesJava(tokens);
			tokens = indentJava(tokens);
			tokens = manageSpaceJava(tokens)
			return tokens;
		}

		builder.prototype.indentCode = function (tokens) {
			var data = this.tokenizer;
			var language = data.language;

			if (language === 'json') {
				tokens = handleObject(tokens);
			}
			else if (language === 'js') {
				tokens = handleJs(tokens);
			}
			else if (language === 'html') {
				tokens = handleHtml(tokens);
			}
			else if (language === 'css') {
				tokens = handleCSS(tokens);
			}
			else if (language === 'xml') {
				tokens = handleXml(tokens);
			}
			else if (language === 'python') {
				tokens = handlePython(tokens);
			}
			else if (language === 'java') {
				tokens = handleJava(tokens);
			}
			return tokens;
		}

		builder.prototype.buildSnippets = function (tokens) {
			var result = document.createDocumentFragment(), that = this, curLineNumber = 1;

			var calculateLineNumber = function (value) {
				var numberOfLineBreaks = (value.match(/(\n)/g) || []).length;
				curLineNumber += numberOfLineBreaks;
			}

			tokens.forEach(function (token) {
				var value = token.value,
					tokenObject = token.tokenInfo,
					cls = tokenObject.class || that.getClassForCommonTokens(tokenObject),
					span = document.createElement('span');
				span.setAttribute('class', cls);

				calculateLineNumber(value);
				span.textContent = value;
				result.appendChild(span);
			});

			return {
				snippet: result,
				lineCount: curLineNumber
			};
		}

		builder.prototype.getClassForCommonTokens = function (tokenObject) {
			switch (tokenObject.token) {
				case 'whitespace':
					return 'lyteCSWhiteSpace';
				case 'unmatched-token':
					return 'lyteCSUnmatchedToken';
			}
		}

		builder.prototype.build = function () {
			var tokens = this.tokenizer.build();
			if ($L.snippets.indent) {
				if ($L.snippets.indent === true) {
					tokens = this.indentCode(tokens);
				}
			}
			else if ($L.snippets.indent === undefined) {
				tokens = this.indentCode(tokens);
			}
			return this.buildSnippets(tokens);
		}

	}
)