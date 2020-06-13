/*
 * @Date: 2020-05-07 15:35:11
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-14 02:20:36
 * @Description:
 */
const {
	prettierCode,
	upperFirstCase,
	getApiName,
	generateHeaderComment,
	generateTypeFileReference,
} = require("../utils");
const { Project } = require("ts-morph");
const { username, responseTypeUrl } = require("../utils/config");
const project = new Project({
	tsConfigFilePath: "./tsconfig.json",
	skipFileDependencyResolution: true,
	addFilesFromTsConfig: false,
});

/**
 * @name: 初始化
 */
const initApi = async (fileUrl, { apiInfo, requestProps, responseProps }) => {
	responseProps = responseProps.result && responseProps.length > 1 ? responseProps.result : responseProps;
	astInit(fileUrl, { apiInfo, requestProps, responseProps });
	return getRequestInfo({ apiInfo });
};
/**
 * @name: 添加数据
 */
const addApi = async (fileUrl, { apiInfo, requestProps, responseProps }) => {
	responseProps = responseProps.result && responseProps.length > 1 ? responseProps.result : responseProps;
	astAdd(fileUrl, { apiInfo, requestProps, responseProps });
	return getRequestInfo({ apiInfo });
};
/**
 * @name: 设置getRequestInfo，用于构建index文件
 */
const getRequestInfo = ({ apiInfo }) => {
	const { apiName } = getApiName(apiInfo);
	const requestInfo = {
		desc: "",
		request: [],
		response: [],
	};
	requestInfo["desc"] = apiInfo.title;
	requestInfo["request"].push(`I${apiName}RequestProps`);
	requestInfo["response"].push(`I${apiName}ResponseProps`);
	return requestInfo;
};
/**
 * @name: 初始化或覆盖该文件，生成对应的接口文档信息
 */
const astInit = async (fileUrl, { apiInfo, requestProps, responseProps } = {}) => {
	const sourceFile = project.createSourceFile(fileUrl, "", { overwrite: true });
	generateHeader(sourceFile);
	buildInterfaceFromInfo(sourceFile, { apiInfo, requestProps, responseProps });
	await project.save();
};

/**
 * @name: 接收源文件和通过url读取的接口信息，在源文件的基础上新增对应的接口文档信息
 */
const astAdd = async (fileUrl, { apiInfo, requestProps, responseProps } = {}) => {
	const sourceFile = project.addSourceFilesAtPaths(fileUrl)[0];
	buildInterfaceFromInfo(sourceFile, { apiInfo, requestProps, responseProps });
	await project.save();
};

/**
 * @name: 生成type文件袋顶部描述
 */
const generateHeader = (sourceFile) => {
	const headerComment = generateHeaderComment({ username }); // 生成顶部描述
	const fileReference = generateTypeFileReference({ responseTypeUrl }); // 生成文件依赖
	sourceFile.addStatements((writer) => {
		headerComment.forEach((comment) => {
			// 生成顶部描述
			writer.writeLine(comment);
		});
		fileReference.forEach((comment) => {
			// 生成文件依赖
			writer.writeLine(comment);
		});
	});
};

/**
 * @name: 根据文档信息构建接口对象的描述
 */
const buildInterfaceFromInfo = (sourceFile, { apiInfo, requestProps, responseProps } = {}) => {
	const { apiName } = getApiName(apiInfo);
	// 生成描述
	sourceFile.addStatements((writer) => {
		writer.writeLine(`\n//---------------------${apiInfo.title}----------------------`);
		buildSingleInterfaceFromInfo({
			interfaceName: `I${apiName}RequestProps`,
			propsInfo: requestProps,
			writer,
		});
		buildSingleInterfaceFromInfo({ interfaceName: `I${apiName}Props`, propsInfo: responseProps, writer });
		writer.writeLine(
			`export interface I${apiName}ResponseProps extends IResponseType {result?: I${apiName}Props;}`
		);
	});
	// 格式化代码
	const formatText = await prettierCode(sourceFile.getText());
	sourceFile.removeText(sourceFile.getPos(), sourceFile.getEnd());
	sourceFile.insertText(0, formatText);
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
		writer.writeLine("");
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

module.exports = {
	initApi,
	addApi,
};
