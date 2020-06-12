/*
 * @Date: 2020-05-07 15:35:11
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-12 23:56:02
 * @Description:
 */
const { upperFirstCase, generateHeaderComment, generateTypeFileReference } = require("../utils");
const { Project } = require("ts-morph");
const { username, responseTypeUrl } = require("../utils/config");
const project = new Project({
	tsConfigFilePath: "./tsconfig.json",
	skipFileDependencyResolution: true,
	addFilesFromTsConfig: false,
});

/**
 * @name: 根据url路径名推断接口的名称
 */
const getApiName = ({ url }) => {
	const urlArray = url.split("/");
	const tmpName = urlArray.length ? urlArray[urlArray.length - 1] : "";
	return upperFirstCase(tmpName);
};

const parse = async (fileUrl, { apiInfo, requestProps, responseProps }) => {
	const name = getApiName(apiInfo);
	requestInfo["desc"] = apiInfo.title;
	requestInfo["request"].push(`I${name}RequestProps`);
	requestInfo["response"].push(`I${name}ResponseProps`);
	responseProps = responseProps.result && responseProps.length > 1 ? responseProps.result : responseProps;
	astInit(fileUrl, { apiInfo, requestProps, responseProps });
};

/**
 * @name: 初始化或覆盖该文件，生成对应的接口文档信息
 */
const astInit = async (fileUrl, { apiInfo, requestProps, responseProps } = {}) => {
	const sourceFile = project.createSourceFile(fileUrl, "", { overwrite: true });
	generateHeader(sourceFile);
	buildInterfaceFromInfo(sourceFile, { apiInfo, requestProps, responseProps });
	await project.save();
	return "";
};

/**
 * @name: 接收源文件和通过url读取的接口信息，在源文件的基础上新增对应的接口文档信息
 */
const astAdd = async (fileUrl, { apiInfo, requestProps, responseProps } = {}) => {
	const sourceFile = project.addSourceFilesAtPaths(fileUrl)[0];
	buildInterfaceFromInfo(sourceFile, { apiInfo, requestProps, responseProps });
	await project.save();
	return "";
};

/**
 * @name: 生成顶部描述
 */
const generateHeader = (sourceFile) => {
	// 生成顶部描述
	const headerComment = generateHeaderComment({ username });
	headerComment.forEach((comment) => {
		sourceFile.addStatements((writer) => {
			writer.write(comment);
		});
	});
	// 生成文件依赖
	const fileReference = generateTypeFileReference({ responseTypeUrl });
	fileReference.forEach((comment) => {
		sourceFile.addStatements((writer) => {
			writer.writeLine(comment);
		});
	});
};

/**
 * @name: 根据文档信息构建接口对象的描述
 */
const buildInterfaceFromInfo = (sourceFile, { apiInfo, requestProps, responseProps } = {}) => {
	const name = getApiName(apiInfo);
	// 生成描述
	sourceFile.addStatements((writer) => {
		writer.writeLine(`//---------------------${apiInfo.title}----------------------`);
		buildSingleInterfaceFromInfo({ interfaceName: `I${name}RequestProps`, propsInfo: requestProps, writer });
		buildSingleInterfaceFromInfo({ interfaceName: `I${name}Props`, propsInfo: responseProps, writer });
		writer.writeLine(
			`export interface I${name}ResponseProps extends IResponseType {result?: I${name}Props;}`
		);
	});
	// 格式化代码
	sourceFile.formatText({
		placeOpenBraceOnNewLineForFunctions: true,
	});
};

/**
 * @name: 构建文档里单个request或response对象的描述
 */
const buildSingleInterfaceFromInfo = (...props) => {
	let queue = props;
	while (queue.length) {
		let { interfaceName, propsInfo, writer } = queue.shift();
		writer.write(`export interface ${interfaceName}`).block(() => {
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
