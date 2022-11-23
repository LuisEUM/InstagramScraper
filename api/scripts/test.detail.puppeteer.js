const puppeteer = require('puppeteer');



module.exports.test = async (username) => {


    const browser = await puppeteer.launch({headless: false});
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage();

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en'
    });
    
    console.log('Loading Login Page')

    await page.goto('https://www.instagram.com/accounts/login', { 
        waitUntil: "networkidle2",
        slowMo: 50,
        devtools: true,
    });

    const notifyBtn = await page.$x("//button[contains(., 'Only allow essential cookies')]");

    if (notifyBtn.length> 0) {
        await notifyBtn[0].click();
        console.log('Notification button clicked.')
    } else {
        console.log("No notification button to click.");
    }

    await page.type('input[name=username]', process.env.USERNAME_INSTAGRAM, { delay: 20 });
    await page.type('input[name=password]', process.env.PASSWORD_INSTAGRAM, { delay: 20 });

    await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        await page.click('button[type=submit]', { delay: 20 }),
        console.log('waiting for submit')
    ]);

    console.log('You are logged now...')


    await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        await page.goto(`https://www.instagram.com/${username}`, { waitUntil: "networkidle2" }),
        console.log(`searching username ${username}`)
    ]);


    //THIS ARE DIFERENTS WAYS TO GET THE ELEMENTHANDLE 
    // const followersBtn = await page.$('div[id=react-root] > section > main > div > header > section > ul > li:nth-child(2) > a');
    // const followersBtn = await page.$x("//div[contains(text(), ' followers')]/span");
    // const followersBtn = await page.$x('/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/section/main/div/header/section/ul/li[2]/button/div ');

    // WITH THIS YOU CAN CLICK THE ELEMENTHANDLE
    //   if (followersBtn.length > 0) {
    //     await followersBtn[0].evaluate(btn => btn.click());
    // } 

    const followers = await page.$eval(`a[href="/${username}/followers/"] > div > span`, element => element.textContent)
    const following = await page.$eval(`a[href="/${username}/following/"] > div > span`, element => element.textContent)

    console.log(`Followers of ${username}: ${followers}`, ` ${username} is following to: ${following}`)

    const followersBtn = await page.$x("//div[contains(text(), ' followers')]/span");

    if (followersBtn.length > 0) {
        await followersBtn[0].evaluate(btn => btn.click());
        console.log( 'Followers button clicked')
    } 


    console.log('preparing scroller')
    // const followingList = '.notranslate';
    // await scrollDown(followingList, page);

    console.log( 'Wating for the popup')
    const usernamesHref='.notranslate'
    await page.waitForSelector(usernamesHref);
    // const followersList =  await page.$$(usernamesHref, element => element.textContent)
  
    // Extract the results from the page.
    const followersList = await page.evaluate(usernamesHref => {
        return [...document.querySelectorAll(usernamesHref)].map(anchor => {
          const title = anchor.textContent.split('|')[0].trim();
          return `${title} - ${anchor.href}`;
        });
      }, usernamesHref);
  
      // Print all the files.
      console.log(followersList.join('\n'));


}
