'use strict';

const Cobinhood = require('../exchange/cobinhood');

class TradeSimulator {

    simulateTrade(order) {
        console.log(order);
    }

    run() {
        const orderBooks = this.cobinhood.orderBooks;
        console.log(orderBooks);
        // other trading information
        const order = this.strategy.decide(orderBooks);
        if (order !== undefined) {
            this.simulateTrade(order);
        }
    }

    constructor(strategy) {
        this.strategy = strategy;
        this.cobinhood = new Cobinhood(strategy.subscribedPairs);
    }
}

module.exports = TradeSimulator;

const BasicStrategy = require('../strategty/basic-strategy');
const bs = new BasicStrategy();
const ts = new TradeSimulator(bs);
setInterval(() => {
    ts.run();
}, bs.period * 1000);