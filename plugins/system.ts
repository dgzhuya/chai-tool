import os from 'os'
const isWin = () => os.platform() === 'win32'
export const isMac = () => os.platform() === 'darwin'

export const getExecPath = () => (isWin() ? 'resources\\win\\adb.exe' : 'resources/mac/adb')
