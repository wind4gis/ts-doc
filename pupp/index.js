/*
 * @Date: 2020-05-07 11:44:27
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-05-07 15:11:44
 * @Description:
 */
const commander = require("commander");
const chalk = require("chalk");
const buildApiInfo = require("./grab");

const cmdList = ["init", "add"];
const pkg = require("../package.json");
commander.version(pkg.version).description("根据peck接口自动推导ts接口");
commander.option("-f --force", "强制执行，覆盖当前已存在的文件");
commander.parse(process.argv);

let errors = [];
const [cmd, url] = commander.args;
console.log(commander)
if (!cmdList.includes(cmd)) {
  errors.push("请输入该工具支持的方法");
}

if (!/^https?:\/\//.test(url)) {
  errors.push("请输入正确的url地址");
}

if (errors.length) {
  console.log(chalk.red(errors.join(";\n")));
  return
}

const initFn = (commander, url) => {

}

commander.command("init <url>").action(async (url, cmd) => {
  await buildApiInfo(url);
});