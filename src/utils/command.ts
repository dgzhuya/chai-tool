import childProcess from 'child_process'
import os from 'os'
import { getAdbExec } from './system'

const iconv = require('iconv-lite')

const binaryEncoding = 'binary'
const defaultCwd = process.cwd()
const encoding = os.platform() === 'win32' ? 'cp936' : 'utf-8'

/**
 * 执行系统命令
 * @param command 需要执行的系统命令
 * @param cwd 执行命令的目录(默认为项目目录)
 */
export const execCommand = (command: string, cwd = defaultCwd) => {
	return new Promise<string>((resolve, reject) => {
		childProcess.exec(command, { encoding: binaryEncoding, cwd }, (error, stdout) => {
			if (error) {
				reject(iconv.decode(Buffer.from(error.message, binaryEncoding), encoding))
			} else {
				resolve(iconv.decode(Buffer.from(stdout, binaryEncoding), encoding))
			}
		})
	})
}

/**
 * 执行adb命令
 * @param command adb命令
 */
export const execAdbCommand = async (command: string) => execCommand(`${await getAdbExec()} ${command}`)

/**
 * 执行adb的shell命令
 * @param command shell命令
 */
export const execAdbShell = async (command: string) => execCommand(`${await getAdbExec()} shell ${command}`)

/**
 * 执行某个设备adb命令
 * @param command adb命令
 */
export const execAdbCommandById = async (id: string, command: string) =>
	execCommand(`${await getAdbExec()} -s ${id} ${command}`)

/**
 * 执行某个设备adb的shell命令
 * @param command shell命令
 */
export const execAdbShellById = async (id: string, command: string) =>
	execCommand(`${await getAdbExec()} -s ${id} shell ${command}`)
