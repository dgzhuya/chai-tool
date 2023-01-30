interface DeviceWM {
	height: number
	width: number
}

export interface DeviceType {
	id: string
	name: string
	wm?: DeviceWM
	label?: string
}
