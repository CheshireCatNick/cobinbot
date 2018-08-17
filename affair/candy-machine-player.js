'use strict';

const RestClient = require('../lib/rest-client');
const restClient = new RestClient('api.cobinhood.com', 443);

class CandyMiachinePlayer {
    play(token) {
        restClient.get('/v1/campaign/slot_machine/tokens?status=available', 
            { authorization: token }
        ).then((result) => {
            if (!result.success) {
                console.log('Cannot get ticket information.');
                return;
            }
            if (result.result.tokens === null) {
                console.log('No available ticket.');
                return;
            }
            let ticketNum = result.result.tokens.length;
            function request() {
                const header = {
                    'Content-Length': 2,
                    'authorization': token,
                    'nonce': new Date().valueOf()
                };
                restClient.post('/v1/campaign/slot_machine/play', header, '').then((r) => {
                    console.log(r);
                });
                ticketNum--;
                if (ticketNum > 0) {
                    setTimeout(requrest, 1000);
                }
            }
            setTimeout(requrest, 1000);
        });
    }
    constructor() {}
}
const config = require('../config');
const cmp = new CandyMiachinePlayer();
cmp.play(config.token);