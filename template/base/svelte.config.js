import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-auto';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess:vitePreprocess(),		
	alias: {
			$global: path.resolve('./src/lib/global'),
			$client: path.resolve('./src/lib/client'),
			$server: path.resolve('./src/lib/server'),
			$assets: path.resolve('./src/lib/assets')
		},
	kit: {
		env: {
			dir: './'
		},
		adapter:adapter(),
	}	
};

export default config;
