var moment = require('moment');
var screencap = require('./screencap');

function get_deck_screenshot(user, event, date) {
    const url = get_url(event, date);
    const identifier = `#${user.replace(/[0-9]/g, "")}_-`.toLowerCase();

    console.log(`${url}, ${identifier}`);

    return screencap.screencap(url, identifier, `${identifier} > div.toggle-text.toggle-subnav > div.deck-list-img > div > img`);
    // return screencap.screencap(url, identifier);
}

function get_url(event, date) {
    // dumb american dates
    const parsed_date = moment(date, "MM-DD-YYYY");

    return `https://magic.wizards.com/en/articles/archive/mtgo-standings/${event.toLowerCase().replace(" ", "-")}-${parsed_date.format('YYYY-MM-DD')}`;
}

module.exports.get_url = get_url;
module.exports.get_deck_screenshot = get_deck_screenshot;