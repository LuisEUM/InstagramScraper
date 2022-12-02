const puppeteer = require('puppeteer');

module.exports.followers = async (usernameList) => {
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


    for await (let user of usernameList) {
        try {
            await Promise.all([
                page.waitForNavigation(), // The promise resolves after navigation has finished
                await page.goto(`https://www.instagram.com/${user}`, { waitUntil: "networkidle2" }),
                console.info(`searching username ${user}`)
            ]);

            try {
                // await page.waitForSelector(`a[href="/${user}/followers/"] > div > span`);
                const followers = await page.$eval(`a[href="/${user}/followers/"] > div > span`, element => element.textContent)
                console.info(`Followers of ${user}: ${followers}`)

                const totalFollowersNumber = parseInt(followers.split(',').join('')) + 0 
                console.info('Followers string transformed into Number', totalFollowersNumber)
                let userData = {
                    username: user,
                    totalFollowers: totalFollowersNumber,
                    private: false,
                    url: `https://www.instagram.com/${user}`
                } 
                console.log(userData)

                data.push(userData)
                console.log(data)

            } catch (error) {console.error(error);}

            try {
                // await page.waitForSelector(`ul.x78zum5 > li:nth-child(2) > div > span > span`);
                const privateAccount = await page.$eval(`ul.x78zum5 > li:nth-child(2) > div > span > span`, element => element.textContent)
                console.info(`Followers of ${user}: ${privateAccount}`)
                
                const totalFollowersNumber = parseInt(privateAccount.split(',').join('')) + 0
                console.info('Followers string transformed into Number', totalFollowersNumber)

                let userData = {
                    username: user,
                    totalFollowers: totalFollowersNumber,
                    private: true,
                    url: `https://www.instagram.com/${user}`
                } 

                console.log(userData)

                data.push(userData)
                console.log(data)

            } catch (error) {console.error(error);}


        } catch (error) {console.error(error);}
    }

    console.log(data)
    await browser.close();

    return [...data]
}
