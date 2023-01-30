export const sleepTime = (time: number = 1) => new Promise(resolve => setTimeout(resolve, time * 1000))
