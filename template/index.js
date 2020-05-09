/*
 * @Date: 2020-05-09 14:07:59
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-05-09 14:32:22
 * @Description:
 */

const upperFirstCase = name => {
  if (!name) return ""
  const [firstChar, ...restChar] = name;
  return [String.prototype.toUpperCase.call(firstChar), ...restChar].join(
    ""
  );
}

const parse = ({ apiInfo, requestInfo }) => {
  const { apiUrl, apiMethod } = apiInfo;
  const urlArray = apiUrl.split("/");
  let tmpName = urlArray.length ? urlArray[urlArray.length - 1] : "";
  const date = new Date();
  const N = "\n";
  const createDate = date.toLocaleDateString("zh").replace(/\//g, "-");
  const createTime = date.toLocaleTimeString("zh", { hour12: false });
  const { request = "", response } = requestInfo
  const name = upperFirstCase(tmpName)
  const typeStr = request && request.length ? request.concat(response) : response
  const methodStr = apiMethod === "GET" ? "get" : "post"

  return `/*${N} * @Date: ${createDate} ${createTime}${
    N} * @LastEditors: Huang canfeng${
    N} * @LastEditTime: ${createDate} ${createTime}${
    N} * @Description:${
    N} */${
    N}import { ${methodStr} } from "@/utils/fetch/index";${
    N}import { ${typeStr.join(", ")} } from "./type";${
    N}const urls = {${
    N}  ${tmpName}: "${apiUrl}"${
    N}}${
    N}${
    N}export const ${methodStr}${name}: (${request.length ? request[0] : ""}) => Promise<${response[0]}> = () => ${methodStr}(urls.${tmpName})
  `;
};

module.exports = { parse }
