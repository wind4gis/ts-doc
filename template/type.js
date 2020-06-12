/*
 * @Date: 2020-05-07 15:35:11
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-12 23:07:35
 * @Description:
 */
const babel = require("@babel/core");
const path = require("path");
const { prettierCode, upperFirstCase, generateTypeFile } = require("../utils");
const { Project } = require("ts-morph");
const project = new Project({
	tsConfigFilePath: "./tsconfig.json",
	skipFileDependencyResolution: true,
	addFilesFromTsConfig: false,
});
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

const getTsResponse = (responseProp) => {
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
	return;
};

/**
 * @name: 根据response对象生成接口数据
 */
const getResponseStr = (responseProp) => {
	const N = "\n";
	const len = responseProp.length;
	let result = ``;
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
	return result;
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

	// const result = `/*${N} * @Date: ${createDate} ${createTime}${N} * @LastEditors: Huang canfeng${N} * @LastEditTime: ${createDate} ${createTime}${N} * @Description:${N} */${N}import { IResponseType } from "@/utils/fetch/type";${N}${N}//---------------------${
	// 	apiInfo.title
	// }----------------------${N}export interface I${name}RequestProps {${N}${getParamsStr(
	// 	requestProps
	// )}${N}}${N}${N}export interface I${name}Props {${N}${getResponseStr(
	// 	responseProps
	// )}${N}}${N}${N}export interface I${name}ResponseProps extends IResponseType {${N}  result?: I${name}Props;${N}}
  // `;
	// return prettierCode(result);
	
};

/**
 * @name: 接收源文件和通过url读取的接口信息，在源文件的基础上新增对应的接口文档信息
 */
const astAdd = async (typeFileUrl, { apiInfo, requestProps, responseProps } = {}) => {
	const name = getApiName(apiInfo);
	const sourceFile = project.addSourceFilesAtPaths(typeFileUrl)[0];
	sourceFile.addStatements((writer) => {
		writer.writeLine(`//---------------------${apiInfo.title}----------------------`);
		buildInterfaceFromInfo({ interfaceName: `I${name}RequestProps`, propsInfo: requestProps, writer });
		buildInterfaceFromInfo({ interfaceName: `I${name}Props`, propsInfo: responseProps, writer });
		writer.writeLine(
			`export interface I${name}ResponseProps extends IResponseType {result?: I${name}Props;}`
		);
	});
	sourceFile.formatText({
		placeOpenBraceOnNewLineForFunctions: true,
	});
	await project.save();
	return "";
};

/**
 * @name: 构建单个文档描述对应的接口对象
 */
const buildInterfaceFromInfo = (...props) => {
	let queue = props;
	while (queue.length) {
		let { interfaceName, propsInfo, writer } = queue.shift();
		writer.write(`export interface ${interfaceName}`).block(() => {
			// buildInterfaceFromInfo({ propsInfo: requestProps, writer });
			propsInfo.forEach((prop) => {
				if (prop.children) {
					const parentInterfaceName = `I${upperFirstCase(prop.name)}Props`;
					buildSingleProp({
						writer,
						prop: { ...prop, type: parentInterfaceName },
						isArray: prop.type === "array",
					});
					queue.push({
						interfaceName: parentInterfaceName,
						propsInfo: prop.children,
						writer,
						type: prop.type,
					});
				} else {
					buildSingleProp({ writer, prop });
				}
			});
		});
	}
};

/**
 * @name: 生成单条属性描述
 */
const buildSingleProp = ({ writer, prop, isArray = false }) => {
	writer.writeLine(
		`${prop.name}${prop.required ? "" : "?"} : ${isArray ? "Array<" + prop.type + ">" : prop.type} // ${
			prop.desc
		}`
	);
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
