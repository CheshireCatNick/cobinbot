'use strict';

class BasicStrategy {

    // must have
    decide(orderBooks, wallet) {

        //console.log(orderBooks['ETH-USDT']);
        const order = {
            pair: 'ETH-USDT',
            // positive to buy ETH, negative to sell
            // amount of ETH
            amount: 1
        }
        return (Math.random() < 0.5) ? order : undefined;
    }
    constructor() {
        // must-have variable
        // period in second
        this.period = 3;
        this.subscribedPairs = [
            { name: 'ETH-USDT', precision: '1E-2' },
            { name: 'BTC-USDT', precision: '1E-1' }
        ];
        // user-defined variable



    }
}

module.exports = BasicStrategy;