import { execAdbCommandById, execAdbShellById } from '@/utils/command'
import { getResourcePath } from '@/utils/system'
import fs from 'fs'
import path from 'path'

let fileDirPath = ''

export const getScreenImg = async (id: string, fileName = `screenshot_${new Date().getTime()}.png`) => {
	if (!fileDirPath) fileDirPath = getResourcePath()
	try {
		await execAdbShellById(id, `/system/bin/screencap -p /sdcard/${fileName}`)
		await execAdbCommandById(id, `pull /sdcard/${fileName} ${fileDirPath}/${fileName}`)
		execAdbShellById(id, `rm /sdcard/${fileName}`)
		deletePreFile(id)
		localStorage.setItem(`${id}_img`, fileName)
		return `atom:///${fileName}`
	} catch (error) {
		console.log('error: ', error)
	}
	return ''
}

const deletePreFile = (id: string) => {
	const preFile = localStorage.getItem(`${id}_img`)
	if (preFile) fs.rm(path.resolve(fileDirPath, preFile), error => error && console.log(error.message))
}
