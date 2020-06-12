#!/usr/bin/env node
/*
 * @Date: 2020-05-07 11:44:27
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-12 14:00:11
 * @Description:
 */
const commander = require("commander");
const chalk = require("chalk");
const buildApiInfo = require("./grab");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");
const EventBus = require("eventbusjs");
const typeTemplate = require("../template/type");
const indexTemplate = require("../template/index");

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
const curFolder = path.join(process.cwd(), "output");

const initFn = async (commander, url) => {
	const fileExists =
		fs.existsSync(path.resolve(curFolder, "index.ts")) || fs.existsSync(path.resolve(curFolder, "type.ts"));
	if (fileExists && !commander.force) {
		return console.error(chalk.red("已经存在重命名的文件"));
	}
	await buildApiInfo(url);
	EventBus.addEventListener("apiInfo", async ({ type }, { apiInfo, requestProps, responseProps }) => {
		const typeTxt = await typeTemplate.parse({ apiInfo, requestProps, responseProps });
		fs.writeFile(path.resolve(curFolder, "type.ts"), typeTxt, (err) => {
			if (err) {
				return console.error(chalk.red(err));
			}
		});
		fs.writeFile(
			path.resolve(curFolder, "index.ts"),
			indexTemplate.parse({ apiInfo, requestInfo: typeTemplate.requestInfo }),
			(err) => {
				err && console.error(chalk.red(err));
			}
		);
	});
};

/**
 * @name: 通过事件监听响应机制，抓取url对应的peck文档上的接口信息，构建apiInfo、requestProps和responseProps信息
 * 
 */
const addFn = async (commander, url) => {
	const idxFileUrl = path.resolve(curFolder, "index.ts");
	const typeFileUrl = path.resolve(curFolder, "type.ts");
	const fileExists = fs.existsSync(idxFileUrl) && fs.existsSync(typeFileUrl);
	if (!fileExists) {
		return console.error(chalk.red("不存在对应的文件"));
	}
	await buildApiInfo(url);
	EventBus.addEventListener("apiInfo", async ({ type }, { apiInfo, requestProps, responseProps }) => {
		const typeFileTxt = await fsPromises.readFile(idxFileUrl, { encoding: "utf-8" });
		const typeTxt = typeTemplate.astAdd(typeFileTxt, { apiInfo, requestProps, responseProps });
		console.log(typeTxt)
		fs.writeFile(path.resolve(curFolder, "type1.ts"), typeTxt, (err) => {
			if (err) {
				return console.error(chalk.red(err));
			}
		});
		// fs.writeFile(
		// 	path.resolve(curFolder, "index.ts"),
		// 	indexTemplate.parse({ apiInfo, requestInfo: typeTemplate.requestInfo }),
		// 	(err) => {
		// 		err && console.error(chalk.red(err));
		// 	}
		// );
	});
};

const cmdCallback = { init: initFn, add: addFn };
const fn = cmdCallback[cmd] || (() => {});
fn(commander, url);
