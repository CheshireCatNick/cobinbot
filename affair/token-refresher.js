'use strict';

const RestClient = require('../lib/rest-client');
const Affair = require('./affair');
const Debug = require('../lib/debug');

const restClient = new RestClient('api.cobinhood.com', 443);
class TokenRefresher extends Affair {

    constructor(token) {
        super();
        this.TAG = 'Token Refresher';
        this.token = token;
        setInterval(() => {
            restClient.post('/v1/account/refresh_token', 
                { 
                    authorization: this.token,
                    nonce: new Date().valueOf()
                }, 
                {}
            ).then((result) => {
                console.log(result);
                if (!result.success) {
                    Debug.warning([this.TAG, 'Can not get refresh token.']);
                    return;
                }
                //console.log(result.result.account.token);
                this.token = result.result.account.token;
            }, super.handleErr);
        }, TokenRefresher.refreshPeriod);
    }
}
TokenRefresher.refreshPeriod = 30 * 1000;
module.exports = TokenRefresher;