import { getScreenImg } from '@/adb/image'
import { ElLoading, ElMessage } from 'element-plus'
import { ref, computed, watchEffect } from 'vue'
import { activeDeviceId } from './devices'

export const imgUrl = ref<string>('')

export default function getImageInfo(defaultSvg: string) {
	let timmer: NodeJS.Timeout | undefined

	const showImgUrl = computed(() => imgUrl.value || defaultSvg)

	const refreshImg = async () => {
		if (!activeDeviceId.value) {
			ElMessage.error('请接入设备')
			return
		}
		const loading = ElLoading.service({
			lock: true,
			text: '加载图片...',
			background: 'rgba(0, 0, 0, 0.7)'
		})
		imgUrl.value = await getScreenImg(activeDeviceId.value)
		loading.close()
	}

	watchEffect(() => {
		if (activeDeviceId.value.length > 0) {
			if (timmer) clearTimeout(timmer)
			timmer = setTimeout(refreshImg, 20)
		}
	})

	return {
		showImgUrl,
		imgUrl,
		refreshImg
	}
}
