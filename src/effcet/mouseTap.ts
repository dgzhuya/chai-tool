import { TapStep, Point } from '@/types/tap'
import { computed, ref, watchEffect } from 'vue'
import { activeDeviceId } from '@/effcet/devices'
import { imgUrl } from '@/effcet/screen'

export default function mouseTap() {
	const mousePoint = ref<Point>({ x: 0, y: 0 })
	const showMousePoint = ref<boolean>(false)
	const mousePointY = computed(() => mousePoint.value.y + '%')
	const mousePointX = computed(() => mousePoint.value.x + '%')

	const currentStep = ref<TapStep>({ name: '', points: [] })

	watchEffect(() => {
		if (activeDeviceId.value.length > 0) {
			showMousePoint.value = false
			currentStep.value = { name: '', points: [] }
		}
	})
	watchEffect(() => {
		if (imgUrl.value.length > 0) {
			showMousePoint.value = false
		}
	})

	const mousePointHandler = (event: MouseEvent) => {
		const { width, height } = event.currentTarget as HTMLImageElement
		mousePoint.value = {
			x: (event.offsetX * 100) / width,
			y: (event.offsetY * 100) / height
		}
		showMousePoint.value = true
	}

	return {
		mousePoint,
		mousePointX,
		mousePointY,
		showMousePoint,
		currentStep,
		mousePointHandler
	}
}
