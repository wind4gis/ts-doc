/*
 * @Date: 2020-06-12 14:04:54
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-14 18:25:29
 * @Description:
 */
const prettier = require("prettier");
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
 * @name: 格式化文档的response对象，去除除了result之外的属性值
 */
const normalResponseProps = (responseProps) => {
	const keyList = responseProps.flatMap((prop) => prop.name);
	const responseKeyList = ["result", "success", "errorCode", "errorMsg", "code", "msg"];
	if (keyList.length > 1) {
		let count = 0;
		responseKeyList.forEach((responseKey) => {
			if (keyList.some((key) => key === responseKey)) {
				count++;
			}
		});
		if (count >= 4) {
			responseProps = responseProps.find((r) => r.name === "result");
		}
	}
	return [responseProps];
};

/**
 * @name: 根据url路径名推断接口的名称
 */
const getApiName = ({ url }) => {
	const urlArray = url.split("/");
	let lastUrl = urlArray.length ? urlArray[urlArray.length - 1] : "";
	lastUrl = lastUrl.split("?")[0];
	return { apiName: upperFirstCase(lastUrl), urlName: lastUrl };
};

/**
 * @name: 将首个字符转为大写
 */
const upperFirstCase = (name) => {
	if (!name) return "";
	const [firstChar, ...restChar] = name;
	return [String.prototype.toUpperCase.call(firstChar), ...restChar].join("");
};

/**
 * @name: 生成文件抬头的描述
 */
const generateHeaderComment = ({ username }) => {
	const date = new Date();
	const createDate = date.toLocaleDateString("zh").replace(/\//g, "-");
	const createTime = date.toLocaleTimeString("zh", { hour12: false });

	return [
		`/* `,
		` * @Date: ${createDate} ${createTime}`,
		` * @LastEditors: ${username}`,
		` * @LastEditTime: ${createDate} ${createTime}`,
		` * @Description:`,
		` */`,
	];
};

/**
 * @name: 生成type文件的依赖
 */
const generateTypeFileReference = ({ responsefilePath }) => {
	return [`import { IResponseType } from "${responsefilePath}"`];
};

/**
 * @name: 生成index文件的依赖
 */
const generateIdxFileReference = ({ fetchfilePath }) => {
	return [`import { get, post, postJson } from "${fetchfilePath}"`];
};

module.exports = {
	getApiName,
	prettierCode,
	upperFirstCase,
	normalResponseProps,
	generateHeaderComment,
	generateTypeFileReference,
	generateIdxFileReference,
};
