'use strict';

const Affair = require('./affair');
const RestClient = require('../lib/rest-client');
const Debug = require('../lib/debug');
const Cobinhood = require('node-cobinhood');
const restClient = new RestClient('api.cobinhood.com', 443);

class CandyMiachinePlayer extends Affair {

    notify() {
        let msg = 'This is a message from ' + this.TAG + '.\n\n';
        msg += 'You won the following rewards:\n';
        this.rewards.forEach(reward => {
            msg += `1 ${reward.reward} = ${reward.price} ETH\n`;            
        });
        this.mailSender.send(msg);    
    }

    getPricePromise(pair) {
        return new Promise((resolve, reject) => {
            this.cobinhood.getOrderbook(pair + '-ETH').then((orderBook) => {
                const highestBid = orderBook.bids[0].price.toNumber();
                Debug.success([
                    this.TAG, 
                    `Successfully got reward: ${pair}, price: ${highestBid} ETH`
                ]);
                resolve({ reward: pair, price: highestBid });
            }, (err) => {
                console.log(err);
                resolve({ reward: pair, price: 'Unknown' });
            });
        });
    }

    requestReward(token, ticketNum) {
        const header = {
            'Content-Length': 2,
            'authorization': token,
            'nonce': new Date().valueOf()
        };
        restClient.post('/v1/campaign/slot_machine/play', header, '').then((result) => {
            //console.log(result);
            if (!result.success) {
                Debug.warning([this.TAG, 'Can not play candy machine.']);
                return;
            }
            const reward = result.result.reward;
            this.rewards.push(this.getPricePromise(reward));
            if (ticketNum - 1 > 0) {
                setTimeout(() => {
                    this.requestReward(token, ticketNum - 1);   
                }, 1000);
            }
            else {
                Promise.all(this.rewards).then((result) => {
                    this.rewards = result;
                    this.notify()
                });
            }
        });
    }

    play(token) {
        restClient.get('/v1/campaign/slot_machine/tokens?status=available', 
            { authorization: token }
        ).then((result) => {
            if (!result.success) {
                Debug.warning([this.TAG, 'Cannot get ticket information.']);
                return;
            }
            if (result.result.tokens === null) {
                Debug.info([this.TAG, 'No available ticket.']);
                return;
            }
            this.rewards = [];
            setTimeout(() => {
                this.requestReward(token, result.result.tokens.length);
            }, 1000);
        });
    }
    constructor() {
        super();
        this.TAG = 'Candy Machine Player';
        this.cobinhood = new Cobinhood({
            key: '',
            disableWS: true
        });
    }
}

module.exports = CandyMiachinePlayer;

//const config = require('../config');
//const cmp = new CandyMiachinePlayer();
