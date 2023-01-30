import os from 'os'
import { execCommand } from '@/utils/command'
import path from 'path'

/**
 * 当前电脑环境是否为win
 * @returns boolean
 */
export const isWin = () => os.platform() === 'win32'
/**
 * 当前电脑环境是否为mac
 * @returns boolean
 */
export const isMac = () => os.platform() === 'darwin'

/**
 * 获取adb执行文件位置
 * @returns string
 */
console.log('process.argv: ', process.argv)
export const getExecPath = () =>
	isWin()
		? 'resources\\win\\adb.exe'
		: isMac()
		? process.argv.length !== 3
			? path.resolve(__dirname, '../../adb')
			: 'resources/mac/adb'
		: 'resources/linux/adb'

// adb状态
let adbStatus: boolean | undefined

/**
 * 检查电脑是否自带adb环境
 * @returns boolean
 */
export const checkADBEnv = async () => {
	if (adbStatus === undefined) {
		try {
			await execCommand('adb version')
			adbStatus = true
		} catch (error) {
			console.log('error: ', error)
			adbStatus = false
		}
	}
	return adbStatus
}

/**
 * 获取adb执行命令地址
 * @returns
 */
export const getAdbExec = async () => ((await checkADBEnv()) ? 'adb' : getExecPath())
