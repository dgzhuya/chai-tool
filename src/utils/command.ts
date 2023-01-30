import childProcess from 'child_process'
import os from 'os'
import { getAdbExec } from './system'

const { decode } = require('iconv-lite')

let adbExecPath = ''
const isWinSystem = os.platform() === 'win32'
const execEncoding = isWinSystem ? 'binary' : 'utf-8'
const defaultCwd = process.cwd()

/**
 * 执行系统命令
 * @param command 需要执行的系统命令
 * @param cwd 执行命令的目录(默认为项目目录)
 */
export const execCommand = (command: string, cwd = defaultCwd) => {
	return new Promise<string>((resolve, reject) => {
		childProcess.exec(command, { encoding: execEncoding, cwd }, (error, stdout) => {
			if (error) {
				reject(isWinSystem ? decode(Buffer.from(error.message, execEncoding), 'cp936') : error.message)
			} else {
				resolve(isWinSystem ? decode(Buffer.from(stdout, execEncoding), 'cp936') : stdout)
			}
		})
	})
}

/**
 * 执行adb命令
 * @param command adb命令
 */
export const execAdbCommand = async (command: string) => {
	if (!adbExecPath) adbExecPath = await getAdbExec()
	return execCommand(`${adbExecPath} ${command}`)
}

/**
 * 执行adb的shell命令
 * @param command shell命令
 */
export const execAdbShell = (command: string) => execAdbCommand(`shell ${command}`)

/**
 * 执行某个设备adb命令
 * @param command adb命令
 */
export const execAdbCommandById = async (id: string, command: string) => execAdbCommand(` -s ${id} ${command}`)

/**
 * 执行某个设备adb的shell命令
 * @param command shell命令
 */
export const execAdbShellById = (id: string, command: string) => execAdbCommandById(id, `shell ${command}`)
