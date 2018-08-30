'use strict';

const Cobinhood = require('../exchange/cobinhood');
const CobinhoodSimulator = require('../exchange/cobinhood-simulator');

class Trader {

    run() {
        const orderBooks = this.cobinhood.orderBooks;
        console.log(orderBooks);
        // other trading information
        const order = this.strategy.decide(orderBooks, this.wallet);
        if (order !== undefined) {
            this.cobinhood.makeOrder(order);
        }
    }

    constructor(strategy, useSimulation) {
        this.strategy = strategy;
        //this.initWallet = new Wallet(initBalance);
        //this.wallet = new Wallet(initBalance);
        //this.wallet.toString();
        this.cobinhood = (useSimulation) ? 
            new CobinhoodSimulator(strategy.subscribedPairs) :
            new Cobinhood(subscribedPairs);

        this.wallet = this.cobinhood.getWallet();
    }
}

module.exports = Trader;

const BasicStrategy = require('../strategty/basic-strategy');
const bs = new BasicStrategy();
const t = new Trader(bs, true);
setInterval(() => {
    t.run();
    t.wallet.toString();
}, bs.period * 1000);