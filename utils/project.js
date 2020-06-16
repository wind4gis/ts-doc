/*
 * @Date: 2020-06-14 14:05:51
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-16 22:11:44
 * @Description:
 */

const { Project } = require("ts-morph");
const fs = require("fs");
const path = require("path");
const { prettierCode } = require("../utils");
const spinnerFactory = require("../utils/spinner");
const tsConfigFilePath = path.join(__dirname, "../tsconfig.json");
/**
 * @name: 返回project对象的工厂
 */
class ProjectFactory {
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
	static formatSave(filePath) {
		console.log(filePath);
		const target = ProjectFactory.getInstance().getSourceFile(filePath);
		if (target) {
			const formatTxt = prettierCode(target.getText() || "");
			fs.writeFileSync;
			fs.writeFile(filePath, formatTxt, (error) => spinnerFactory.fail(error));
		}
	}
}
ProjectFactory._project = null;

module.exports = ProjectFactory;
