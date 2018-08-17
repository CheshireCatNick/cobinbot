'use strict';

const RestClient = require('../lib/rest-client');

const restClient = new RestClient('api.cobinhood.com', 443);
class TokenRefresher {

    constructor(token) {
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
                    console.log('Can not get refresh token.');
                    return;
                }
                //console.log(result.result.account.token);
                this.token = result.result.account.token;
            });
        }, TokenRefresher.refreshPeriod);
    }
}
TokenRefresher.refreshPeriod = 30 * 1000;
module.exports = TokenRefresher;