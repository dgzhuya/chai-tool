import { execAdbShellById } from '@/utils/command'
import { Point } from '@/types/tap'

export const tapHandler = (id: string, postion: Point) => {
	const endPosX = postion.x + Math.random() * 5
	const endPosY = postion.y + Math.random() * 5
	execAdbShellById(id, `input swipe ${postion.x} ${postion.y} ${endPosX} ${endPosY} 500`)
}
