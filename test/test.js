const cardprice = require('../cardprice');
const decklist = require('../decklist');

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var assert = chai.assert;

var fs = require("fs");

chai.use(chaiAsPromised);
chai.should();

describe.skip('Card Price', function () {
    describe('lookup', function () {
        var test_data = [
            ['lightning bolt', 'alpha'],
            ['brazen borrower', 'throne of eldraine'],
            ['wear // tear', 'dragon\'s maze'],
            ['lightning bolt', ''],
            ['Borrowing 100,000 Arrows', 'masters 25'],
            ['teferi, time raveler', '']
        ]

        test_data.forEach(function (data) {
            it(`correctly retrieves data for card ${data[0]} from set ${data[1]}`, function () {
                this.timeout(0);

                const output = cardprice.lookup(data[0], data[1], "paper");

                return output.should.be.fulfilled;
            });
        });
    });
});

describe('Decklist', function() {
    describe('Generate URLs', function() {
        it('should generate a modern league URL correctly', function() {
            const actual = decklist.get_url("modern league", "12/03/2019");
            const expected = "https://magic.wizards.com/en/articles/archive/mtgo-standings/modern-league-2019-12-03";

            assert.equal(actual, expected);
        });

        it('should deal with capitalizations', function() {
            const actual = decklist.get_url("Modern League", "12/03/2019");
            const expected = "https://magic.wizards.com/en/articles/archive/mtgo-standings/modern-league-2019-12-03";

            assert.equal(actual, expected);
        });
    });

    describe('Generate decklist images', function() {
        it('should generate a basic decklist image', function(done) {
            this.timeout(0);

            const img = decklist.get_deck_screenshot("sightwinner", "modern league", "12/03/2019");

            img.then(function(img) {
                fs.writeFile("decklist.png", img, function(err) {
                    if(err) {
                        done(err);
                    } else {
                        done();
                    }
                });
            });
        });

        it('should filter out numbers from usernames', function(done) {
            this.timeout(0);

            const img = decklist.get_deck_screenshot("deathnote1999", "modern league", "12/03/2019");

            img.then(function(img) {
                fs.writeFile("decklist.png", img, function(err) {
                    if(err) {
                        done(err);
                    } else {
                        done();
                    }
                });
            });
        });
    });
});