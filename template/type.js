/*
 * @Date: 2020-05-07 15:35:11
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-05-09 11:50:16
 * @Description:
 */

const getParamsStr = propsArr => {
  const N = "\n";
  const len = propsArr.length;
  return propsArr.reduce((total, cur, i) => {
    total += (`  ${cur.name}${cur.required === "是" ? "" : "?"}: ${String.prototype.toLowerCase.call(cur.type)}; // ${cur.desc}${i === len - 1 ? "" : N}`)
    return total
  }, "")
}

const upperFirstCase = name => {
  if (!name) return ""
  const [firstChar, ...restChar] = name;
  return [String.prototype.toUpperCase.call(firstChar), ...restChar].join(
    ""
  );
}

const getCurResType = (urlName, cur) => {
  if (!cur.child) {
    return String.prototype.toLowerCase.call(cur.type)
  }
  const type = `I${urlName}${upperFirstCase(cur.child)}`
  if (cur.type === "Array") {
    return `Array<${type}> []`
  }
  return type
}

const getResponseStr = (urlName, responseProp) => {
  const N = "\n";
  const initTxt = `${N}interface I${urlName}${upperFirstCase(responseProp[0].parentName)} {${N}`
  let result = responseProp.reduce((total, cur) => {
    total += (`  ${cur.name}${cur.required === "是" ? "" : "?"}: ${getCurResType(urlName, cur)}; // ${cur.desc}${N}`)
    return total
  }, initTxt)
  result += `}`
  return result
}

module.exports = ({ apiInfo, requestProps, responseProps }) => {
  const { apiUrl } = apiInfo;
  const urlArray = apiUrl.split("/");
  let tmpName = urlArray.length ? urlArray[urlArray.length - 1] : "";
  const date = new Date();
  const N = "\n";
  const createDate = date.toLocaleDateString("zh").replace(/\//g, "-");
  const createTime = date.toLocaleTimeString("zh", { hour12: false });
  const name = upperFirstCase(tmpName)
  
  return `/*${N} * @Date: ${createDate} ${createTime}${
    N} * @LastEditors: Huang canfeng${
    N} * @LastEditTime: ${createDate} ${createTime}${
    N} * @Description:${
    N} */${
    N}interface I${name}RequestProps {${
    N}${getParamsStr(requestProps)}${
    N}}${
    N}${
    N}${responseProps.map(item => getResponseStr(name, item)).join(N)}
  `;
};
