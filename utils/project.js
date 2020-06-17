/*
 * @Date: 2020-06-14 14:05:51
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-17 20:17:43
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
		const target = ProjectFactory.getInstance().getSourceFile(filePath);
		if (target) {
			const formatTxt = await prettierCode(target.getFullText() || "");
			fs.writeFile(filePath, formatTxt, (error) => error && spinnerFactory.fail(error));
		}
	}
}
ProjectFactory._project = null;

module.exports = ProjectFactory;
