'use strict';

const Affair = require('./affair');
const RestClient = require('../lib/rest-client');
const Debug = require('../lib/debug');

const restClient = new RestClient('api.cobinhood.com', 443);

class CandyMiachinePlayer extends Affair {

    notify() {
        let msg = 'This is a message from ' + this.TAG + '.\n\n';
        msg += 'You won the following rewards:\n';
        this.rewards.forEach(reward => {
            msg += reward + '\n';            
        });
        console.log(msg);
        this.mailSender.send(msg);    
    }

    requestReward(token, ticketNum) {
        const header = {
            'Content-Length': 2,
            'authorization': token,
            'nonce': new Date().valueOf()
        };
        restClient.post('/v1/campaign/slot_machine/play', header, '').then((result) => {
            if (!result.success) {
                Debug.warning([this.TAG, 'Can not play candy machine.']);
                return;
            }
            const reward = result.result.reward;
            Debug.success([this.TAG, 'Successfully got reward: ' + reward]);
            this.rewards.push(reward);
            if (ticketNum > 0) {
                setTimeout(() => {
                    this.requestReward(token, ticketNum - 1);   
                }, 1000);
            }
            else {
                this.notify(rewards);
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
    }
}
//const config = require('../config');
//const cmp = new CandyMiachinePlayer();
//cmp.play(config.token);