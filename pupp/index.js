#!/usr/bin/env node
/*
 * @Date: 2020-05-07 11:44:27
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-05-07 18:35:46
 * @Description:
 */
const commander = require("commander");
const chalk = require("chalk");
const buildApiInfo = require("./grab");
const fs = require("fs");
const path = require("path");
const typeTemplate = require("../template/type");

const cmdList = ["init", "add"];
const pkg = require("../package.json");
commander.version(pkg.version).description("根据peck接口自动推导ts接口");
commander.option("-f --force", "强制执行，覆盖当前已存在的文件");
commander.parse(process.argv);

let errors = [];
const [cmd, url] = commander.args;
if (!cmdList.includes(cmd)) {
  errors.push("请输入该工具支持的方法");
}

if (!/^https?:\/\//.test(url)) {
  errors.push("请输入正确的url地址");
}

if (errors.length) {
  console.error(chalk.red(errors.join(";\n")));
  return;
}
const curFolder = process.cwd();

const initFn = async (commander, url) => {
  const fileExists =
    fs.existsSync(path.resolve(curFolder, "index.ts")) ||
    fs.existsSync(path.resolve(curFolder, "type.ts"));
  if (fileExists && !commander.force) {
    return console.error(chalk.red("已经存在重命名的文件"));
  }
  const { apiInfo, requestProps, responseProps } = await buildApiInfo(url);
  fs.writeFile(
    path.resolve(curFolder, "type.ts"),
    typeTemplate({ apiInfo, requestProps, responseProps }),
    (err) => {
      err && console.error(chalk.red(err));
    }
  );
};

const cmdCallback = { init: initFn };
const fn = cmdCallback[cmd] || (() => {})
fn(commander, url)

