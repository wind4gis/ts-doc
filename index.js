#!/usr/bin/env node
/*
 * @Date: 2020-05-07 11:44:27
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-16 22:34:29
 * @Description:
 */
const commander = require("commander");
const buildApiInfo = require("./pupp/grab");
const fs = require("fs");
const path = require("path");
const EventBus = require("eventbusjs");
const typeTemplate = require("./template/type");
const indexTemplate = require("./template/index");
const spinnerFactory = require("./utils/spinner");

const cmdList = ["init", "add", "config"];
const pkg = require("./package.json");
commander.version(pkg.version).description("根据api接口自动推导ts接口文档");
commander.option("-f --force", "强制执行，覆盖当前已存在的文件");
commander.parse(process.argv);

let errors = [];
const [cmd, url] = commander.args;
let configFilePath = "";
const curFolder = process.cwd();

if (!cmdList.includes(cmd)) {
	errors.push("请输入该工具支持的方法");
}

if (["init", "add"].includes(cmd) && !/^https?:\/\//.test(url)) {
	errors.push("请输入正确的url地址");
}

if (cmd !== "config" && !fs.existsSync(path.join(__dirname, "config", "tsdoc-config.js"))) {
	errors.push("请执行tsdoc config方法初始化对应的配置文件");
}

if (cmd === "config") {
	// 支持config文件的相对路径和绝对路径识别
	configFilePath = url[0] === "." ? path.join(curFolder, url) : url;
	if (!fs.existsSync(configFilePath)) {
		if (fs.existsSync(path.join(curFolder, url))) {
			configFilePath = path.join(curFolder, url);
		} else {
			errors.push("请指定有效的配置文件");
		}
	}
}

if (errors.length) {
	spinnerFactory.fail(errors.join(";\n"));
	return spinnerFactory.stop();
}

/**
 * @name: 通过事件监听响应机制，抓取url对应的api文档上的接口信息，构建apiInfo、requestProps和responseProps信息
 */
const initFn = async (commander, url) => {
	const idxfilePath = path.resolve(curFolder, "index.ts");
	const typefilePath = path.resolve(curFolder, "type.ts");
	const fileExists =
		fs.existsSync(path.resolve(curFolder, "index.ts")) || fs.existsSync(path.resolve(curFolder, "type.ts"));
	if (fileExists) {
		if (!commander.force) {
			return spinnerFactory.fail("已经存在重命名的文件");
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
 * @name: 通过事件监听响应机制，抓取url对应的api文档上的接口信息，构建apiInfo、requestProps和responseProps信息
 */
const addFn = async (commander, url) => {
	const idxfilePath = path.resolve(curFolder, "index.ts");
	const typefilePath = path.resolve(curFolder, "type.ts");
	const fileExists = fs.existsSync(idxfilePath) && fs.existsSync(typefilePath);
	if (!fileExists) {
		return spinnerFactory.fail("不存在对应的文件");
	}
	spinnerFactory.showLoading({ text: "开始抓取文档数据" });
	await buildApiInfo(url);
	spinnerFactory.succeed("抓取文档结束");
	// 事件机制，监听爬虫抓取结果
	EventBus.addEventListener("apiInfo", async ({ type }, { apiInfo, requestProps, responseProps }) => {
		spinnerFactory.showLoading({ text: "开始构建ts文档" });
		const requestInfo = await typeTemplate.addApi(typefilePath, { apiInfo, requestProps, responseProps });
		await indexTemplate.addApi(idxfilePath, { apiInfo, requestInfo });
		spinnerFactory.succeed("构建ts文档结束");
		spinnerFactory.stop();
	});
};

const initConfig = async (commander, url) => {
	spinnerFactory.showLoading({ text: "初始化配置文件" });
	if (!fs.existsSync(path.join(__dirname, "config"))) {
		fs.mkdirSync("config");
	}
	fs.copyFile(
		configFilePath,
		path.join(__dirname, "config", "tsdoc-config.js"),
		(error) => error && spinnerFactory.fail(error.message)
	);
	spinnerFactory.succeed("构建配置文件结束");
	spinnerFactory.stop();
};

const cmdCallback = { init: initFn, add: addFn, config: initConfig };
const fn = cmdCallback[cmd] || (() => null);
fn(commander, url);
