const puppeteer = require('puppeteer');

async function screencap(url, locator) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.goto(url, {waitUntil: 'domcontentloaded'});
    
    const priceInfo = await page.$(locator);

    let image = await priceInfo.screenshot().then((result) => {
        return result;
    }).catch(e => {
        console.log(`Failed to capture ${locator} at url ${url}: ${e}`);
        return false;
    });

    await browser.close();

    return image;
}

module.exports.screencap = screencap;