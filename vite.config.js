import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'src/scripts/main.js'),
				popup: resolve(__dirname, 'popup.html')
			},
			output: {
				entryFileNames: chunk => {
					switch (chunk.name) {
						case "main":
							return "assets/jira-rtl.js";

						default:
							return "assets/[name].[hash].js";
					}
				},
				// 👇 Control CSS asset file names
				assetFileNames: assetInfo => {
					if (assetInfo.name === 'main.css') {
						return 'assets/jira-rtl.css';
					}
					return 'assets/[name].[hash][extname]';
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
				{ src: 'manifest.json', dest: '.' },
				{ src: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js', dest: 'assets' }
			]
		})
	]
});