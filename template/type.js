/*
 * @Date: 2020-05-07 15:35:11
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-12 14:01:59
 * @Description:
 */
const babel = require("@babel/core");
const template = require("@babel/template")
const prettier = require("prettier");
const t = require("@babel/types");
const generate = require("@babel/generator").default;

const getParamsStr = (propsArr) => {
	const N = "\n";
	const len = propsArr.length;
	return propsArr.reduce((total, cur, i) => {
		total += `  ${cur.name}${cur.required === "是" ? "" : "?"}: ${cur.type}; // ${cur.desc}${
			i === len - 1 ? "" : N
		}`;
		return total;
	}, "");
};

const upperFirstCase = (name) => {
	if (!name) return "";
	const [firstChar, ...restChar] = name;
	return [String.prototype.toUpperCase.call(firstChar), ...restChar].join("");
};

const getResponseItemStr = (type, array) => {
	const N = "\n";
	const len = array.length;
	let result = `{${N}`;
	result += array.reduce((total, cur, i) => {
		total += `  ${cur.name}${cur.required === "是" ? "" : "?"}: ${
			cur.children ? getResponseItemStr(cur.type, cur.children) : cur.type
		}; // ${cur.desc}${i === len - 1 ? "" : N}`;
		return total;
	}, "");
	result += `${N}}${type === "array" ? [] : ""}`;
	return result;
};
/**
 * @name: 根据response对象生成接口数据
 */
const getResponseStr = (responseProp) => {
	const N = "\n";
	const len = responseProp.length;
	let result = ``;
	if (responseProp.some((r) => r.name === "result") && responseProp.length === 1) {
		// result += `result: {${N}`;
	}
	responseProp = responseProp.some((prop) => prop.name === "result")
		? responseProp
				.flatMap((prop) => {
					if (prop.name !== "result") {
						return null;
					}
					return prop.children;
				})
				.filter(Boolean)
		: responseProp;
	result += responseProp.reduce((total, cur, i) => {
		if (cur.children) {
			total += `  ${cur.name}: ${getResponseItemStr(cur.type, cur.children)},${N}`;
		} else {
			total += `  ${cur.name}${cur.required === "是" ? "" : "?"}: ${cur.type}; // ${cur.desc}${
				i === len - 1 ? "" : N
			}`;
		}
		return total;
	}, "");
	if (responseProp.some((r) => r.name === "result") || responseProp.length === 1) {
		// result += `${N}}`;
	}
	return result;
};
/**
 * @name: 格式化代码
 */
const prettierCode = (result) => {
	return prettier.resolveConfigFile().then((filePath) => {
		return prettier.resolveConfig(filePath).then((options) => {
			return prettier.format(result, options);
		});
	});
};
/**
 * @name: 根据url路径名推断接口的名称
 */
const getApiName = ({ url }) => {
	const urlArray = url.split("/");
	const tmpName = urlArray.length ? urlArray[urlArray.length - 1] : "";
	return upperFirstCase(tmpName);
};

const parse = async ({ apiInfo, requestProps, responseProps }) => {
	const name = getApiName(apiInfo);
	const N = "\n";
	const date = new Date();
	const createDate = date.toLocaleDateString("zh").replace(/\//g, "-");
	const createTime = date.toLocaleTimeString("zh", { hour12: false });

	requestInfo["desc"] = apiInfo.title;
	requestInfo["request"].push(`I${name}RequestProps`);
	requestInfo["response"].push(`I${name}ResponseProps`);

	const result = `/*${N} * @Date: ${createDate} ${createTime}${N} * @LastEditors: Huang canfeng${N} * @LastEditTime: ${createDate} ${createTime}${N} * @Description:${N} */${N}import { IResponseType } from "@/utils/fetch/type";${N}${N}//---------------------${
		apiInfo.title
	}----------------------${N}export interface I${name}RequestProps {${N}${getParamsStr(
		requestProps
	)}${N}}${N}${N}export interface I${name}Props {${N}${getResponseStr(
		responseProps
	)}${N}}${N}${N}export interface I${name}ResponseProps extends IResponseType {${N}  result?: I${name}Props;${N}}
  `;
	return prettierCode(result);
};

/**
 * @name: 接收源文件和通过url读取的接口信息，在源文件的基础上新增对应的接口文档信息
 */
const astAdd = (code, { apiInfo, requestProps, responseProps }) => {
	const name = getApiName(apiInfo);
	const N = "\n";
	const ast = babel.transformSync(code, {
		sourceType: "module",
		plugins: [
			"@babel/plugin-transform-typescript",
			function astAddPlugin() {
				return {
					visitor: {
						Identifier: {
							enter(path) {
								console.log(path.node.name)
							}
						},
						Program(path) {
							path.addComment('trailing',`---------------------${apiInfo.title}----------------------`)
							
						},
					},
				};
			},
		],
	});
	// const output = generate(ast, {}, code);
	// console.log(output, "output");
	return ast.code
};

const requestInfo = {
	desc: "",
	request: [],
	response: [],
};

module.exports = {
	parse,
	astAdd,
	requestInfo,
};
