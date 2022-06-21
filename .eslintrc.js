module.exports = {
	root: true,
	parserOptions: { 
		ecmaVersion: 6,
		sourceType: 'module'
	},
	env: {
		es2016: true,
		browser: true
	},
    extends: [
		'eslint:recommended'
	],
	parser: "babel-eslint",
	rules: {}
}
