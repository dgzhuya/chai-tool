import { getAdbDevices } from '@/adb/status'
import { computed, ref } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import { DeviceType } from '@/types/devices'

export const deviceList = ref<DeviceType[]>([])
export const activeDeviceId = ref('')
export const activeDevice = computed(() => deviceList.value.find(i => i.id === activeDeviceId.value))

export default function devices() {
	const noDeviceHandler = () => {
		if (!activeDeviceId.value) {
			ElMessage.error('请接入设备')
			return true
		}
		return false
	}

	const checkAdbDevices = async (isLoading = false) => {
		let loading
		if (isLoading) {
			loading = ElLoading.service({
				lock: true,
				text: '加载设备...',
				background: 'rgba(0, 0, 0, 0.7)'
			})
		}
		deviceList.value = await getAdbDevices()
		if (deviceList.value.length > 0) {
			if (deviceList.value.map(i => i.id).indexOf(activeDeviceId.value) === -1) {
				activeDeviceId.value = deviceList.value[0].id
			}
		} else {
			activeDeviceId.value = ''
		}
		loading && loading.close()
	}
	return {
		checkAdbDevices,
		noDeviceHandler
	}
}
