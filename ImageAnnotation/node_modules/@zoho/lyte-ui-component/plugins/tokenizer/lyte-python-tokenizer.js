(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["@zoho/lyte-dom"], factory);
	}
	else {
		factory($L);
	}
})(function ($L) {
	$L.snippets.registerLanguage('python', {
		tokenConfig: [
			{
				'token': 'keyword',
				'regex': /\b(?:as|assert|async|await|break|class|continue|def|del|elif|else|except|finally|for|from|global|if|import|is|lambda|nonlocal|pass|raise|return|try|while|with|yield|float|id|int|len|max|min|pow|range|round|str|type)\b/,
				'class': 'pyKeyword'
			},
			{
				'token': 'punctuator',
				'regex': /\(|\)|\[|\]|\{|\}|;|,|:|\\/,
				'class': 'pyPunctuator'
			},
			{
				'token': 'operator',
				'regex': /\*\*\=|\/\/\=|\*\*|\/\/|\=\=|\!\=|\<\=|\>\=|\=|\+\=|\-\=|\*\=|\/\=|\%\=|\&|and|or|not|@|\&|\||\^|\~|\<\<|\>\>|in|not|\.|\+|\-|\*|\/|\%|\<|\>/,
				'class': 'pyOperator'
			},
			{
				'token': 'identifier',
				'regex': /[a-zA-Z_]\w*/,
				'class': 'pyIdentifier'
			},
			{
				'token': 'string',
				'regex': /('[^']*'|"[^"]*"|'''.*?'''|""".*?""")/,
				'class': 'pyString'
			},
			{
				'token': 'integer',
				'regex': /(?:0[xX][0-9a-fA-F]+|0[oO]?[0-7]+|0[bB][01]+|\d+)/,
				'class': 'pyInteger'
			},
			{
				'token': 'float',
				'regex': /(?:\b|-)(\d+\.\d+|\.\d+|\d+\.\d*[eE][+-]?\d+|\d+[eE][+-]?\d+)\b/,
				'class': 'pyFloat'
			},
			{
				'token': 'complex',
				'regex': /-?\b\d+(?:\.\d*)?(?:[eE][-+]?\d+)?(?:[+-]\d+(?:\.\d*)?(?:[eE][-+]?\d+)?)?[jJ]\b/,
				'class': 'pyComplex'
			},
			{
				'token': 'byte',
				'regex': /b['"]([^'"]*)['"]/,
				'class': 'pyByte'
			},
			{
				'token': 'byteArray',
				'regex': /bytearray\(([^)]*)\)/,
				'class': 'pyByteArray'
			},
			{
				'token': 'boolean',
				'regex': /\b(?:True|False)\b/,
				'class': 'pyBoolean'
			},
			{
				'token': 'none',
				'regex': /\b(?:None)\b/,
				'class': 'pyNone'
			},
			{
				'token': 'whitespace',
				'regex': /\s+/
			},
			{
				'token': 'regex',
				'class': 'pyRegex',
				'regex': /\/(?![\/\*]).*?\//
			},
			{
				'token': 'comment',
				'class': 'pyComment',
				'regex': /#.*|(['"]{3}[\s\S]*?['"]{3})/
			},
			{
				'token': 'others',
				'regex': 'remaining',
				'class': 'pyRemaining'
			}

		]
	});
});

