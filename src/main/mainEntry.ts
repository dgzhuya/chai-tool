import { startAdbServer } from '@/adb/status'
import { app, BrowserWindow, Menu, protocol } from 'electron'
import path from 'path'
import { CustomScheme } from './CustomScheme'

let mainWindow: BrowserWindow

app.whenReady().then(() => {
	Menu.setApplicationMenu(null)
	startAdbServer()
	protocol.registerFileProtocol('atom', (request, callback) => {
		const url = request.url.slice(7 - 1)
		callback(decodeURI(path.normalize(`${process.cwd()}/resources/${url}`)))
	})
	mainWindow = new BrowserWindow({
		show: false,
		width: 1500,
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
		mainWindow.webContents.openDevTools({ mode: 'right' })
	} else {
		CustomScheme.registerScheme()
		mainWindow.loadURL('app://index.html')
	}
})