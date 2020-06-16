/*
 * @Date: 2020-06-14 14:05:51
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-16 23:06:19
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
	static async formatSave(filePath) {
		console.log(filePath);
		const target = ProjectFactory.getInstance().getSourceFile(filePath);
		if (target) {
			const formatTxt = await prettierCode(target.getText() || "");
			fs.writeFile(filePath, formatTxt, (error) => error && spinnerFactory.fail(error));
		}
	}
}
ProjectFactory._project = null;

module.exports = ProjectFactory;
