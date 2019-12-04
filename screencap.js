const puppeteer = require('puppeteer');

async function screencap(url, locator, waitForSelector) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    await page.setViewport({
        width: 1920,
        height: 1080,
    });

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const priceInfo = await page.$(locator);
    if (waitForSelector) {
        await page.waitForSelector(waitForSelector);
        await page.waitFor(500);
    }

    let image = await priceInfo.screenshot().then((result) => {
        return result;
    }).catch(e => {
        console.log(`Failed to capture ${locator} at url ${url}: ${e}`);
        return false;
    });

    await browser.close();

    return image;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports.screencap = screencap;