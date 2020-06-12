/*
 * @Date: 2020-05-07 15:35:11
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-12 19:22:23
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

// const

/**
 * @name: 接收源文件和通过url读取的接口信息，在源文件的基础上新增对应的接口文档信息
 */
const astAdd = async (typeFileUrl, { apiInfo, requestProps, responseProps } = {}) => {
	// const name = getApiName(apiInfo);
	const N = "\n";
	const sourceFile = project.addSourceFilesAtPaths(typeFileUrl)[0];
	apiInfo = {
		content: "NONE",
		method: "GET",
		title: "C端获取售后列表",
		url: "/returns/refund/app/search/listRefund",
	};
	requestProps = [
		{ name: "currentPage", required: true, type: "number", desc: "当前页" },
		{ name: "pageSize", required: true, type: "number", desc: "页量大小" },
		{
			name: "sourceType",
			required: true,
			type: "number",
			desc: "4 APP商家，5 APP用户，6 小程序用户，7 H5用户",
		},
	];
	responseProps = [
		{"name":"errorCode","required":false,"type":"number","desc":"错误码，0 成功"},
		{"name":"errorMsg","required":false,"type":"string","desc":"错误描述"},
		{"name":"result","required":false,"type":"object","desc":null,
		"children":[
			{"name":"data","required":false,"type":"array","desc":"数据集",
			"children":[
				{"name":"refundSn","required":false,"type":"string","desc":"售后单号"},
				{"name":"orderSn","required":false,"type":"string","desc":"订单号"},
				{"name":"id","required":false,"type":"number","desc":"售后ID"},
				{"name":"createTime"},
				{"name":"refundMoney","required":false,"type":"number","desc":"售后金额"},
				{"name":"refundTypeStr","required":false,"type":"string","desc":"售后类型描述：如仅退款、退货退款"},
				{"name":"refundLogisticsMoney","required":false,"type":"number","desc":"退还的运费金额"}
			]},
			{"name":"totalCount","required":false,"type":"number","desc":"总记录数"},
			{"name":"totalPage","required":false,"type":"number","desc":"总页数"}
		]},
		{"name":"success","required":false,"type":"boolean","desc":null}
	]
	// const typeFileTxtArr = generateTypeFile({
	// 	title: apiInfo.title,
	// 	interfaceName: name,
	// 	requestInterface: getParamsStr(requestProps),
	// 	responseInterface: getResponseStr(responseProps),
	// });
	// typeFileTxtArr.forEach(lineTxt => {
	// sourceFile.addStatements(`${lineTxt == "" ? " ": lineTxt + "\n"}`)
	// })
	// sourceFile.addExportDeclaration
	const interfaceDeclaration = sourceFile.addInterface({
		name: "InterfaceName",
	});
	interfaceDeclaration.addProperties([
		{ name: "newMethod1", type: "boolean", hasQuestionToken: true },
		{ name: "newMethod2", type: "{a:string}" },
	]);
	const methodParams = interfaceDeclaration.addProperty({ name: "newMethod", type: "boolean" });
	methodParams.setHasQuestionToken(true);
	interfaceDeclaration.setIsExported(true);
	await project.save();
	return "";
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
