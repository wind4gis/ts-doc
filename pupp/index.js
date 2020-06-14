#!/usr/bin/env node
/*
 * @Date: 2020-05-07 11:44:27
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-14 15:56:41
 * @Description:
 */
const commander = require("commander");
const chalk = require("chalk");
const ora = require("ora");
const buildApiInfo = require("./grab");
const fs = require("fs");
const path = require("path");
const EventBus = require("eventbusjs");
const typeTemplate = require("../template/type");
const indexTemplate = require("../template/index");
const spinnerFactory = require("../utils/spinner");

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
	const idxfilePath = path.resolve(curFolder, "index.ts");
	const typefilePath = path.resolve(curFolder, "type.ts");
	const fileExists =
		fs.existsSync(path.resolve(curFolder, "index.ts")) || fs.existsSync(path.resolve(curFolder, "type.ts"));
	if (fileExists) {
		if (!commander.force) {
			return console.error(chalk.red("已经存在重命名的文件"));
		}
	}
	spinnerFactory.showLoading({ text: "开始抓取文档数据", color: "yellow" });
	await buildApiInfo(url);
	spinnerFactory.succeed("抓取文档结束");
	// 事件机制，监听爬虫抓取结果
	EventBus.addEventListener("apiInfo", async ({ type }, { apiInfo, requestProps, responseProps }) => {
		spinnerFactory.showLoading({ text: "开始构建ts文档", color: "green" });
		const requestInfo = await typeTemplate.initApi(typefilePath, { apiInfo, requestProps, responseProps });
		await indexTemplate.initApi(idxfilePath, { apiInfo, requestInfo });
		spinnerFactory.succeed("构建ts文档结束");
		spinnerFactory.stop();
	});
};

/**
 * @name: 通过事件监听响应机制，抓取url对应的peck文档上的接口信息，构建apiInfo、requestProps和responseProps信息
 *
 */
const addFn = async (commander, url) => {
	const idxfilePath = path.resolve(curFolder, "index.ts");
	const typefilePath = path.resolve(curFolder, "type.ts");
	const fileExists = fs.existsSync(idxfilePath) && fs.existsSync(typefilePath);
	if (!fileExists) {
		return console.error(chalk.red("不存在对应的文件"));
	}
	spinnerFactory.showLoading({ text: "开始抓取文档数据", color: "yellow" });
	await buildApiInfo(url);
	spinnerFactory.succeed("抓取文档结束");
	// 事件机制，监听爬虫抓取结果
	EventBus.addEventListener("apiInfo", async ({ type }, { apiInfo, requestProps, responseProps }) => {
		spinnerFactory.showLoading({ text: "开始构建ts文档", color: "green" });
		const requestInfo = await typeTemplate.addApi(typefilePath, { apiInfo, requestProps, responseProps });
		await indexTemplate.addApi(idxfilePath, { apiInfo, requestInfo });
		spinnerFactory.succeed("构建ts文档结束");
		spinnerFactory.stop();
	});
};

const cmdCallback = { init: initFn, add: addFn };
const fn = cmdCallback[cmd] || (() => null);
fn(commander, url);
