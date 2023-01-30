import { ViteDevServer, Plugin } from 'vite'
import { buildSync } from 'esbuild'
import { execSync, spawn, spawnSync } from 'child_process'
import { getExecPath } from './system'

export default function devPlugin(): Plugin {
	return {
		name: 'dev-plugin',
		configureServer(server: ViteDevServer) {
			buildSync({
				entryPoints: ['./src/main/mainEntry.ts'],
				bundle: true,
				platform: 'node',
				outfile: './dist/mainEntry.js',
				external: ['electron']
			})
			server.httpServer?.once('listening', () => {
				const addressInfo = server.httpServer?.address() as any
				const httpAddress = `http://localhost:${addressInfo.port}`
				const electronProcess = spawn(require('electron').toString(), ['./dist/mainEntry.js', httpAddress], {
					cwd: process.cwd(),
					stdio: 'inherit'
				})
				electronProcess.on('close', () => {
					execSync(`${getExecPath()} kill-server`, { cwd: process.cwd() })
					server.close()
					process.exit()
				})
			})
		}
	}
}

export const getReplacer = () => {
	const externalModels = ['os', 'fs', 'path', 'events', 'child_process', 'crypto', 'http', 'buffer', 'url']
	const result = {}
	for (const item of externalModels) {
		result[item] = () => ({
			find: new RegExp(`^${item}$`),
			code: `const ${item} = require('${item}');export { ${item} as default }`
		})
	}
	result['electron'] = () => {
		let electronModules = ['clipboard', 'ipcRenderer', 'nativeImage', 'shell', 'webFrame'].join(',')
		return {
			find: new RegExp(`^electron$`),
			code: `const {${electronModules}} = require('electron');export {${electronModules}}`
		}
	}
	return result
}
