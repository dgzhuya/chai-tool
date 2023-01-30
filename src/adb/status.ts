import { DeviceType } from '@/types/devices'
import { logCommandCatch } from '@/utils/catchUtil'
import { execAdbCommand, execAdbShellById } from '@/utils/command'

/**
 * 启动adb server
 * @returns
 */
export const startAdbServer = () => logCommandCatch(execAdbCommand, 'start-server')

/**
 * 检查Adb设备
 * @returns
 */
export const getAdbDevices = async () => {
	try {
		const result = await execAdbCommand('devices -l')
		const devicesList = result.split('\n')
		const deviceResult = devicesList
			.slice(1, devicesList.length - 2)
			.filter(e => !e.includes('unauthorized'))
			.map(ele => {
				const eleRes = ele.split(' ').filter(i => i !== '')
				return {
					id: eleRes[0],
					name: eleRes.filter(r => r.startsWith('model:'))[0]?.replace('model:', '')
				}
			})
		return await Promise.all(deviceResult.map(getDeviceWm))
	} catch (error) {
		console.log('error: ', error)
	}
	return []
}

const getDeviceWm = async (device: DeviceType) => {
	try {
		const [, , wmSzie] = (await execAdbShellById(device.id, 'wm size')).split(' ')
		const [width, height] = wmSzie.split('x')
		return {
			...device,
			wm: {
				width: parseInt(width),
				height: parseInt(height)
			},
			label: `${device.name}(${width}x${height})`
		}
	} catch (error) {
		console.log('error: ', error)
	}
	return device
}
