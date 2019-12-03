const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs');

async function cardprice(card, set, fmt) {
    var url;

    if(set === "") {
        url = `https://api.scryfall.com/cards/named?fuzzy=${card}`;
    } else {
        url = `https://api.scryfall.com/cards/named?fuzzy=${card}&set=${set.replace(/\s/g, "")}`;
    }

    let res = await axios.get(url);

    let image = await screencap(res.data.name, res.data.set_name, fmt);

    if(image) {
        console.log('returning image');
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
        console.log(result);
        return result;
    }).catch(e => {
        console.log(`Failed to capture price info for ${card} from ${set}`);
        return false;
    });

    await browser.close();

    return image;
}

let output = cardprice("lightning bolt", "masters 25", "paper");

output.then(function(img) {
    fs.writeFile('test.png', img, function(e) {
        if(e) {
            console.log(e);
        }
    });
})

module.exports.cardprice = cardprice;