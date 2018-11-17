'use strict';

const Affair = require('./affair');
const RestClient = require('../lib/rest-client');
const restClient = new RestClient('api.cobinhood.com', 443);
const Debug = require('../lib/debug');

class CMTPointClaimer extends Affair {
    
    notify() {
        let msg = 'This is a message from ' + this.TAG + '.\n\n';
        msg += `CMT points claimed. Total: ${this.claimedPoint}`;
        this.mailSender.send(msg);
    }

    claim(token) {
        const header = {
            authorization: token,
            nonce: new Date().valueOf(),
            'Content-Length': 2,
        };
        restClient.post('/v1/user/points/CMT',
            header,
            ''
        ).then((result) => {
            //console.log(result);
            if (!result.success) {
                Debug.warning([this.TAG, 'Can not claim CMT points.']);
                return;
            }
            else {
                Debug.success([this.TAG, 'CMT points claimed.']);
                this.claimedPoint = result.result.point.total;
                this.notify();
            }
        }, super.handleErr);
    }
    constructor() {
        super();
        this.TAG = 'CMT Point Claimer';
    }
}

module.exports = CMTPointClaimer;

//const config = require('../config');
//const tc = new TicketClaimer();
//tc.claim(config.token);