'use strict';
// this simulator simulate behavior of a cobinhood exchange with real data
// only check price to execute orders, and order is always 'filled'
// (partially filled is not simulated)

const Cobinhood = require('./cobinhood');
const Wallet = require('./wallet');
const Debug = require('../lib/debug');

class CobinhoodSimulator {

    // simulate: exchange process order
    processMarketOrder(order) {
        const amount = Math.abs(order.amount);
        const base = order.pair.split('-')[0];
        const quote = order.pair.split('-')[1];
        const quoteAmount = base * amount;
        const isBuy = order.amount > 0;

        const orderBook = (isBuy) ? 
            this.cobinhood.orderBooks[order.pair].getRaw().asks :
            this.cobinhood.orderBooks[order.pair].getRaw().bids;
        let amount = Math.abs(order.amount);
        let k = 0;
        let costGain = 0;
        while (amount > 0) {
            const d = orderBook[k];
            if (amount > d.size) {
                amount -= d.size;
                costGain += d.size * d.price;
                k++;
                continue;
            }
            costGain += amount * d.price;
        }
        if (isBuy) {
            if (this.wallet.withdraw())
            this.wallet.deposit(order.amount);
            order.onOrderMade({

            });
            order.onOrderStateChanged({

            });
        }
        else if (!isBuy && this.wallet.withdraw()) {

        }





    }
    processLimitOrders() {
        this.orders.forEach((order, index, array) => {
            const isBuy = order.amount > 0;
            const amount = Math.abs(order.amount);
            const base = order.pair.split('-')[0];
            const quote = order.pair.split('-')[1];
            const quoteAmount = base * amount;
            // check price
            const orderBooks = this.cobinhood.orderBooks;
            console.log(order.price, orderBooks[order.pair].getLowestAsk());
            if ((isBuy && order.price < orderBooks[order.pair].getLowestAsk().price) ||
                (!isBuy && order.price > orderBooks[order.pair].getHighestBid().price)) {
                return;
            } 
            // execute order
            if (isBuy) {
                this.wallet.deposit(base, amount);
            }
            else {
                this.wallet.deposit(quote, quoteAmount);
            }
            order.onOrderStateChanged({
                status: 'filled'
            });
            array.splice(index, 1);
            Debug.success([this.TAG, `Execute order: ${order.ID}`]);
        });
    }

    // simulate: put order on order book
    makeOrder(order) {
        console.log('order', order);
        if (order.type === 'limit') {
            // check wallet balance
            const isBuy = order.amount > 0;
            const amount = Math.abs(order.amount);
            const base = order.pair.split('-')[0];
            const quote = order.pair.split('-')[1];
            const quoteAmount = order.price * amount;

            if ((isBuy && this.wallet.withdraw(quote, quoteAmount)) || 
                (!isBuy && this.wallet.withdraw(base, amount))) {
                order.ID = '' + this.orders.length;
                order.onOrderMade({
                    status: 'success',
                    orderID: order.ID
                })
                this.orders.push(order);
            }
            else {
                order.onOrderMade({
                    status: 'failed',
                    msg: 'Balance not enough.'
                });
            }
        }
        else if (order.type === 'market') {
            this.processMarketOrder(order);
        }    
    }

    // simulate: exchange maintain wallet
    getWallet() {
        return this.wallet;
    }

    constructor(subscribedPairs) {
        this.TAG = 'Cobinhood Simulator';
        this.cobinhood = new Cobinhood(subscribedPairs);
        this.orderBooks = this.cobinhood.orderBooks;
        // simulate 
        this.wallet = new Wallet({ ETH: 100, USDT: 30000 });
        this.orders = [];
        // execute order every 500 ms
        setInterval(() => {
            this.processLimitOrders();
        }, 500);
    }
}

module.exports = CobinhoodSimulator;