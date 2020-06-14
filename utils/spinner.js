/*
 * @Date: 2020-06-13 14:37:38
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-14 23:27:55
 * @Description: 在命令行展示loading的spinner
 */
const ora = require("ora");
const chalk = require("chalk");

class SpinnerFactory {
	static _spinner = null;
	static getInstance() {
		if (!SpinnerFactory._spinner) {
			SpinnerFactory._spinner = ora({ text: "程序开始运行", color: "white" }).start();
		}
		if (!SpinnerFactory._spinner.isSpinning) {
			SpinnerFactory._spinner.start();
		}
		return SpinnerFactory._spinner;
	}
	static showLoading = ({ text }) => {
		SpinnerFactory.getInstance().color = "yellow";
		SpinnerFactory.getInstance().text = chalk.yellow(text);
	};
	static succeed = (text = "") => {
		SpinnerFactory.getInstance().succeed(chalk.green(text));
	};
	static fail = (text = "") => {
		SpinnerFactory.getInstance().fail(chalk.red(text));
	};
	static stop = () => {
		if (SpinnerFactory._spinner) {
			SpinnerFactory._spinner.stop();
		}
		SpinnerFactory._spinner = null;
	};
}

module.exports = SpinnerFactory;
