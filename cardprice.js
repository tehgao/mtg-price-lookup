const puppeteer = require('puppeteer');
const axios = require('axios');
const screencap = require('./screencap');

async function lookup(card, set, fmt) {
    var url;

    if (set === "") {
        url = `https://api.scryfall.com/cards/named?fuzzy=${card}`;
    } else {
        url = `https://api.scryfall.com/cards/named?fuzzy=${card}&set=${set.replace(/\s/g, "")}`;
    }

    let res = await axios.get(url);

    let officialCard = res.data.name;

    var match = officialCard.match(/(.+) \/\//);
    if (match && res.data.layout === 'adventure') {
        officialCard = match[1];
    } else {
        officialCard = officialCard.replace(" // ", " ");
    }

    let officialSet = res.data.set_name;

    officialSet = officialSet.replace(/[^a-zA-Z0-9 ]/, "");

    let image = await get_price_data(officialCard, officialSet, fmt);

    if (image) {
        return image;
    } else {
        return null;
    }
}

function get_price_data(card, set, fmt) {
    const url = `https://www.mtggoldfish.com/price/${set.replace(/[ ]/g, "+")}/${card.replace(/[, ]+/g, "+")}#${fmt}`;
    const locator = 'body > main > div.clearfix > div.price-card-important.price-card-main-left > div > div.price-card-name';

    return screencap.screencap(url, locator);
}

module.exports.lookup = lookup;