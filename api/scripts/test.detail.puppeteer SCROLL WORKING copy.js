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

    console.log('Option 1 getting usernames clicking the followers button')
    const followersBtn = await page.$x("//div[contains(text(), ' followers')]/span");

    if (followersBtn.length > 0) {
        await followersBtn[0].evaluate(btn => btn.click());
        console.log( 'Followers button clicked')
    } 

    // console.log('Option 2 getting usernames with URL')

    // await Promise.all([
    //     page.waitForNavigation(), // The promise resolves after navigation has finished
    //     await page.goto(`https://www.instagram.com/${username}/followers`, { waitUntil: "networkidle2" }),
    //     console.log(`searching followers ${username}/followers`)
    // ]);


    console.log( 'Wating for the popup')
    const popup ='div._aano'
    await page.waitForSelector(popup)

    const usernamesHref='div._aano > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div > div > span > a'
    await page.waitForSelector(usernamesHref);

    const items = await scrapeInfiniteScrollItems(page, 100, popup, usernamesHref);


    // const followersList =  await page.$$(usernamesHref, element => element.textContent)
  
    // // Extract the results from the page.
    // const followersList = await page.evaluate(usernamesHref => {
    //     return [...document.querySelectorAll(usernamesHref)].map(anchor => {
    //       const title = anchor.textContent.split('|')[0].trim();
    //       return `${title} - ${anchor.href}`;
    //     });
    //   }, usernamesHref);
  
    //   // Print all the files.
    //   console.log(followersList.join('\n'));
}

// const scrapeInfiniteScrollItems = async (page, itemTargetCount, selector, listSelector) => {
//     console.log('Testing page...',page)
//     console.log('Testing itemTargetCount...',itemTargetCount)
//     console.log('Testing selector...',selector)
//     console.log('Testing listSelector...',listSelector)

//     let items  = [];

//     // while (itemTargetCount >= followersList.length) {
//     //     console.log('THIS IS HAPPENING')
//     //     followersList = await page.evaluate((listSelector) => {
//     //         return [...document.querySelectorAll(listSelector)].map(anchor => {
//     //             const title = anchor.textContent.split('|')[0].trim();
//     //             return `${title} - ${anchor.href}`;
//     //         });
//     //     }, listSelector);

//     while (itemTargetCount > items.length) {
//         items = await page.evaluate((listSelector) => {
//             console.log(listSelector)
//           const items = Array.from(document.querySelectorAll(listSelector));
//           console.log(items)
//           return items.map((item) => item.innerText);
//         }, listSelector);

//         let box = await page.$(selector);
//         const boundingBox = await box.boundingBox();
//         let previousHeight = boundingBox.height;
  
//         await page.evaluate((previousHeight, selector) => {
//             document.querySelector(selector).scrollTo(0, previousHeight);
//             window.scrollTo(0, previousHeight);

//             console.log(previousHeight, selector)
//         }, previousHeight, selector);

//         await page.waitForFunction(`${boundingBox.height} > ${previousHeight}` );
//         await new Promise((resolve) => setTimeout(resolve, 1000));
    
//         console.log('aqui')

//     }

//     return followersList;
//   }



const scrapeInfiniteScrollItems = async (page, itemTargetCount, selector, listSelector) => {
    console.log('Testing page...',page)
    console.log('Testing itemTargetCount...',itemTargetCount)
    console.log('Testing selector...',selector)
    console.log('Testing listSelector...',listSelector)
    let items  = [];

    while (itemTargetCount > items.length) {

        console.log('THIS IS HAPPENING')

        items = await page.evaluate(listSelector => {
            return [...document.querySelectorAll(listSelector)].map(anchor => {
                const title = anchor.textContent.split('|')[0].trim();
                return `${title} - ${anchor.href}`;
            });
        }, listSelector);
    
          // Print all the files.
        console.log(items.join('\n'));

        console.log('items', items, 'items Length', items.length, 'itemTargetCount', itemTargetCount)

        let box = await page.$(selector);
        const boundingBox = await box.boundingBox();
        let previousHeight = boundingBox.height;

        await page.evaluate((previousHeight, selector) => {
            let selectioned = document.querySelector(selector)
            console.log(selectioned)
            selectioned.scrollTo(0, previousHeight);
            window.scrollTo(0, previousHeight);
    
            console.log(previousHeight, selector)
        }, previousHeight, selector);    

        await page.waitForFunction(
            boundingBox.height >= previousHeight
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        console.log('aqui')

    }

    console.log('aqui followersList', followersList)

    return followersList;
}