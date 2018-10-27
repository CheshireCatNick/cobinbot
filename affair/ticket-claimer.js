'use strict';

const Affair = require('./affair');
const RestClient = require('../lib/rest-client');
const restClient = new RestClient('api.cobinhood.com', 443);
const Debug = require('../lib/debug');

class TicketClaimer extends Affair {
    
    notify() {
        let msg = 'This is a message from ' + this.TAG + '.\n\n';
        msg += 'Your daily ticket is claimed with 1 cob point.';
        this.mailSender.send(msg);
    }

    claim(token) {
        const header = {
            authorization: token,
            nonce: new Date().valueOf(),
            'Content-Length': 2,
        };
        restClient.post('/v1/campaign/events/cob-point/daily_special_ops',
            header,
            ''
        ).then((result) => {
            //console.log(result);
            if (!result.success) {
                Debug.warning([this.TAG, 'Can not claim ticket.']);
                return;
            }
            if (!result.result.redemption.redeemed) {
                Debug.info([this.TAG, 'Claimed before.']);
            }
            else {
                Debug.success([this.TAG, 'Ticket claimed.']);
                this.notify();
            }
        }, super.handleErr);
    }
    constructor() {
        super();
        this.TAG = 'Ticket Claimer';
    }
}

module.exports = TicketClaimer;

//const config = require('../config');
//const tc = new TicketClaimer();
//tc.claim(config.token);