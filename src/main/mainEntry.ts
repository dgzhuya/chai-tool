import { startAdbServer } from '@/adb/status'
import { getResourcePath } from '@/utils/system'
import { app, BrowserWindow, Menu, protocol } from 'electron'
import path from 'path'
import { CustomScheme } from './CustomScheme'

let mainWindow: BrowserWindow

let resourcePath = ''

app.whenReady().then(() => {
	if (!resourcePath) resourcePath = getResourcePath()
	Menu.setApplicationMenu(null)
	startAdbServer()
	protocol.registerFileProtocol('atom', (request, callback) => {
		const url = request.url.slice(8)
		callback(decodeURI(path.normalize(path.resolve(resourcePath, url))))
	})
	mainWindow = new BrowserWindow({
		show: false,
		width: 900,
		height: 660,
		webPreferences: {
			nodeIntegration: true,
			webSecurity: true,
			allowRunningInsecureContent: false,
			contextIsolation: false,
			webviewTag: true,
			spellcheck: false,
			disableHtmlFullscreenWindowResize: true
		}
	})
	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})
	if (process.argv[2]) {
		mainWindow.loadURL(process.argv[2])
	} else {
		CustomScheme.registerScheme()
		mainWindow.loadURL('app://index.html')
	}
})
