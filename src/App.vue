<script setup lang="ts">
	import { ElButton, ElSelect, ElOption, ElInput, ElMessage, ElMessageBox, ElInputNumber } from 'element-plus'
	import { onMounted, ref } from 'vue'
	import defaultSvg from '@/assets/default.svg'
	import refreshSvg from '@/assets/refresh.svg'
	import runSvg from '@/assets/run.svg'
	import saveSvg from '@/assets/save.svg'
	import playSvg from '@/assets/play.svg'
	import closeSvg from '@/assets/close.svg'
	import deleteSvg from '@/assets/delete.svg'
	import useRecordSteps from '@/effcet/recordSteps'
	import useMouseTap from '@/effcet/mouseTap'
	import useDevices, { activeDeviceId, deviceList } from '@/effcet/devices'
	import useScreen from '@/effcet/screen'
	import useRun from '@/effcet/run'
	import { TapStep } from './types/tap'

	const currentStepName = ref<string>('')
	const { checkAdbDevices } = useDevices()
	const { showImgUrl, refreshImg } = useScreen(defaultSvg)
	const { isRun, stopRun, stepSleep, recordSleep, runTime, curTime, runTapHandler, execStepsHandler } = useRun()
	const { isRecordingStatus, activeDeviceSteps, saveCurStepHandler, deleteRecordHandler } = useRecordSteps()
	const { showMousePoint, mousePoint, currentStep, mousePointX, mousePointY, mousePointHandler } = useMouseTap()

	/**
	 * 点击左侧图片
	 * @param event 鼠标点击事件
	 */
	const tapScreenImg = (event: MouseEvent) => {
		if (isRecordingStatus.value) {
			mousePointHandler(event)
		}
	}

	/**
	 * 执行点击事件到设备
	 */
	const executeTouchPoint = async () => {
		if (mousePoint.value.x === 0 && mousePoint.value.y === 0) {
			ElMessage.warning({
				message: '请选择坐标位置',
				type: 'warning'
			})
			return
		}
		await runTapHandler(mousePoint.value)
		currentStep.value.points.push({ x: mousePoint.value.x, y: mousePoint.value.y })
		setTimeout(refreshImg, 300)
	}

	/**
	 * 保存记录
	 */
	const saveCurStep = () => {
		saveCurStepHandler(currentStep.value)
		clearCurStep()
	}

	/**
	 * 清除当前记录
	 */
	const clearCurStep = () => {
		showMousePoint.value = false
		currentStep.value = { name: '', points: [] }
		isRecordingStatus.value = false
	}

	/**
	 * 执行脚本
	 * @param points 点击触点
	 */
	const execSteps = (step: TapStep) => {
		if (isRecordingStatus.value) {
			ElMessage({
				message: '请保存当前步骤',
				type: 'warning'
			})
			return
		}
		currentStepName.value = step.name
		execStepsHandler(step.points)
	}

	/**
	 * 停止任务
	 */
	const stopCurTask = () => {
		ElMessageBox.confirm(`是否要停止${currentStepName.value}任务?`, 'Warning', {
			confirmButtonText: '确认',
			cancelButtonText: '取消',
			type: 'warning'
		}).then(() => {
			ElMessage({
				type: 'success',
				message: '取消成功'
			})
			stopRun.value = true
		})
	}

	onMounted(() => {
		checkAdbDevices(true)
	})
</script>

