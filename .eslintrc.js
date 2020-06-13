module.exports = {
	env: {
		commonjs: true,
		es2020: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 11,
	},
	plugins: ["@typescript-eslint"],
	rules: {
		"@typescript-eslint/no-var-requires": 0
	},
};
