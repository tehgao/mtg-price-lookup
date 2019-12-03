const puppeteer = require('puppeteer');
const axios = require('axios');


async function lookup(card, set, fmt) {
    var url;

    if(set === "") {
        url = `https://api.scryfall.com/cards/named?fuzzy=${card}`;
    } else {
        url = `https://api.scryfall.com/cards/named?fuzzy=${card}&set=${set.replace(/\s/g, "")}`;
    }

    let res = await axios.get(url);

    let image = await screencap(res.data.name, res.data.set_name, fmt);

    if(image) {
        return image;
    } else {
        return null;
    }
}

async function screencap(card, set, fmt) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(`https://www.mtggoldfish.com/price/${set.replace(" ", "+")}/${card.replace(" ", "+")}#${fmt}`, {waitUntil: 'domcontentloaded'});
    
    const priceInfo = await page.$('body > main > div.clearfix > div.price-card-important.price-card-main-left > div > div.price-card-name');

    let image = await priceInfo.screenshot().then((result) => {
        console.log(`Captured price info for ${card} from ${set}`);
        return result;
    }).catch(e => {
        console.log(`Failed to capture price info for ${card} from ${set}: ${e}`);
        return false;
    });

    await browser.close();

    return image;
}

module.exports.lookup = lookup;