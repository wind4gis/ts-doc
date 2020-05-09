/*
 * @Date: 2020-05-06 15:04:38
 * @LastEditors: Huang canfeng
 * @LastEditTime: 2020-05-09 09:57:25
 * @Description:
 */
const puppeteer = require("puppeteer");
const Config = require("./config");
const { account, password } = Config;

/**
 * @name: 根据传入的接口文档url，构建对应的接口信息
 */
const buildApiInfo = async (url) => {
  const browser = await puppeteer.launch({
    headless: false,
    devtools: true,
    timeout: 20000,
  });
  const page = await browser.newPage();
  await login({ page });
  await page.goto(url, { waitUntil: "networkidle2" });
  await page.waitForNavigation();

  let apiInfo = {}; // 网络请求的基本信息
  let requestProps = []; // 请求参数数组
  let responseProps = []; // 响应参数数组

  await initApiInfo({ apiInfo, page }); // 初始化api基本属性
  await initRequestParams({ apiInfo, requestProps, page }); // 初始化请求参数
  await initResponseParams({ responseProps, page }); // 初始化响应参数
  console.log(apiInfo, requestProps, responseProps, "xxx");
  await page.close(); // 关闭网页
  await browser.close(); // 关闭浏览器
  return {
    apiInfo,
    requestProps,
    responseProps,
  };
};

const login = async ({ page }) => {
  await page.goto("http://peck.weilaijishi.com", { waitUntil: "networkidle2" });
  //登录
  await page.type("input[formcontrolname=phone]", `${account}`);
  await page.type("input[formcontrolname=passWord]", `${password}`);

  await Promise.all([
    page.click("button[type=button]"),
    page.waitForNavigation(),
  ]);
};

const initApiInfo = async ({ apiInfo, page }) => {
  const tdList = await page.$$(
    "nz-tabset:nth-child(1) tr[class*=ant-descriptions-row]"
  );
  const setApiInfo = (name, title, apiInfo = {}, idx = -1) => (
    curName,
    curIdx
  ) => {
    if (!~idx && String.prototype.includes.call(curName, title)) {
      idx = curIdx;
    }
    if (~idx && curIdx === idx + 1) {
      apiInfo[name] = curName;
    }
  };
  const setApiUrlFn = setApiInfo("apiUrl", "URL地址", apiInfo);
  const setApiDescFn = setApiInfo("apiDesc", "接口简介", apiInfo);
  const setApiMethodFn = setApiInfo("apiMethod", "请求方法", apiInfo);
  for (let idx = 0, len = tdList.length; idx < len; idx++) {
    const td = tdList[idx];
    const label = await page.evaluate((el) => el.innerText, td);
    setApiUrlFn(label, idx);
    setApiDescFn(label, idx);
    setApiMethodFn(label, idx);
  }
  // 处理GET/POST请求以及对应的content-type编码
  if (apiInfo.apiMethod) {
    const methodArr = apiInfo.apiMethod.split("\t");
    apiInfo.apiMethod = String.prototype.toUpperCase.call(methodArr[0]);
    apiInfo.apiContentType = methodArr[2];
  }
};

const buildApiParams = async ({ tbody, apiProps }) => {
  const fieldMap = ["name", "required", "type", "rule", "defaultValue", "desc"];
  const tdList = await tbody.$$("td");
  let curProps = {};
  for (let idx = 0; idx < tdList.length; idx++) {
    const tdItem = tdList[idx];
    const tdTxtItem = await tdItem.$("span[class=ng-star-inserted]");
    const curFieldValue = tdTxtItem
      ? await tdTxtItem.evaluate((el) => el.innerText)
      : await tdItem.evaluate((el) => el.innerText);
    let curIdx = idx % 6;
    if (curIdx === 0) {
      curProps = {};
      apiProps.push(curProps);
    }
    const curFieldName = fieldMap[curIdx];
    curProps[curFieldName] = curFieldValue;
  }
};

const initRequestParams = async ({ apiInfo, requestProps, page }) => {
  const reqArgList = await page.$$(
    "nz-tabset:nth-child(2) div[nz-tab-label][role=tab]"
  );
  for (let idx = 0, len = reqArgList.length; idx < len; idx++) {
    if (idx === 1) continue;
    const isGetParams = apiInfo.apiMethod === "GET" && idx === 0;
    const isPostParams = apiInfo.apiMethod === "POST" && idx === 2;
    if (isGetParams || isPostParams) {
      const item = reqArgList[idx];
      await item.click();
      const tbody = await page.$("nz-tabset:nth-child(2) tbody");
      const count = await page.evaluate((el) => el.childElementCount, tbody);
      if (!!count) {
        await buildApiParams({ tbody, apiProps: requestProps });
      }
    }
  }
};

const initResponseParams = async ({ responseProps, page }) => {
  const tbody = await page.$("nz-tabset:nth-child(3) tbody");
  const count = await page.evaluate((el) => el.childElementCount, tbody);
  if (!!count) {
    let queue = [];
    let curResponse = null;
    let curParentName = "";
    const trList = await tbody.$$("tr");
    const firstChild = { name: "", val: trList, curOffset: 1 };
    queue.push(firstChild);
    while (queue.length) {
      const curItem = queue.pop();
      curResponse = curItem.val;
      curParentName = curItem.name;
      if (curItem.curIcon) {
        const preCount = await page.evaluate((el) => el.childElementCount, tbody);
        await curItem.curIcon.click();
        const curCount = await page.evaluate((el) => el.childElementCount, tbody);
        curResponse = await tbody.$$(`tr:nth-child(n+${curItem.curOffset}):nth-child(-n+${curItem.curOffset + curCount - preCount - 1})`);
      }
      let curInterfaceProp = []
      for (let curTrIdx = 0; curTrIdx < curResponse.length; curTrIdx++) {
        const curTr = curResponse[curTrIdx];
        const tdList = await curTr.$$("td");
        const fieldMap = [
          "name",
          "required",
          "type",
          "rule",
          "defaultValue",
          "desc",
        ];
        let curProp = { parentName: curParentName };
        for (let curTdIdx = 0; curTdIdx < tdList.length; curTdIdx++) {
          const curTd = tdList[curTdIdx];
          const tdTxtItem = await curTd.$("span[class=ng-star-inserted]");
          const curFieldValue = tdTxtItem
            ? await tdTxtItem.evaluate((el) => el.innerText)
            : await curTd.evaluate((el) => el.innerText);
          if (curTdIdx === 0) {
            let curIcon = await curTd.$(
              "span[class*=ant-table-row-expand-icon][class*=ant-table-row-collapsed]"
            );
            if (curIcon) {
              queue.push({
                val: {},
                curIcon,
                curOffset: curTrIdx + curItem.curOffset + 1,
                name: curFieldValue,
              });
              curProp.child = curFieldValue;
            }
          }
          const curFieldName = fieldMap[curTdIdx];
          curProp[curFieldName] = curFieldValue;
        }
        curInterfaceProp.push(curProp)
      }
      responseProps.push(curInterfaceProp)
    }
  }
};

module.exports = buildApiInfo;
