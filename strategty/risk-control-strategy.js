'use strict';
const Debug = require('../lib/debug');

const TAG = 'Risk Control Strategy';

class RiskControlStrategy {
    // must have
    onOrderMade(result) {
        if (result.status === 'success') {
            Debug.success([TAG, `Order is made: ${result.orderID}`]);
            this.hasUnfilledOrder = true;
        }
        else {
            Debug.warning([TAG, 'Order Failed', result.msg]);
        }
    }
    // must have
    onOrderStateChanged(result) {
        console.log(result);
        if (result.status === 'filled') {
            this.hasUnfilledOrder = false;
        }
    }
    // must have
    decide(orderBooks, wallet) {
        if (this.hasUnfilledOrder) {
            return;
        }
        wallet.toString();
        // change return order to return 
        // [operations including make order, cancel order etc.]
        const orderBook = orderBooks['ETH-USDT'];
        if (orderBook.getHighestBid() === undefined ||
            orderBook.getLowestAsk() === undefined) {
            return;
        }
        const price = (orderBook.getHighestBid().price + 
                        orderBook.getLowestAsk().price) / 2;
        console.log('price: ', price);
        const ratio = wallet.balance.ETH * price / wallet.balance.USDT;
        console.log('ratio: ', ratio);
        const order = {
            pair: 'ETH-USDT',
            type: 'market',
            onOrderMade: this.onOrderMade,
            onOrderStateChanged: this.onOrderStateChanged
        };
        if (ratio > 1 + this.threshold) {
            // sell ETH

            order.amount = -wallet.balance.ETH * (ratio - 1);
            order.price = orderBook.getHighestBid().price;
            return order;
        }
        else if (ratio < 1 - this.threshold) {
            // buy ETH
            // make market order
            order.amount = this.findBuyAmount(orderBook.getRaw().asks, wallet);
            return order;
        }
        return undefined;
    }
    findBuyAmount(asks, wallet) {
        let amount = 0;
        let ETH = wallet.balance.ETH;
        let USDT = wallet.balance.USDT;
        const price = asks[0].price;
        const ratio = ETH * price / USDT;
        let k = 0;
        // make ratio = 1
        while (true) {
            const d = asks[k];
            const needToBuy = (USDT - ETH * d.price) / (2 * d.price);
            if (needToBuy > d.size) {
                // buy all of d
                amount += d.size;
                USDT -= d.size * d.price;
                ETH += d.size;
                k++;
                continue;
            }
            amount += needToBuy;
            return amount;
        }
    }
    constructor() {
        // must-have

        // must-have && user defined
        // period in second
        this.period = 3;
        this.subscribedPairs = [
            { name: 'ETH-USDT', precision: '1E-2' }
        ];
        // user-defined
        this.threshold = 0.001;
        this.hasUnfilledOrder = false;




    }
}

module.exports = RiskControlStrategy;