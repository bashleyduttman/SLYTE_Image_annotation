(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["@zoho/lyte-dom"], factory);
	}
	else {
		factory($L);
	}
})(
	function ($L) {
		$L.snippets.registerLanguage('js', {
			tokenConfig: [{
				'token': 'literal',
				// 'regex': /(?<stringStart>['"]).*?(?<!\\)(\\\\)*\k<stringStart>/,
				/*
					Match even number of slashes at the end
					If its odd number keep matching more stuff

					Eg: "abc\"abc" "abc\\\"abc" "abc\\\\\"abc" are valid strings
					"abc \\"abc" is not valid and the second double quote is the close of the string
				*/
				/**
				 * The strings to be matched after considering the escape characters
				 * Hence the number of backslashes has to be considered
				 * But the lookbehind assertions are removed
				 */
				'regex': /(['"])(.*?(?:(?:\\\\)*(\\\\)*)*)\1/, 'class': 'lyteJSStringLiteral'
			}, {
					'group': 'Indentifiers',
					'regex': /[a-zA-Z\_$][a-zA-Z\_$]*(\()?/,
				'matched-elements': [{
					'token': 'keyword',
					'regex': /\b(?:break|export|super|case|extends|switch|catch|finally|this|class|for|throw|const|function|try|continue|if|typeof|debugger|import|var|default|in|void|delete|instanceof|while|do|new|with|else|return|yield|enum|implements|package|public|interface|private|static|let|protected|await)\b/,
					'class': 'lyteJSKeyword'
				}, {
						'token': 'boolean',
						'regex': /\b(?:true|false)\b/,
						'class': 'lyteJSBoolean'
					}, {
						'token': 'undefined',
						'regex': /\b(?:undefined)\b/,
						'class': 'lyteJSUndefined'
					}, {
						'token': 'null',
						'regex': /\b(?:null)\b/,
						'class': 'lyteJSNull'
					}, {
						'group': 'function-call',
						'regex': /[a-zA-Z\_][a-zA-Z\_]*\(/,
					'matched-elements': [{
						'token': 'function-call',
						'regex': /[a-zA-Z\_][a-zA-Z\_]*/,
						'class': 'lyteJSFunction'
					}, {
							'token': 'punctuator',
							'regex': /\(/,
							'class': 'lyteJSPunctuator'
							}]
					}, {
						'token': 'Indentifier',
						'regex': 'remaining',
						'class': 'lyteJSIndentifier'
						}]
				}, {
					'token': 'comment',
					'regex': /(\/\/.*|\/\*[\s\S]*?\*\/)/,
					'class': 'lyteJSComment'
				}, {
					'token': 'operator',
					'regex': /(>>>=|===|!==|\*\*=|<<=|>>=|>>>|\.\.\.|\+=|-=|\*=|\/=|%=|&=|\^=|\|=|==|!=|>=|<=|\+\+|--|\*\*|<<|>>|&&|\|\||=>|\.|\?|~|>|<|=|!|\+|-|\*|%|&|\||\^|\\|\/)/,
					'class': 'lyteJSOperator'
				}, {
					'token': 'punctuator',
					'regex': /\(|\{|\[|\)|\}|\]|;|,|:|"|'/,
					'class': 'lyteJSPunctuator'
				}, {
					'token': 'number',
					'regex': /[0-9]+(\.[0-9]+)?/,
					'class': 'lyteJSNumber'
				}, {
					'token': 'regex',
					'class': 'lyteJSRegex',
					'regex': /\/(?![\/\*]).*?\//
				}]
		});
	}
);