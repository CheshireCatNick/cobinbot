'use strict';
const Debug = require('../lib/debug');

const TAG = 'Basic Strategy';

class BasicStrategy {
    // must have
    onOrderMade(result) {
        if (result.status === 'success') {
            Debug.success([TAG, `Order is made: ${result.orderID}`]);
        }
        else {
            Debug.warning([TAG, 'Order Failed', result.msg]);
        }
    }
    // must have
    onOrderStateChanged(result) {
        console.log(result);
    }

    // must have
    decide(orderBooks, wallet) {
        // change return order to return 
        // [operations including make order, cancel order etc.]

        //console.log(orderBooks['ETH-USDT']);
        const order = {
            pair: 'ETH-USDT',
            // positive to buy ETH, negative to sell
            // amount of ETH
            amount: 1,
            price: 400,
            // things to do when order is made:
            onOrderMade: this.onOrderMade,
            onOrderStateChanged: this.onOrderStateChanged
        };
        return (Math.random() < 0.5) ? order : undefined;
    }
    constructor() {
        // must-have

        // must-have && user defined
        // period in second
        this.period = 3;
        this.subscribedPairs = [
            { name: 'ETH-USDT', precision: '1E-2' },
            { name: 'BTC-USDT', precision: '1E-1' }
        ];
        // user-defined



    }
}

module.exports = BasicStrategy;