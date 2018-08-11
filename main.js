'use strict';
const config = require('./config');
const Cobinhood = require('node-cobinhood');
const RestClient = require('./lib/rest-client');

// must be greater than 0.01
const SAFE_SPREAD = 0.1;
const SWAP_SIZE = 0.06;

function getSwapPrice(orderBook) {
    const highestBid = orderBook.bids[0].price.toNumber();
    const lowestAsk = orderBook.asks[0].price.toNumber();
    console.log('highest bid = ', highestBid);
    console.log('lowest ask = ', lowestAsk);
    const spread = lowestAsk - highestBid;
    if (spread < SAFE_SPREAD) {
        handleErr('Spread size too small.');
    }
    return highestBid + spread / 2;
}

function handleErr(err) {
    console.log(err);
    process.exit(0);
}

function laBar() {
    const restClient = new RestClient('api.cobinhood.com', 443);
    restClient.get('/v1/campaign/slot_machine/tokens?status=available', config.la_bar_api_key)
    .then((r) => {
        if (r.result.tokens === null) {
            console.log('No available ticket.');
            return;
        }
        for (let ticket of r.result.tokens) {
            console.log(ticket);
            const header = {
                'Content-Type': 'application/json',
                'Content-Length': 2,
                'authorization': config.la_bar_api_key,
                'nonce': new Date().valueOf(),
                'Origin': 'https://cobinhood.com'
            };
            restClient.post('/v1/campaign/slot_machine/play', header, '').then((r) => {
                console.log(r);
            }, handleErr);
        }

    }, handleErr);

}

function swap(isInverted) {
    const a1Cobinhood = new Cobinhood({ 
        key: (isInverted) ? config.a2_api_key : config.a1_api_key, 
        disableWS: true 
    });
    const a2Cobinhood = new Cobinhood({ 
        key: (isInverted) ? config.a1_api_key : config.a2_api_key, 
        disableWS: true 
    });
    
    a1Cobinhood.getOrderbook('ETH-USDT', '1E-2').then((orderBook) => {
        const price = getSwapPrice(orderBook);
        console.log('price = ', price);
        
        a1Cobinhood.placeLimitOrder('ETH-USDT', 'ask', '' + price, '' + SWAP_SIZE)
        .then((result) => {
            console.log(result.id, result.state);
            a2Cobinhood.placeLimitOrder('ETH-USDT', 'bid', '' + price, '' + SWAP_SIZE)
            .then((result) => {
                console.log(result.id, result.state);
            }, handleErr)
        }, handleErr);
    }, handleErr);
}

process.argv.forEach(args => {
    if (args === '-s') {
        swap(false);
    }
    else if (args === '-is') {
        swap(true);
    }
    else if (args === '-l') {
        laBar();
    }
});


