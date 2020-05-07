/*
 * @Date: 2020-05-07 15:35:11
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-05-07 18:52:08
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

module.exports = ({ apiInfo, requestProps, responseProps }) => {
  const { apiUrl } = apiInfo;
  const urlArray = apiUrl.split("/");
  let tmpName = urlArray.length ? urlArray[urlArray.length - 1] : "";
  const date = new Date();
  const N = "\n";
  const createDate = date.toLocaleDateString("zh").replace(/\//g, "-");
  const createTime = date.toLocaleTimeString("zh", { hour12: false });
  const [firstChar, ...restChar] = tmpName;
  const name = [String.prototype.toUpperCase.call(firstChar), ...restChar].join(
    ""
  );
  
  return `/*${N} * @Date: ${createDate} ${createTime}${
    N} * @LastEditors: Huang canfeng${
    N} * @LastEditTime: ${createDate} ${createTime}${
    N} * @Description:${
    N} */${
    N}interface I${name}RequestProps {${
    N}${getParamsStr(requestProps)}${
    N}}${
    N}${
    N}interface I${name}ResponseProps {${
    N}${getParamsStr(responseProps)}${
    N}}
  `;
};
