/*
 * @Date: 2020-05-06 15:04:38
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-18 14:39:36
 * @Description:
 */
const puppeteer = require("puppeteer");
const EventBus = require("eventbusjs");
const path = require("path");
const fs = require("fs");
let Config = null;
if (fs.existsSync(path.join(__dirname, "..", "config", "tsdoc-config.js"))) {
	Config = require("../config/tsdoc-config");
}
const { username, password } = Config || {};

/**
 * @name: 根据传入的接口文档url，构建对应的接口信息
 */
const buildApiInfo = async (url) => {
	const browser = await puppeteer.launch({
		headless: true,
		devtools: false,
		timeout: 20000,
	});
	const page = await browser.newPage();
	await page.goto(url, { waitUntil: "networkidle2" });
	await login({ page });
	await page.goto(url, { waitUntil: "networkidle2" });
	await page.waitForNavigation();

	page.on("response", async (res) => {
		if (res && res.url().indexOf("find.query") >= 0) {
			const txt = await res.text();
			const { apiInfo, requestProps, responseProps } = await initApi(JSON.parse(txt));
			apiInfo.url = apiInfo.url[0] === "/" ? apiInfo.url.slice(1) : apiInfo.url;
			EventBus.dispatch("apiInfo", null, { apiInfo, requestProps, responseProps });
		}
	});
	const initApi = async ({ data }) => {
		let apiInfo = {}, // 网络请求的基本信息
			requestProps = {}, // 请求参数数组
			responseProps = {}; // 响应参数数组
		const {
			url = "",
			method = "GET",
			memo = "",
			content = "",
			body = [],
			parameter = [],
			response = [],
		} = data;
		// 初始化请求的头部等相关信息
		apiInfo = { ...apiInfo, url, method, title: memo, content };
		// 初始化请求参数
		const getParams = (list) =>
			list.map((item) => ({
				name: item.name,
				required: item.required,
				type: "".toLowerCase.call(item.paramType),
				desc: item.memo,
			}));
		// 设置apiInfo的参数信息
		// requestProps = method === "GET" ? getParams(parameter) : getParams(body);
		requestProps = getParams(parameter.length ? parameter : body.length ? body : []);
		// 返回apiinfo的response信息
		const getResponse = (item) => {
			if (Array.isArray(item)) return item.map((arrayItem) => getResponse(arrayItem));
			const result = {
				name: item.name,
				required: item.required,
				type: "".toLowerCase.call(item.paramType),
				desc: item.memo,
			};
			if (item.children && item.children.length) {
				result.children = getResponse(item.children);
			}
			return result;
		};
		responseProps = response.map((item) => getResponse(item));
		await page.close(); // 关闭网页
		await browser.close(); // 关闭浏览器
		return {
			apiInfo,
			requestProps,
			responseProps,
		};
	};
};

const login = async ({ page }) => {
	//登录
	await page.type("input[formcontrolname=phone]", `${username}`);
	await page.type("input[formcontrolname=passWord]", `${password}`);

	await Promise.all([page.click("button[type=button]"), page.waitForNavigation()]);
};

module.exports = buildApiInfo;
