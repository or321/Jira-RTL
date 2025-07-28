import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/scripts/main.js'),
				popup: resolve(__dirname, 'popup.html'),
			},
			output: {
				entryFileNames: chunk => {
					return chunk.name === 'main' ? 'main.js' : 'assets/[name].[hash].js';
				}
			}
		},
		outDir: 'dist',
		emptyOutDir: true,
		target: 'es2020'
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{
					src: 'manifest.json',
					dest: '.'
				}
			]
		})
	]
});