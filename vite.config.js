import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { createHtmlPlugin } from 'vite-plugin-html';
import path from 'path';
import fs from 'fs';

const contentConfig = {
	build: {
		outDir: 'dist',
		emptyOutDir: true, // only the first build empties the output folder
		target: 'es2020',
		rollupOptions: {
			input: resolve(__dirname, 'src/scripts/main.js'),
			output: {
				inlineDynamicImports: true,
				entryFileNames: 'assets/jira-rtl.js',
				assetFileNames: assetInfo => {
					if (assetInfo.name && assetInfo.name.endsWith('.css')) {
						return 'assets/jira-rtl.css';
					}
					return 'assets/[name].[hash][extname]';
				},
			},
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: 'manifest.json', dest: '.' },
				{ src: 'node_modules/webextension-polyfill/dist/browser-polyfill.min.js', dest: 'assets' },
			],
		}),
	],
};

const popupConfig = {
	build: {
		outDir: 'dist',
		emptyOutDir: false, // The output folder is already emptied in the first config
		target: 'es2020',
		rollupOptions: {
			input: resolve(__dirname, 'src/popup/popup.html'),
			output: {
				entryFileNames: 'assets/[name].js',
				chunkFileNames: 'assets/[name].js',
				assetFileNames: 'assets/[name][extname]',
			},
		},
	},
	plugins: [
		viteStaticCopy({
			targets: [
				{ src: 'src/popup/popup.html', dest: '.' },
			],
		}),
		createHtmlPlugin({
			pages: [
				{
					filename: 'popup.html',
					template: 'src/popup/popup.html'
				},
			],
		}),
		{
			name: 'remove-dist-src-folder',
			// closeBundle hook: Runs after Vite finished everything
			closeBundle: () => {
				const folder = path.resolve(__dirname, 'dist/src');
				if (fs.existsSync(folder)) {
					fs.rmSync(folder, { recursive: true, force: true });
				}
			},
		},
	],
};

// Apply mode with: "vite build --mode {parameter}"
export default defineConfig(({ mode }) => {
	if (mode === 'content') return contentConfig;
	if (mode === 'popup') return popupConfig;

	return contentConfig;
});
