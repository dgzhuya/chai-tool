import { execAdbShellById } from '@/utils/command'
import { Point } from '@/types/tap'

export const tapHandler = (id: string, postion: Point) => execAdbShellById(id, `input tap ${postion.x} ${postion.y}`)
