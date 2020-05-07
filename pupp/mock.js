const puppeteer = require("puppeteer");
const Config = require("./config");
const { account, password } = Config;

(async () => {
  const browser = await puppeteer.launch({
    // 是否运行浏览器无头模式(boolean)
    headless: false,
    // 是否自动打开调试工具(boolean)，若此值为true，headless自动置为fasle
    devtools: true,
    // 设置超时时间(number)，若此值为0，则禁用超时
    timeout: 20000,
  });
  const page = await browser.newPage();
  await page.goto("http://peck.weilaijishi.com", { waitUntil: "networkidle2" });
  //登录
  await page.type("input[formcontrolname=phone]", `${account}`);
  await page.type("input[formcontrolname=passWord]", `${password}`);

  await Promise.all([
    page.click("button[type=button]"),
    page.waitForNavigation(),
  ]);
  await page.goto(
    "http://peck.weilaijishi.com/#/main/index/5e5e0bbf5bbabf755f69c676/doc/api/show/5e749d07885aba14e0ce9550",
    { waitUntil: "networkidle2" }
  );

  await page.waitForNavigation();

  const tdList = await page.$$(
    "nz-tabset:nth-child(1) tr[class*=ant-descriptions-row]"
  );
  let apiInfo = {};
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

  const reqArgList = await page.$$(
    "nz-tabset:nth-child(2) div[nz-tab-label][role=tab]"
  );
  const fieldMap = ["name", "required", "type", "rule", "defaultValue", "desc"];
  for (let idx = 0, len = reqArgList.length; idx < len; idx++) {
    if (idx === 1) continue;
    if (apiInfo.apiMethod === "GET" && idx === 0) {
      const item = reqArgList[idx];
      await item.click();
      const tbody = await page.$("nz-tabset:nth-child(2) tbody");
      const count = await page.evaluate((el) => el.childElementCount, tbody);
      if (!!count) {
        // apiInfo.params = "1"
      }
    }
    let postRequestProps = [];
    if (apiInfo.apiMethod === "POST" && idx === 2) {
      const item = reqArgList[idx];
      await item.click();
      const tbody = await page.$("nz-tabset:nth-child(2) tbody");
      const count = await page.evaluate((el) => el.childElementCount, tbody);
      if (!!count) {
        const tdList = await tbody.$$("td");
        let curProps = {};
        for (let idx = 0; idx < tdList.length; idx++) {
          const tdItem = tdList[idx];
          const tdTxtItem = await tdItem.$("span");
          const curFieldValue = tdTxtItem
            ? await tdTxtItem.evaluate((el) => el.innerText)
            : await tdItem.evaluate((el) => el.innerText);
          let curIdx = idx % 6;
          if (curIdx === 0) {
            curProps = {};
            postRequestProps.push(curProps);
          }
          const curFieldName = fieldMap[curIdx];
          curProps[curFieldName] = curFieldValue;
        }
      }
    }
  }

  // const element = await page
  //   .waitForSelector(
  //     "tr[class*=ant-descriptions-row][class*=ng-star-inserted]:nth-child(6)"
  //   )
  //   .then((dom) => console.log(dom, "dom"));
})();