<template>
	<div v-if="isRun" @click="stopCurTask()" class="run-container">
		<div>执行{{ currentStepName }}任务</div>
		<div>执行进度{{ curTime }}/{{ runTime }}</div>
	</div>
	<div class="tool-container">
		<div style="font-size: 20px" class="show-screen">
			<div class="img-container">
				<img @click="tapScreenImg" :src="showImgUrl" alt="" />
				<div class="mouse-point" v-if="showMousePoint"></div>
			</div>
		</div>
		<div class="setting-container">
			<div class="setting-cell">
				<el-select
					v-model="activeDeviceId"
					style="width: 300px"
					class="m-2"
					placeholder="请选择设备"
					size="large"
				>
					<el-option
						v-for="item in deviceList"
						:key="item.id"
						:label="item.label || item.name"
						:value="item.id"
					/>
				</el-select>
				<el-button type="primary" size="large" @click="checkAdbDevices()">
					<img class="icon-img" :src="refreshSvg" alt="" />
					刷新设备
				</el-button>
				<el-button
					type="primary"
					style="margin-left: 10px; margin-bottom: 10px"
					size="large"
					@click="refreshImg"
				>
					<img class="icon-img" :src="refreshSvg" alt="" />
					刷新截图
				</el-button>
			</div>
			<template v-if="isRecordingStatus">
				<div class="setting-cell">
					<el-input
						size="large"
						class="w-50 m-2"
						v-model="currentStep.name"
						placeholder="请输入操作记录名称"
						clearable
					/>
					<el-button type="primary" style="margin-left: 10px" size="large" @click="saveCurStep()">
						<img class="icon-img" :src="saveSvg" alt="" />
						保存
					</el-button>
				</div>
				<div class="setting-cell">
					<el-button type="primary" size="large" @click="executeTouchPoint">
						<img class="icon-img" :src="runSvg" alt="" />
						点击执行下一步
					</el-button>
					<el-button type="primary" style="margin-left: 10px" size="large" @click="clearCurStep()">
						<img class="icon-img" :src="closeSvg" alt="" />
						取消记录
					</el-button>
				</div>
			</template>
			<div v-else class="setting-cell">
				<el-button type="primary" style="margin-left: 10px" size="large" @click="isRecordingStatus = true">
					<img class="icon-img" :src="runSvg" alt="" />
					开始录制
				</el-button>
			</div>
			<div class="setting-cell" style="justify-content: space-between">
				<div class="timer-setting">
					<el-input-number v-model="recordSleep" :min="1" :max="10" :step="1" />
					<div class="timer-setting-text">任务执行延迟(秒)</div>
				</div>
				<div class="timer-setting">
					<el-input-number v-model="stepSleep" :min="1" :max="10" :step="1" />
					<div class="timer-setting-text">单次点击延迟(秒)</div>
				</div>
				<div class="timer-setting">
					<el-input-number v-model="runTime" :min="1" :max="1000" :step="10" />
					<div class="timer-setting-text">执行次数</div>
				</div>
			</div>
			<div class="step-container">
				<div v-for="(step, index) in activeDeviceSteps" class="step-cell">
					<div class="step-info">
						<div class="step-name">{{ step.name }}</div>
						<div>{{ step.date }}</div>
					</div>
					<img @click="execSteps(step)" class="play-icon" :src="playSvg" alt="" />
					<img class="delete-icon" @click="deleteRecordHandler(index)" :src="deleteSvg" alt="" />
				</div>
			</div>
		</div>
	</div>
</template>
<style lang="scss" scoped>
	.run-container {
		position: fixed;
		width: 100vw;
		height: 100vh;
		top: 0;
		left: 0;
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 1000;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		div {
			color: #fff;

			&:first-child {
				font-size: 20px;
				margin-bottom: 20px;
			}
		}
	}
	.icon-img {
		width: 18px;
		height: 18px;
		margin-right: 5px;
	}
	.tool-container {
		display: flex;
		width: 100vw;
		height: 100vh;
		font-size: 18px;
		border-top: 1px solid rgba($color: #999, $alpha: 0.3);
		box-sizing: border-box;

		.show-screen {
			width: 40vw;
			display: flex;
			align-items: flex-start;
			box-sizing: border-box;
			justify-content: center;
			border-right: 1px solid rgba($color: #999, $alpha: 0.3);
			padding-top: 10px;
			background-color: rgba($color: rgb(234, 230, 230), $alpha: 0.3);

			.img-container {
				position: relative;
				display: inline-block;

				.mouse-point {
					position: absolute;
					width: 10px;
					height: 10px;
					top: calc(v-bind(mousePointY) - 5px);
					left: calc(v-bind(mousePointX) - 5px);
					border-radius: 50%;
					background-color: red;
				}
			}

			img {
				margin: 0 auto;
				width: 250px;
			}
		}
		.setting-container {
			width: 60vw;
			display: flex;
			align-items: center;
			flex-direction: column;
			box-sizing: border-box;
			padding: 10px 0;

			.setting-cell {
				display: flex;
				width: 100%;
				box-sizing: border-box;
				padding: 0 20px;
				justify-content: flex-start;
				margin-bottom: 10px;

				.timer-setting {
					font-size: 15px;
					font-weight: 500;
					text-align: center;

					.timer-setting-text {
						margin-top: 10px;
					}
				}
			}

			.step-container {
				margin-top: 20px;
				width: 100%;
				box-sizing: border-box;
				padding: 0 10px;
				max-height: 400px;
				overflow-y: auto;
				overflow-x: hidden;

				.step-cell {
					display: flex;
					background-color: rgb(238, 238, 247);
					line-height: 50px;
					margin-bottom: 20px;
					box-sizing: border-box;
					padding: 0 25px 0 10px;
					border-radius: 5px;
					justify-content: space-between;
					position: relative;

					.step-info {
						font-size: 14px;
						color: #666;
						display: flex;
						width: 80%;

						.step-name {
							margin-right: 10px;
							color: #333;
							font-size: 18px;
							font-weight: 500;
							max-width: 100px;
						}
					}

					.play-icon {
						width: 28px;
						height: 28px;
						margin: 12px 0px;
					}
					.delete-icon {
						position: absolute;
						width: 15px;
						height: 15px;
						right: 5px;
						top: 2px;
					}
				}
			}
		}
	}
</style>
