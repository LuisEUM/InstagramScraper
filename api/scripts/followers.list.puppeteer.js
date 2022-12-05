const puppeteer = require('puppeteer');

module.exports.followers = async (username) => {
    const data = []
    const browser = await puppeteer.launch({headless: false});
    const context = await browser.createIncognitoBrowserContext()
    const page = await context.newPage();

    await page.setExtraHTTPHeaders({
        'Accept-Language': 'en'
    });
    
    console.info('Loading Login Page')

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
        console.info('Notification button clicked.')
    } else {
        console.info("No notification button to click.");
    }

    await page.type('input[name=username]', process.env.USERNAME_INSTAGRAM, { delay: 60 });
    await page.type('input[name=password]', process.env.PASSWORD_INSTAGRAM, { delay: 60 });

    await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        await page.click('button[type=submit]', { delay: 20 }),
        console.info('waiting for submit')
    ]);

    console.info('You are logged now...')


    await Promise.all([
        page.waitForNavigation(), // The promise resolves after navigation has finished
        await page.goto(`https://www.instagram.com/${username}`, { waitUntil: "networkidle2" }),
        console.info(`searching username ${username}`)
    ]);

    //THIS ARE DIFERENTS WAYS TO GET THE ELEMENTHANDLE 
    // const followersBtn = await page.$('div[id=react-root] > section > main > div > header > section > ul > li:nth-child(2) > a');
    // const followersBtn = await page.$x("//div[contains(text(), ' followers')]/span");
    // const followersBtn = await page.$x('/html/body/div[1]/div/div/div/div[1]/div/div/div/div[1]/section/main/div/header/section/ul/li[2]/button/div ');


    const followers = await page.$eval(`a[href="/${username}/followers/"] > div > span`, element => element.title)
    // const following = await page.$eval(`a[href="/${username}/following/"] > div > span`, element => element.textContent) 

    console.info(`Followers of ${username}: ${followers}`)

    console.info('Option 1 getting usernames clicking the followers button')
    const followersBtn = await page.$x("//div[contains(text(), ' followers')]/span");

    if (followersBtn.length > 0) {
        await followersBtn[0].evaluate(btn => btn.click());
        console.info( 'Followers button clicked')
    } 

    console.info( 'Wating for the popup')
    const popup ='div._aano'
    const scroller ='div._aano > div:nth-child(1)'

    await page.waitForSelector(popup);

    const usernamesHref='div._aano > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div > div > span > a'
    await page.waitForSelector(usernamesHref);

    const totalFollowersNumber = parseInt(followers.split(',').join('')) + 0
    console.info('Followers string transformed into Number', totalFollowersNumber)
    
    data.totalFollowers = totalFollowersNumber

    const listOfFollowers = await scrapeInfiniteScrollItems(page, totalFollowersNumber, popup, usernamesHref, scroller);

    data.followers = listOfFollowers
    
    await browser.close();

    return data
}


const scrapeInfiniteScrollItems = async (page, followers, selector, listSelector, scroller) => {
    let followersCounter = 0;
    let checkingTheEnd = []


    while (followers >= followersCounter) {
        let scrollerBox = await page.$(scroller);
        let boundingScrollerBox = await scrollerBox.boundingBox();
        let previousboundingScrollerBox = boundingScrollerBox.height;


        let lastPreviousboundingScrollerBox = await page.evaluate(( selector, previousboundingScrollerBox) => {
            let selectioned = document.querySelector(selector)
                selectioned.scrollTo(0, previousboundingScrollerBox);
                return previousboundingScrollerBox 
        },  selector, previousboundingScrollerBox);     

        console.info('Loading more users...')
        
        followersCounter++

        await page.waitForTimeout(5000);

        lastPreviousboundingScrollerBox = await page.evaluate((selector) => {
            let selectioned = document.querySelector(selector)
            return selectioned.scrollTop;
        }, selector);  

        if(followersCounter % 2 === 0){
            if (checkingTheEnd[0] === lastPreviousboundingScrollerBox){
                break
            } else {
                checkingTheEnd[0] = lastPreviousboundingScrollerBox
            }
        }

        console.info("Number of Followers:", followers, "Loop Counter:", followersCounter, "Current:", previousboundingScrollerBox, "Current:", lastPreviousboundingScrollerBox)
    }

    console.info("You managed to escape from the loop and now you will obtained the list of links with all the followers")


    const listOfFollowers = await page.evaluate(listSelector => {
        return [...document.querySelectorAll(listSelector)].map(anchor => {
            // return `${anchor.href}`;
            const title = anchor.textContent.split('|')[0].trim();
            // return `${title} - ${anchor.href}`;
            return `${title}` 
        });
    }, listSelector);

    console.info(listOfFollowers.join('\n'));
    console.info('List of Followers:', listOfFollowers, 'Total of followers recoleted:', listOfFollowers.length)
    console.info("Done with the request, thanks for the patience...")

    return listOfFollowers;
}