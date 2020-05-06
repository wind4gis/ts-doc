const puppeteer = require("puppeteer");
(async () => {
  const browser = await puppeteer.launch({
    // 是否运行浏览器无头模式(boolean)
    headless: false,
    // 是否自动打开调试工具(boolean)，若此值为true，headless自动置为fasle
    devtools: false,
    // 设置超时时间(number)，若此值为0，则禁用超时
    timeout: 20000
  });
  const page = await browser.newPage();
  await page.goto(
    "http://rap2-dev.weilaijishi.com/repository/editor?id=118&mod=392&itf=2387"
  );
  await page.waitForNavigation();

  //登录
  // await page.type("#username", "用户提供的用户名");
  // await page.type("#password", "用户提供的密码");

  // await page.click("#btn_login");

  const element = await page
    .waitForSelector(".InterfaceSummary .title")
    .then((dom: any) => console.log(dom));
})();
