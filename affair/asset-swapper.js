'use strict';

const Cobinhood = require('node-cobinhood');
const Affair = require('./affair');

class AssetSwapper extends Affair {

    getSwapPrice(orderBook) {
        const highestBid = orderBook.bids[0].price.toNumber();
        const lowestAsk = orderBook.asks[0].price.toNumber();
        console.log('highest bid = ', highestBid);
        console.log('lowest ask = ', lowestAsk);
        const spread = lowestAsk - highestBid;
        if (spread < AssetSwapper.SAFE_SPREAD) {
            super.handleErr('Spread size too small.');
        }
        return highestBid + spread / 2;
    }
    
    swap(key1, key2, isInverted) {
        const a1Cobinhood = new Cobinhood({ 
            key: (isInverted) ? key2 : key1, 
            disableWS: true 
        });
        const a2Cobinhood = new Cobinhood({ 
            key: (isInverted) ? key1 : key2, 
            disableWS: true 
        });
        
        a1Cobinhood.getOrderbook('ETH-USDT', '1E-2').then((orderBook) => {
            const price = this.getSwapPrice(orderBook);
            console.log('price = ', price);
            
            a1Cobinhood.placeLimitOrder('ETH-USDT', 'ask', '' + price, '' + AssetSwapper.SWAP_SIZE)
            .then((result) => {
                console.log(result.id, result.state);
                a2Cobinhood.placeLimitOrder('ETH-USDT', 'bid', '' + price, '' + AssetSwapper.SWAP_SIZE)
                .then((result) => {
                    console.log(result.id, result.state);
                }, super.handleErr)
            }, super.handleErr);
        }, super.handleErr);
    }

    constructor() {
        super();
    }
}
// must be greater than 0.01
AssetSwapper.SAFE_SPREAD = 0.1;
AssetSwapper.SWAP_SIZE = 0.07;

module.exports = AssetSwapper;