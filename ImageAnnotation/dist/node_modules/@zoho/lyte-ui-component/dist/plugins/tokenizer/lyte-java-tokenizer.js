(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["@zoho/lyte-dom"], factory);
	}
	else {
		factory($L);
	}
})(function ($L) {
	$L.snippets.registerLanguage('java', {
		tokenConfig: [
			{
				'token': 'keyword',
				'regex': /\b(?:abstract|boolean|break|byte|case|catch|char|class|continue|default|do|double|else|enum|extends|final|finally|float|for|if|implements|import|instanceof|int|interface|long|native|new|package|private|protected|public|return|short|static|strictfp|super|switch|synchronized|this|throw|throws|transient|try|void|volatile|while|assert|const|goto)\b/,
				'class': 'javaKeyword'
			},
			{
				'token': 'utilClasses',
				'regex': /\b(Scanner|System|String|StringBuilder|Random|Integer|Math|Enum)\b/,
				'class': 'javaUtilClasses'
			},
			{
				'token': 'punctuator',
				'regex': /\-\>|\;|\,|\(|\)|\{|\}|\[|\]|\!|\&|\|/,
				// 'regex': /\-\>|\;|\,|\(|\)|\{|\}|\[|\]|\<|\>|\!|\&|\|/,
				'class': 'javaPunctuator'
			},
			{
				'token': 'operator',
				'regex': /\<|\>|\!|\<\<\=|\>\>\=|\^\=|\|\=|\&\=|\%\=|\/\=|\*\=|\-\=|\+\=|\|\||\&\&|\<\=|\>\=|\<|\>|\!\=|\=\=|\=|\-\-|\+\+|\%|\/|\*|\-|\+|\.|\:|\?/,
				'class': 'javaOperator'
			},
			{
				'token': 'identifier',
				'regex': /\b[a-zA-Z_][a-zA-Z0-9_]*\b/,
				'class': 'javaIdentifier'
			},
			{
				'token': 'string',
				'regex': /"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/,
				'class': 'javaString'
			},
			{
				'token': 'number',
				'regex': /\b(0[xX][0-9a-fA-F]+|\d+)\b/,
				'class': 'javaInteger'
			},
			{
				'token': 'float',
				'regex': /\b\d+\.\d+\b/,
				'class': 'javaFloat'
			},
			{
				'token': 'boolean',
				'regex': /\b(?:true|false)\b/,
				'class': 'javaBoolean'
			},
			{
				'token': 'null',
				'regex': /\b(?:null)\b/,
				'class': 'javaNull'
			},
			{
				'token': 'whitespace',
				'regex': /\s+/
			},
			{
				'token': 'regex',
				'class': 'javaRegex',
				'regex': /\/(?![\/\*]).*?\//
			},
			{
				'token': 'comment',
				'class': 'javaComment',
				'regex': /\/\/[^\n]*|\/\*[\s\S]*?\*\//
			},
			{
				'token': 'annotations',
				'class': 'javaAnnotations',
				'regex': /@([A-Za-z]+(?:\.[A-Za-z]+)*)/
			},
			{
				'token': 'others',
				'regex': 'remaining',
				'class': 'javaRemaining'
			}

		]
	});
});

