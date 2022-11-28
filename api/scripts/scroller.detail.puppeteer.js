const puppeteer = require('puppeteer');

module.exports.test = async (username) => {
    const browser = await puppeteer.launch({headless: false});
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage();


    console.log(username, username)
  
    await page.goto(
      'https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event#scaling_an_element_via_the_wheel'
    );
    
    await page.waitForSelector('#sidebar-quicklinks')
    const elem = await page.$('#sidebar-quicklinks');
    const boundingBox = await elem.boundingBox();
    await page.mouse.move(
      boundingBox.x + boundingBox.width / 2, // x
      boundingBox.y + boundingBox.height / 2 // y
    );
    
    await page.mouse.wheel({deltaY: -100}, {delay: 10000000000000 });

  }
