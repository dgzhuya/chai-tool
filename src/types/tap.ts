export interface Point {
	x: number
	y: number
	isVertical?: boolean
}

export interface TapStep {
	name: string
	date?: string
	points: Point[]
}

