const puppeteer = require("puppeteer");
const { recognize } = require("../recognize/index")

(async () => {
  const browser = await puppeteer.launch({
    // 是否运行浏览器无头模式(boolean)
    headless: false,
    // 是否自动打开调试工具(boolean)，若此值为true，headless自动置为fasle
    devtools: true,
    // 设置超时时间(number)，若此值为0，则禁用超时
    timeout: 20000
  });
  const page = await browser.newPage();
  // await page.setRequestInterception(true);
  // 订阅 reponse 事件，参数是一个 reponse 实体
  page.on("response", async function(response) {
    if (response.url().includes("captcha?t=")) {
      const svg = await response.text()
      // const code = recognize(svg)
      console.log('code');
    }
  });
  await page.goto(
    "http://rap2-dev.weilaijishi.com/repository/editor?id=118&mod=392&itf=2387"
  );
  await page.waitForNavigation();

  //登录
  await page.type("#username", "用户提供的用户名");
  await page.type("#password", "用户提供的密码");

  await page.click("#btn_login");

  const element = await page
    .waitForSelector(".InterfaceSummary .title")
    .then(dom => console.log(dom));
  console.log(text, "txt");
})();
