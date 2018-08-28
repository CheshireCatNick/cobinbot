'use strict';

const CobinhoodClient = require('node-cobinhood');
const config = require('../config');
const RestClient = require('../lib/rest-client');
const OrderBook = require('./order-book');
const Debug = require('../lib/debug');

const TAG = 'Cobinhood';

class Cobinhood {
    
    setClientCallback() {
        this.client.on('open', () => {
            for (let pair of this.subscribedPairs) {
                this.client.subscribeOrderbook(pair.name, pair.precision, (msg) => {
                    this.orderBooks[pair.name].update(msg);
                }).then(() => {
                    Debug.success([TAG, `Successfully subscribed to ${pair.name}`]);
                }).catch((err) => {
                    Debug.warning([TAG, err]);
                    process.exit(0);
                });
            }
        });
    }

    constructor(subscribedPairs) {
        this.subscribedPairs = subscribedPairs;
        this.orderBooks = {};
        for (let pair of subscribedPairs) {
            this.orderBooks[pair.name] = new OrderBook();
        }
        this.client = new CobinhoodClient({
            'key': config.a1_api_key 
        });
        this.setClientCallback();
    }
}

module.exports = Cobinhood;

//const c = new Cobinhood();

