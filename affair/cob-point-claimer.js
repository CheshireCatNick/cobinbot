'use strict';

const Affair = require('./affair');
const RestClient = require('../lib/rest-client');
const Debug = require('../lib/debug');

class COBPointClaimer extends Affair {

    notify(points) {
        let msg = 'This is a message from ' + this.TAG + '.\n\n';
        msg += 'You just claimed ' + points + ' cob points.';
        this.mailSender.send(msg);
    }

    claim(token) {
        const header = {
            authorization: token,
            nonce: new Date().valueOf(),
            'Content-Length': 2,
        };
        const restClient = new RestClient('api.cobinhood.com', 443);

        restClient.get('/v1/user/cob_points', { authorization: token }
          ).then((result) => {
            if (!result.success) {
                Debug.warning([this.TAG, 'Cannot get COB point information.']);
                return;
            }
            let points_to_be_claimed = 0
            points_to_be_claimed = result.result.to_be_claimed
            if (points_to_be_claimed == 0) {
                Debug.info([this.TAG, 'No COB Point to be claimed.']);
            } else {
                restClient.post('/v1/user/cob_points',
                    header,
                    ''
                ).then((result) => {
                    if (!result.success) {
                        Debug.warning([this.TAG, 'Can not claim cob points.']);
                        return;
                    }
                    if (result.result.point.to_be_claimed == 0) {
                        Debug.success([this.TAG, points_to_be_claimed + ' COB points claimed.']);
                        this.notify(points_to_be_claimed);
                    }
                }, super.handleErr);
            }
        });

    }
    constructor() {
        super();
        this.TAG = 'COB Point Claimer';
    }
}

module.exports = COBPointClaimer;
