'use strict';
const config = require('./config');
const Cobinhood = require('node-cobinhood');

const cobinhood = new Cobinhood({ key: config.api_key, disableWS: true });
cobinhood.getOrderbook('ETH-USDT', '1E-2').then((orderBook) => {
    console.log(orderBook);
    console.log(orderBook.bids[0].price.toNumber(), orderBook.bids[orderBook.bids.length - 1].price.toNumber());


}, (err) => {
    console.log(err);
});
