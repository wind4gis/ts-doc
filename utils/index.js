/*
 * @Date: 2020-06-12 14:04:54
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-12 17:09:17
 * @Description:
 */

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
		`/*`,
		` * @Date: ${createDate} ${createTime}`,
		` * @LastEditors: ${username}`,
		` * @LastEditTime: ${createDate} ${createTime}`,
		` * @Description:`,
		``,
	];
};

/**
 * @name: 生成type文件的依赖
 */
const generateTypeFileReference = ({ responseTypeUrl }) => {
	return [`import { IResponseType } from ${responseTypeUrl}`];
};

/**
 * @name: 生成type.ts文件的代码
 */
const generateTypeFile = ({ title, interfaceName, requestInterface, responseInterface }) => {
	return [
		``,
		`//---------------------${title}----------------------`,
		``,
		`export interface I${interfaceName}RequestProps {`,
		`${requestInterface}`,
		`}`,
		``,
		`export interface I${interfaceName}Props {`,
		`${responseInterface}`,
		`}`,
		``,
		`export interface I${interfaceName}ResponseProps extends IResponseType {`,
		`  result?: I${interfaceName}Props;`,
		`}`,
	];
};

module.exports = {
	prettierCode,
	upperFirstCase,
	generateTypeFile
};
