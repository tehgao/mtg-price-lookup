const cardprice = require('./cardprice');
const fs = require('fs');

var name = "lightning bolt";
var set = "alpha";
var fmt = "paper";

let output = cardprice.lookup(name, set, fmt);

output.then(function(img) {
    fs.writeFile(`price-${name.replace(/\s/g,"")}-${set.replace(/\s/g,"")}.png`, img, function(e) {
        if(e) {
            console.log(e);
        }
    });
})