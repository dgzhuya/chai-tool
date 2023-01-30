import os from 'os'
import path from 'path'
import { execAdbCommandById, execAdbShellById } from '@/utils/command'
import fs from 'fs'

const fileDirPath =
	os.platform() === 'darwin' && process.env.NODE_ENV !== 'development'
		? path.resolve(__dirname, '../../')
		: path.resolve(process.cwd(), 'resources')

export const getScreenImg = async (id: string, fileName = `screenshot_${new Date().getTime()}.png`) => {
	try {
		await execAdbShellById(id, `/system/bin/screencap -p /sdcard/${fileName}`)
		await execAdbCommandById(id, `pull /sdcard/${fileName} ${fileDirPath}/${fileName}`)
		execAdbShellById(id, `rm /sdcard/${fileName}`)
		const filePath = `${fileDirPath}/${fileName}`
		if (fs.existsSync(filePath)) {
			const base64 = fs.readFileSync(filePath).toString('base64')
			fs.rm(filePath, err => err && console.log(err.message))
			return `data:image/png;base64,${base64}`
		}
	} catch (error) {
		console.log('error: ', error)
	}
	return ''
}
