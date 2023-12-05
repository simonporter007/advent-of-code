import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['./src/index.ts'],
	format: ['esm', 'cjs'],
	target: 'esnext',
	tsconfig: 'tsconfig.json',
	loader: {
		'.js': 'jsx',
	},
	dts: true,
	external: ['react', 'react-dom'],
	minify: false,
	splitting: false,
	clean: true,
})
