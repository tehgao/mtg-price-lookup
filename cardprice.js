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

    let officialCard = res.data.name;

    var match = officialCard.match(/(.+) \/\//);
    if(match && res.data.layout === 'adventure') {
        officialCard = match[1];
    } else {
        officialCard = officialCard.replace(" // ", " ");
    }

    let officialSet = res.data.set_name;

    officialSet = officialSet.replace(/[^a-zA-Z0-9 ]/, "");

    let image = await screencap(officialCard, officialSet, fmt);

    if(image) {
        return image;
    } else {
        return null;
    }
}

async function screencap(card, set, fmt) {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();

    let url = `https://www.mtggoldfish.com/price/${set.replace(/[ ]/g, "+")}/${card.replace(/[, ]+/g, "+")}#${fmt}`;

    await page.goto(url, {waitUntil: 'domcontentloaded'});
    
    const priceInfo = await page.$('body > main > div.clearfix > div.price-card-important.price-card-main-left > div > div.price-card-name');

    let image = await priceInfo.screenshot().then((result) => {
        return result;
    }).catch(e => {
        console.log(`Failed to capture price info for ${card} from ${set}: ${e}`);
        return false;
    });

    await browser.close();

    return image;
}

module.exports.lookup = lookup;