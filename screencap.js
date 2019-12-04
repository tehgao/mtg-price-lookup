const puppeteer = require('puppeteer');

async function screencap(url, locator, waitForSelector) {
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();

    const defaultViewport = {
        height: 1920,
        width: 1080,
    };

    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const bodyHandle = await page.$('body');
    const boundingBox = await bodyHandle.boundingBox();
    const newViewport = {
        width: Math.max(defaultViewport.width, Math.ceil(boundingBox.width)),
        height: Math.max(defaultViewport.height, Math.ceil(boundingBox.height)),
    };
    await page.setViewport(newViewport);

    const priceInfo = await page.$(locator);
    if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { visible: true });
        await page.waitFor(1000);
    }

    let image = await priceInfo.screenshot().then((result) => {
        return result;
    }).catch(e => {
        console.log(`Failed to capture ${locator} at url ${url}: ${e}`);
        browser.close().then(function () {
            return false;
        });
    });

    await browser.close();

    return image;
}

module.exports.screencap = screencap;