import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import devPlugin, { getReplacer } from './plugins/devPlugin'
import buildPlugin from './plugins/buildPlugin'
import { resolve } from 'path'
import optimizer from 'vite-plugin-optimizer'

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, 'src')
		}
	},
	plugins: [optimizer(getReplacer()), vue(), devPlugin(), buildPlugin()]
})
