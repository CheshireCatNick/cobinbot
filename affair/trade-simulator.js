'use strict';

const Cobinhood = require('../exchange/cobinhood');
const Wallet = require('../exchange/wallet');

class TradeSimulator {

    simulateTrade(order) {
        const isBuy = order.amount > 0;
        const amount = Math.abs(order.amount);
        const base = order.pair.split('-')[0];
        const quote = order.pair.split('-')[1];
        const quoteAmount = base * amount;
        // check price
        const orderBooks = this.cobinhood.orderBooks;

        // execute order
        if (isBuy) {
            if (this.wallet.withdraw(quote, quoteAmount)) {
                this.wallet.deposit(base, amount);
            }
        }
        else {
            if (this.wallet.withdraw(base, amount)) {
                this.wallet.deposit(quote, quoteAmount);
            }
        }
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

    constructor(strategy, initBalance) {
        this.strategy = strategy;
        this.initWallet = new Wallet(initBalance);
        this.wallet = new Wallet(initBalance);
        this.wallet.toString();
        this.cobinhood = new Cobinhood(strategy.subscribedPairs);
    }
}

module.exports = TradeSimulator;

const BasicStrategy = require('../strategty/basic-strategy');
const bs = new BasicStrategy();
const ts = new TradeSimulator(bs, { ETH: 100 });
setInterval(() => {
    ts.run();
    ts.wallet.toString();
}, bs.period * 1000);