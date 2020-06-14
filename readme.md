# 通过puppeteer、ts-morph和commander编写命令行工具，抓取api文档的接口数据，利用事件监听响应机制，动态生成ts文档以及支持智能添加

## 该工具共有三个功能，init/add/config

1. 先通过`tsdoc config xxx.js`命令初始化配置信息（其中xxx.js为实际的配置文件地址），进行初始化。

2. 在对应的文件夹下执行`tsdoc init xxx`命令，初始化请求api对应的index.ts文件和对应类型以及注释的type.ts文件（其中xxx为实际的api接口地址）。如果想覆盖已经生成的index.ts文件和type.ts文件，可以通过添加`-f`参数，强制覆盖：`tsdoc init -f xxx`。

3. 在已经生成文件的目录下，可以通过执行`tsdoc add xxx`命令，在源文件上动态添加新的api文档描述

> 需要先手动执行`tsdoc config`命令进行初始化，不然无法执行后续的命令

## config文件的格式如下

``` javascript
// config.js文件
module.exports = {
	username: "", // 实际的用户名
	password: "", // 实际的用户密码
	fetchfilePath: "@/utils/fetch/index", // 实际的请求文件地址
	responsefilePath: "@/utils/fetch/type", // 实际的请求类型文件地址
};

```