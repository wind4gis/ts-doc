/*
 * @Date: 2020-05-09 14:07:59
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-14 02:20:25
 * @Description:
 */
const { prettierCode, getApiName, generateHeaderComment, generateIdxFileReference } = require("../utils");
const { username, fetchFileUrl } = require("../utils/config");
const { Project } = require("ts-morph");
const project = new Project({
	tsConfigFilePath: "./tsconfig.json",
	skipFileDependencyResolution: true,
	addFilesFromTsConfig: false,
});

/**
 * @name: 初始化或覆盖该文件，生成对应的接口文档信息
 */
const initApi = async (fileUrl, { apiInfo, requestInfo } = {}) => {
	const { request = [], response, desc } = requestInfo;
	const sourceFile = project.createSourceFile(fileUrl, "", { overwrite: true });
	generateHeader(sourceFile);
	initInterfaceFromInfo(sourceFile, { apiInfo, request, response, desc });
	await project.save();
};
/**
 * @name: 在之前生成的index文件上追加api接口描述
 */
const addApi = async (fileUrl, { apiInfo, requestInfo } = {}) => {
	const { request = [], response, desc } = requestInfo;
	const sourceFile = project.addSourceFilesAtPaths(fileUrl)[0];
	addInterfaceFromInfo(sourceFile, { apiInfo, request, response, desc });
	await project.save();
};

/**
 * @name: 生成idx文件袋顶部描述
 */
const generateHeader = (sourceFile) => {
	const headerComment = generateHeaderComment({ username }); // 生成顶部描述
	const fileReference = generateIdxFileReference({ fetchFileUrl }); // 生成文件依赖
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

	// 格式化代码
	const formatText = await prettierCode(sourceFile.getText());
	sourceFile.removeText(sourceFile.getPos(), sourceFile.getEnd());
	sourceFile.insertText(0, formatText);
};

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
	const formatText = await prettierCode(sourceFile.getText());
	sourceFile.removeText(sourceFile.getPos(), sourceFile.getEnd());
	sourceFile.insertText(0, formatText);
};

module.exports = { initApi, addApi };
