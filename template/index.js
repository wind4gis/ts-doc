/*
 * @Date: 2020-05-09 14:07:59
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-14 15:12:35
 * @Description:
 */
const { getApiName, generateHeaderComment, generateIdxFileReference } = require("../utils");
const { username, fetchfilePath } = require("../utils/config");
const ProjectFactory = require("../utils/project");
const project = ProjectFactory.getInstance();

/**
 * @name: 初始化或覆盖该文件，生成对应的接口文档信息
 */
const initApi = async (filePath, { apiInfo, requestInfo } = {}) => {
	const { request = [], response, desc } = requestInfo;
	const sourceFile = project.createSourceFile(filePath, "", { overwrite: true });
	generateHeader(sourceFile);
	initInterfaceFromInfo(sourceFile, { apiInfo, request, response, desc });
	// 格式化代码
	await ProjectFactory.formatSave(filePath);
};
/**
 * @name: 在之前生成的index文件上追加api接口描述
 */
const addApi = async (filePath, { apiInfo, requestInfo } = {}) => {
	const { request = [], response, desc } = requestInfo;
	const sourceFile = project.addSourceFilesAtPaths(filePath)[0];
	addInterfaceFromInfo(sourceFile, { apiInfo, request, response, desc });
	// 格式化代码
	await ProjectFactory.formatSave(filePath);
};
//---------------------生成代码----------------------
/**
 * @name: 生成idx文件袋顶部描述
 */
const generateHeader = (sourceFile) => {
	const headerComment = generateHeaderComment({ username }); // 生成顶部描述
	const fileReference = generateIdxFileReference({ fetchfilePath }); // 生成文件依赖
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
 * @name: 初始化或覆盖该文件，生成对应的接口文档信息
 */
const initInterfaceFromInfo = async (sourceFile, { apiInfo, request, response, desc } = {}) => {
	const typeList = (request || []).concat(response);
	const { url } = apiInfo;
	const method = "".toLowerCase.call(apiInfo.method);
	const { apiName, urlName } = getApiName(apiInfo);
	// 初始化文件
	sourceFile.addStatements((writer) => {
		// 生成顶部type文件的引用
		writer.writeLine(`import {`);
		typeList.forEach((type) => {
			writer.write(`${type},`);
		});
		writer.writeLine(`} from "./type"`);
		// 生成请求的url地址
		writer.writeLine(`\n//---------------------请求的url地址----------------------`);
		writer.writeLine(`const urls = {`);
		writer.writeLine(`${urlName}: "${url}", // ${desc}`);
		writer.writeLine(`}`);
		//生成请求的方法
		writer.writeLine(`\n//---------------------发起请求的方法----------------------`);
		writer.writeLine(`// ${desc}`);
		writer.writeLine(
			`export const ${method}${apiName}: (${request.length ? request[0] : ""}) => Promise<${
				response[0]
			}> = (params) => ${method}(urls.${urlName}, params)`
		);
	});
};
/**
 * @name: 接收源文件和通过url读取的接口信息，在源文件的基础上新增对应的接口文档信息
 */
const addInterfaceFromInfo = (sourceFile, { apiInfo, request, response, desc } = {}) => {
	const typeList = (request || []).concat(response);
	const { url } = apiInfo;
	const method = "".toLowerCase.call(apiInfo.method);
	const { apiName, urlName } = getApiName(apiInfo);
	// 添加import参数
	const importDeclaration = sourceFile.getImportDeclarations()[1];
	importDeclaration.addNamedImports(typeList);
	// 添加urls参数
	const urlsValStr = sourceFile.getVariableDeclaration("urls").getInitializer().getText();
	let urlsValObj = {};
	try {
		urlsValObj = eval("(" + urlsValStr + ")");
	} catch (error) {
		urlsValObj = {};
	}
	urlsValObj[urlName] = url;
	sourceFile.getVariableDeclaration("urls").setInitializer(JSON.stringify(urlsValObj));
	// 添加请求的方法
	sourceFile.addStatements((writer) => {
		writer.writeLine(`\n// ${desc}`);
		writer.writeLine(
			`export const ${method}${apiName}: (${request.length ? request[0] : ""}) => Promise<${
				response[0]
			}> = (params) => ${method}(urls.${urlName}, params)`
		);
	});
};

module.exports = { initApi, addApi };
