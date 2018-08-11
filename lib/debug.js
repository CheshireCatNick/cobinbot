'use strict'
/**
 * @description: colorful debug logger
 * @author: Nicky
 */
const operator = {
	reset: 		"\x1b[0m",
	bright: 	"\x1b[1m",
	dim: 		"\x1b[2m",
	underscore: "\x1b[4m",
	blink: 		"\x1b[5m",
	reverse: 	"\x1b[7m",
	hidden: 	"\x1b[8m"
};
const color = {
	fgBlack: 	"\x1b[30m",
	fgRed: 		"\x1b[31m",
	fgGreen: 	"\x1b[32m",
	fgYellow: 	"\x1b[33m",
	fgBlue: 	"\x1b[34m",
	fgMagenta: 	"\x1b[35m",
	fgCyan: 	"\x1b[36m",
	fgWhite: 	"\x1b[37m",

	bgBlack: 	"\x1b[40m",
	bgRed: 		"\x1b[41m",
	bgGreen: 	"\x1b[42m",
	bgYellow: 	"\x1b[43m",
	bgBlue: 	"\x1b[44m",
	bgMagenta: 	"\x1b[45m",
	bgCyan: 	"\x1b[46m",
	bgWhite: 	"\x1b[47m"
};
const lvl2Color = {
	info: 		operator.bright + color.fgBlue,
	warning: 	operator.bright + color.fgRed,
	success: 	operator.bright + color.fgGreen 
}
class Debug {
	static printMsg(color, msgArr){
		let msg = color;
		// add timestamp
		// always print +8 timezone
		const offset = 8;
		const now = new Date(new Date().getTime() + offset * 3600 * 1000)
										.toUTCString().replace(/ GMT$/, '');
		msg += "[" + now + "] ";
		for (let i = 0; i < msgArr.length - 1; i++)
			msg += "[" + msgArr[i] + "] ";
		msg += operator.reset + msgArr[msgArr.length - 1];
		console.log(msg);
	}
	static info(msgArr){
		this.printMsg(lvl2Color["info"], msgArr);
	}
	static warning(msgArr){
		this.printMsg(lvl2Color["warning"], msgArr);
	}
	static success(msgArr){
		this.printMsg(lvl2Color["success"], msgArr);
	}
}

module.exports = Debug;