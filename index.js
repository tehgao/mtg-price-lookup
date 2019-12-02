const webshot = require('webshot');
const axios = require('axios');

function cardprice(card, set, fmt) {
    if (set === "") {
        axios.get(`https://api.scryfall.com/cards/named?fuzzy=${card}`)
            .then(response => {
                screenshot(response.data.name, response.data.set_name, fmt);
            })
            .catch(error => {
                console.log(error);
            });
    } else {
        axios.get(`https://api.scryfall.com/cards/named?fuzzy=${card}&set=${set}`)
            .then(response => {
                screenshot(response.data.name, response.data.set_name, fmt);
            })
            .catch(error => {
                console.log(error);
            });
    }
}

function screenshot(card, set, fmt) {
    optionsSelector = {
        screenSize: {
            width: 1920, height: 1080
        },
        captureSelector: 'body > main > div.clearfix > div.price-card-important.price-card-main-left > div > div.price-card-name'
    };

    var found = card.match(/(.+) \/\/ (.+)/);
    if(found) {
        card = found[1];
        console.log(card);
    }

    webshot(`https://www.mtggoldfish.com/price/${set.replace(" ", "+")}/${card.replace(" ", "+")}#${fmt}`, `price_${card.replace(/\s/g, "_")}_${set.replace(/\s/g, "_")}.png`, optionsSelector, function (err) {
        if (!err) {
            console.log('Screenshot taken!');
        }
    });
}

cardprice("brazen borrower", "throne of eldraine", "paper");