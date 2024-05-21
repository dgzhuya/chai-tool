import { tapHandler } from '@/adb/operate'
import { Point } from '@/types/tap'
import { ElMessage } from 'element-plus'
import { activeDevice } from '@/effcet/devices'
import { ref } from 'vue'
import { sleepTime } from '@/utils/sleepTime'

export default function run() {
	const stepSleep = ref(1)
	const recordSleep = ref(1)
	const runTime = ref(5)
	const curTime = ref(0)
	const isRun = ref(false)
	const stopRun = ref(false)

	const runTapHandler = async (mousePoint: Point) => {
		if (!activeDevice.value || !activeDevice.value.wm) {
			ElMessage.error('请接入设备')
			return
		}
		const { id, wm } = activeDevice.value
		const x = mousePoint.isVertical ? (wm.height * (100 - mousePoint.y)) / 100 : (wm.width * mousePoint.x) / 100
		const y = mousePoint.isVertical ? (wm.width * (100 - mousePoint.x)) / 100 : (wm.height * mousePoint.y) / 100
		tapHandler(id, { x, y })
	}

	const execStepsHandler = async (points: Point[]) => {
		isRun.value = true
		while (curTime.value < runTime.value) {
			for (let i = 0; i < points.length; i++) {
				await runTapHandler(points[i])
				if (stopRun.value) break
				await sleepTime(stepSleep.value)
			}
			if (stopRun.value) {
				stopRun.value = false
				break
			}
			curTime.value++
			await sleepTime(recordSleep.value)
		}
		isRun.value = false
		curTime.value = 0
	}

	return { isRun, stopRun, stepSleep, recordSleep, runTime, curTime, runTapHandler, execStepsHandler }
}
