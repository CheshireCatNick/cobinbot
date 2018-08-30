'use strict';

const Cobinhood = require('./cobinhood');
const Wallet = require('./wallet');

class CobinhoodSimulator {

    // simulate: exchange process order
    processOrders() {
        /*
        this.orders.forEach(order => {
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
        });*/
    }

    // simulate: put order on order book
    makeOrder(order) {
        console.log(order);
        this.orders.push(order);
        return '' + this.orders.length;
    }

    // simulate: exchange maintain wallet
    getWallet() {
        return this.wallet;
    }

    constructor(subscribedPairs) {
        this.cobinhood = new Cobinhood(subscribedPairs);
        this.orderBooks = this.cobinhood.orderBooks;
        // simulate 
        this.wallet = new Wallet({ ETH: 100 });
        this.orders = [];
        // execute order every 500 ms
        setInterval(() => {
            this.processOrders();
        }, 500);
    }
}

module.exports = CobinhoodSimulator;