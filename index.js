const discord = require('discord.js');
const client = new discord.Client();
const dotenv = require('dotenv');

const cardprice = require('./cardprice');

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    var matches = message.content.match(/\!price ([^;\n]+)(; (.+))?/);
    if (matches) {
        message.channel.startTyping();
        var card = matches[1];
        var set = matches[3];

        if(!set) {
            set = "";
        }

        output = cardprice.lookup(card, set, "paper");

        output.then(function(img) {
            message.channel.send(new discord.Attachment(img, 'result.png'));
        });
        message.channel.stopTyping();
    }
});

dotenv.config();
client.login(process.env.TOKEN);