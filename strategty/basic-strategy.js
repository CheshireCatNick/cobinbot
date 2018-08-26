'use strict';

class BasicStrategy {

    // must have
    decide(orderBooks) {

        //console.log(orderBooks['ETH-USDT']);
        const order = {
            pair: 'ETH-USDT',
            // positive to buy ETH, negative to sell
            amount: 1
        }
        return (Math.random() < 0.5) ? order : undefined;
    }
    constructor() {
        // must-have variable
        // period in second
        this.period = 3;
        this.subscribedPairs = [
            { symbol: 'ETH-USDT', precision: '1E-2' },
            { symbol: 'BTC-USDT', precision: '1E-1' }
        ];
        // user-defined variable



    }
}

module.exports = BasicStrategy;