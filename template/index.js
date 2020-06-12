/*
 * @Date: 2020-05-09 14:07:59
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-06-11 19:06:12
 * @Description:
 */
const babel = require('@babel/core');

const upperFirstCase = name => {
  if (!name) return ""
  const [firstChar, ...restChar] = name;
  return [String.prototype.toUpperCase.call(firstChar), ...restChar].join(
    ""
  );
}

const parse = ({ apiInfo, requestInfo }) => {
  const { url, method } = apiInfo;
  const urlArray = url.split("/");
  let tmpName = urlArray.length ? urlArray[urlArray.length - 1] : "";
  const date = new Date();
  const N = "\n";
  const createDate = date.toLocaleDateString("zh").replace(/\//g, "-");
  const createTime = date.toLocaleTimeString("zh", { hour12: false });
  const { request = "", response, desc } = requestInfo
  const name = upperFirstCase(tmpName)
  const typeStr = request && request.length ? request.concat(response) : response
  const methodStr = method === "GET" ? "get" : "post"

  return `/*${N} * @Date: ${createDate} ${createTime}${
    N} * @LastEditors: Huang canfeng${
    N} * @LastEditTime: ${createDate} ${createTime}${
    N} * @Description:${
    N} */${
    N}import { ${methodStr} } from "@/utils/fetch/index";${
    N}import { ${typeStr.join(", ")} } from "./type";${
    N}//---------------------请求的url地址----------------------${
    N}const urls = {${
    N}  ${tmpName}: "${url}", // ${desc}${
    N}}${
    N}${
    N}//---------------------发起请求的方法----------------------${
    N}// ${desc}${
    N}export const ${methodStr}${name}: (${request.length ? request[0] : ""}) => Promise<${response[0]}> = () => ${methodStr}(urls.${tmpName})
  `;
};

module.exports = { parse }
