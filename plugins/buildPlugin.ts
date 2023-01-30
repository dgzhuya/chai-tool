import { Plugin } from 'vite'
import { buildSync } from 'esbuild'
import path from 'path'
import fs from 'fs'
import { build } from 'electron-builder'
import { isMac } from './system'

class BuildObj {
	buildMain() {
		buildSync({
			entryPoints: ['./src/main/mainEntry.ts'],
			bundle: true,
			platform: 'node',
			minify: true,
			outfile: './dist/mainEntry.js',
			external: ['electron']
		})
	}
	preparePackageJson() {
		const pkgJsonPath = path.join(process.cwd(), 'package.json')
		const localPkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
		const electronConfig = localPkgJson.devDependencies.electron.replace('^', '')
		localPkgJson.main = 'mainEntry.js'
		delete localPkgJson.scripts
		delete localPkgJson.devDependencies
		localPkgJson.devDependencies = { electron: electronConfig }
		const tarJsonPath = path.join(process.cwd(), 'dist', 'package.json')
		fs.writeFileSync(tarJsonPath, JSON.stringify(localPkgJson))
		fs.mkdirSync(path.join(process.cwd(), 'dist/node_modules'))
	}
	buildInstaller() {
		return build({
			projectDir: process.cwd(),
			config: {
				extraFiles: [isMac() ? 'resources/mac/' : 'resources/win/'],
				win: {
					target: [
						{
							target: 'nsis',
							arch: ['x64']
						}
					]
				},
				directories: {
					output: path.join(process.cwd(), 'release'),
					app: path.join(process.cwd(), 'dist')
				},
				files: ['**'],
				extends: null,
				productName: 'chai-tool',
				appId: 'com.dgzhuya.chai_tool',
				asar: true,
				nsis: {
					oneClick: false,
					perMachine: false,
					allowToChangeInstallationDirectory: false,
					createDesktopShortcut: true,
					createStartMenuShortcut: true,
					shortcutName: 'chai-tool',
					installerLanguages: ['zh_CN']
				}
			}
		})
	}
}

export default function buildPlugin(): Plugin {
	return {
		name: 'build-plugin',
		closeBundle() {
			const build = new BuildObj()
			build.buildMain()
			build.preparePackageJson()
			build.buildInstaller()
		}
	}
}
