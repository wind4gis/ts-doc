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
  await page.goto(
    "http://peck.weilaijishi.com/#/main/index/5e5c7ec4dd98884b0c9d469c/doc/api/show/5e788a27885aba14e0ce9744"
  );
  await page.waitForNavigation();
  
  //登录
  await page.type("input[formcontrolname=phone]", account);
  await page.type("input[formcontrolname=passWord]", password);
  await page.click("button[type=button]")

  // const element = await page
  //   .waitForSelector(
  //     "tr[class*=ant-descriptions-row][class*=ng-star-inserted]:nth-child(6)"
  //   )
  //   .then((dom) => console.log(dom, "dom"));
})();
