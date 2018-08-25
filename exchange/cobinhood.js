'use strict';

const CobinhoodClient = require('node-cobinhood');
const config = require('../config');
const RestClient = require('../lib/rest-client');
const OrderBook = require('./order-book');

class Cobinhood {
    
    setClientCallback() {
        this.client.on('open', () => {
            this.client.subscribeOrderbook('ETH-USDT', '1E-2', (msg) => {
                this.orderBook.update(msg);
            });



        });
    }

    constructor() {
        this.orderBook = new OrderBook();
        this.client = new CobinhoodClient({
            'key': config.a1_api_key 
        });
        this.setClientCallback();
    }
}

const c = new Cobinhood();
setInterval(() => {
    console.log('la', c.orderBook.getLowestAsk());
    console.log('hb', c.orderBook.getHighestBid());
}, 3000);
