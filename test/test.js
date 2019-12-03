const cardprice = require('../cardprice');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();

describe('Card Price', function () {
    describe('lookup', function () {
        var test_data = [
            ['lightning bolt', 'alpha'],
            ['brazen borrower', 'throne of eldraine'],
            ['wear // tear', 'dragon\'s maze']
        ]

        test_data.forEach(function (data) {
            it(`correctly retrieves data for card ${data[0]} from set ${data[1]}`, function () {
                this.timeout(0);

                let output = cardprice.lookup(data[0], data[1], "paper");

                return output.should.be.fulfilled;
            });
        });
    });
});