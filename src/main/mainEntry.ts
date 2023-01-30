import { startAdbServer } from '@/adb/status'
import { app, BrowserWindow, Menu, protocol } from 'electron'
import { CustomScheme } from './CustomScheme'

let mainWindow: BrowserWindow

app.whenReady().then(() => {
	Menu.setApplicationMenu(null)
	startAdbServer()
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
