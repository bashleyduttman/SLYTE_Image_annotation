(function (factory) {
	if (typeof define === "function" && define.amd) {
		define(["@zoho/lyte-dom"], factory);
	}
	else {
		factory($L);
	}
})(
	function ($L) {
		$L.snippets.registerLanguage('json', {
			tokenConfig: [
				{
					'token': 'punctuation',
					'regex': /({|}|\[|\]|:|,)/,
					'class': 'lyteJSONPunctuation'
				},
				{
					'token': 'literal',
					// 'regex': /(?<stringStart>["]).*?(?<!\\)(\\\\)*\k<stringStart>/,
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
					'regex': /(['"])(.*?(?:(?:\\\\)*(\\\\)*)*)\1/, 'class': 'lyteJSONLiteral'
				},
				{
					'token': 'null',
					'regex': /null/,
					'class': 'lyteJSONNull'
				},
				{
					'token': 'boolean',
					'regex': /(?:true|false)/,
					'class': 'lyteJSONBoolean'
				},
				{
					'token': 'number',
					'regex': /[0-9]+(\.[0-9]+)?/,
					'class': 'lyteJSONNumber'
				}
			]
		});
	}
);