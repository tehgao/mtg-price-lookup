const discord = require('discord.js');
const client = new discord.Client();
const dotenv = require('dotenv');

const cardprice = require('./cardprice');
const decklist = require('./decklist');

function handle_prices(card, set, message) {
    message.channel.startTyping();
    if (!set) {
        set = "";
    }

    output = cardprice.lookup(card, set, "paper");

    output.then(function (img) {
        message.channel.send(new discord.Attachment(img, 'result.png'));
    });
    message.channel.stopTyping();
}

function handle_decklist(name, event, date, message) {
    message.channel.startTyping();

    output = decklist.get_deck_screenshot(name, event, date);

    output.then(function (img) {
        message.channel.send(new discord.Attachment(img, 'result.png'));
    });
    message.channel.stopTyping();
}

function print_help(message) {
    var usage = "```\n" + `MTGStonks bot version ${process.env.npm_package_version}\n` + "Usage:\n" + "  - Price lookup: !price <card>(; <set)\n" + "  - Decklist lookup: !decklist <username>'s deck from the <event> on <date in MM/DD/YYYY>\n" + "```";
}

client.on('ready', () => {
    console.log('Starting server now...');
});

client.on('message', message => {
    let match_price = message.content.match(/^\!price ([^;\n]+)(; (.+))?/);
    let match_decklist = message.content.match(/^\!decklist (.+)'s (?:deck)?list from the (.+) on (.+)$/)
    let match_help = message.content.match('!help');

    if (match_price) {
        let card = match_price[1];
        let set = match_price[3];

        handle_prices(card, set, message);
    } else if (match_decklist) {
        let name = match_decklist[1];
        let event = match_decklist[2];
        let date = match_decklist[3];

        handle_decklist(name, event, date, message);
    } else if (match_help) {
        print_help(message);
    }
});

dotenv.config();
client.login(process.env.TOKEN);