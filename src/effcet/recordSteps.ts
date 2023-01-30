import { TapStep } from '@/types/tap'
import { dayjs, ElMessage, ElMessageBox } from 'element-plus'
import { ref, watchEffect } from 'vue'
import { activeDeviceId } from '@/effcet/devices'

export default function recordSteps() {
	const isRecordingStatus = ref<boolean>(false)
	const activeDeviceSteps = ref<TapStep[]>([])

	watchEffect(() => {
		if (activeDeviceId.value.length > 0) {
			isRecordingStatus.value = false
			activeDeviceSteps.value = JSON.parse(localStorage.getItem(activeDeviceId.value) || '[]')
		}
	})

	const saveCurStepHandler = (currentStep: TapStep) => {
		if (!currentStep.name) {
			ElMessage.error('请输入记录名称')
			return
		}
		activeDeviceSteps.value.push({
			...currentStep,
			date: dayjs().format('YYYY-MM-DD HH:mm:ss')
		})
		localStorage.setItem(activeDeviceId.value, JSON.stringify(activeDeviceSteps.value))
	}

	const deleteRecordHandler = (index: number) => {
		ElMessageBox.confirm(`是否要删除${activeDeviceSteps.value[index].name}?`, 'Warning', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning'
		})
			.then(() => {
				ElMessage({
					type: 'success',
					message: '删除成功'
				})
				activeDeviceSteps.value.splice(index, 1)
				localStorage.setItem(activeDeviceId.value, JSON.stringify(activeDeviceSteps.value))
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: `取消删除${activeDeviceSteps.value[index].name}`
				})
			})
	}

	return {
		isRecordingStatus,
		activeDeviceSteps,
		deleteRecordHandler,
		saveCurStepHandler
	}
}
