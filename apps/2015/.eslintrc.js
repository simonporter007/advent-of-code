module.exports = {
	root: true,
	extends: ['@simonporter007/eslint-config'],
	overrides: [
		{
			files: ['*.ts', '*.tsx', '*.js'], // Your TypeScript files extension
			parserOptions: {
				project: ['./tsconfig.json'],
				tsconfigRootDir: __dirname,
			},
		},
	],
}
