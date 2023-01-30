interface CommandFunc<T> {
	(command: string): Promise<T>
}

export const logCommandCatch = <T>(cmdFn: CommandFunc<T>, cmd: string) => cmdFn(cmd).catch(err => console.log(err))
