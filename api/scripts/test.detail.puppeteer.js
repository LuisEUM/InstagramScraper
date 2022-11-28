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
        timeout: 0
    });
    
    await page.setDefaultNavigationTimeout(0);

    const notifyBtn = await page.$x("//button[contains(., 'Only allow essential cookies')]");

    if (notifyBtn.length> 0) {
        await notifyBtn[0].click();
        console.log('Notification button clicked.')
    } else {
        console.log("No notification button to click.");
    }

    await page.type('input[name=username]', process.env.USERNAME_INSTAGRAM, { delay: 60 });
    await page.type('input[name=password]', process.env.PASSWORD_INSTAGRAM, { delay: 60 });

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


    const followers = await page.$eval(`a[href="/${username}/followers/"] > div > span`, element => element.textContent)
    const following = await page.$eval(`a[href="/${username}/following/"] > div > span`, element => element.textContent) 

    console.log(`Followers of ${username}: ${followers}`, ` ${username} is following to: ${following}`)

    console.log('Option 1 getting usernames clicking the followers button')
    const followersBtn = await page.$x("//div[contains(text(), ' followers')]/span");

    if (followersBtn.length > 0) {
        await followersBtn[0].evaluate(btn => btn.click());
        console.log( 'Followers button clicked')
    } 

    console.log( 'Wating for the popup')
    const popup ='div._aano'
    const scroller ='div._aano > div:nth-child(1)'

    await page.waitForSelector(popup);

    const usernamesHref='div._aano > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div > div > span > a'
    await page.waitForSelector(usernamesHref);

    const totalFollowersNumber = parseInt(followers.split(',').join('')) + 0
    console.log('Followers string transformed into Number', totalFollowersNumber)

    await scrapeInfiniteScrollItems(page, totalFollowersNumber, popup, usernamesHref, scroller);
    // const items = await scrapeInfiniteScrollItems(page, totalFollowersNumber, followersDialog, usernamesHref);
}


const scrapeInfiniteScrollItems = async (page, followers, selector, listSelector, scroller) => {
    console.log('Testing.... Wheel moved')



    let followersCounter = 0;
    let items  = [];



    while (followers >= followersCounter) {
        let box = await page.$(selector);
        let boundingBox = await box.boundingBox();
        let previousHeight = boundingBox.height;

        let scrollerBox = await page.$(scroller);
        let boundingScrollerBox = await scrollerBox.boundingBox();
        let previousboundingScrollerBox = boundingScrollerBox.height;

        await page.evaluate((previousHeight, selector, previousboundingScrollerBox, scroller) => {
            let selectioned = document.querySelector(selector)

            if(previousHeight <= previousboundingScrollerBox) {
                console.log('entro')
                selectioned.scrollTo(0, previousHeight);
                return
            }
        }, previousHeight, selector, previousboundingScrollerBox, scroller);    

        // await page.evaluate((previousHeight, selector, previousboundingScrollerBox) => {
        //     let selectioned = document.querySelector(selector)

        //     if(previousHeight <= previousboundingScrollerBox) {
        //         console.log('entro')
        //          selectioned.scrollTo(0, previousHeight);
        //          return
        //     }
        // }, previousHeight, selector, previousboundingScrollerBox);    

        console.log(followers, followersCounter, previousHeight, previousboundingScrollerBox)

        await page.waitForTimeout(5000);
        followersCounter++
        // await page.waitForFunction(boundingBox.height > previousHeight);
        // await new Promise((resolve) => setTimeout(resolve, 10000));
    }

    console.log('Testing... salio o no entro al bucle')


 //THIS IS THE ARRAY LIST WITH ALL THE ELEMENTS 
    items = await page.evaluate(listSelector => {
        return [...document.querySelectorAll(listSelector)].map(anchor => {
            const title = anchor.textContent.split('|')[0].trim();
            return `${title} - ${anchor.href}`;
        });
    }, listSelector);

    console.log(items.join('\n'));
    console.log('items', items, 'items Length', items.length, 'itemTargetCount', itemTargetCount)

    return items;
}







// while (followers >= followers) {
//     let previousHeight = boundingBox.height;

//     items = await page.evaluate(listSelector => {
//         return [...document.querySelectorAll(listSelector)].map(anchor => {
//             const title = anchor.textContent.split('|')[0].trim();
//             return `${title} - ${anchor.href}`;
//         });
//     }, listSelector);


//     console.log('THIS IS HAPPENING')

//     await page.evaluate((previousHeight, selector) => {
//         let selectioned = document.querySelector(selector)
//         selectioned.scrollTo(0, previousHeight);    
//     }, previousHeight, selector);    

//     followersCounter++
//     console.log(followersCounter, previousHeight)
//     await page.waitForFunction(boundingBox.height > previousHeight);
//     await new Promise((resolve) => setTimeout(resolve, 5000));

// }

// console.log('Testing... salio o no entro al bucle')





// console.log(items.join('\n'));
// console.log('items', items, 'items Length', items.length, 'itemTargetCount', itemTargetCount)

// return items;