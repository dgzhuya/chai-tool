export interface Point {
	x: number
	y: number
}

export interface TapStep {
	name: string
	date?: string
	points: Point[]
}
