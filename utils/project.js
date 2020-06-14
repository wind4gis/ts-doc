/*
 * @Date: 2020-06-14 14:05:51
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-14 23:05:13
 * @Description:
 */

const { Project } = require("ts-morph");
const fsPromises = require("fs").promises;
const { prettierCode } = require("../utils");
const tsConfigFilePath = "../tsconfig.json";
/**
 * @name: 返回project对象的工厂
 */
class ProjectFactory {
	static _project = null;
	static getInstance() {
		if (!ProjectFactory._project) {
			ProjectFactory._project = new Project({
				tsConfigFilePath,
				skipFileDependencyResolution: true,
				addFilesFromTsConfig: false,
			});
		}
		return ProjectFactory._project;
	}
	static async formatSave(filePath) {
    console.log(filePath);
    const target = ProjectFactory.getInstance().getSourceFile(filePath)
		if (target) {
			const formatTxt = await prettierCode(target.getText() || "");
			await fsPromises.writeFile(filePath, formatTxt);
		}
	}
}

module.exports = ProjectFactory;
