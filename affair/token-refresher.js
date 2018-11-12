'use strict';

const RestClient = require('../lib/rest-client');
const fs = require('fs');
const Affair = require('./affair');
const Debug = require('../lib/debug');
const jwt = require('jsonwebtoken');
const config = require('../config');
const puppeteer = require('puppeteer');
require('../lib/fp');

const restClient = new RestClient('api.cobinhood.com', 443);
class TokenRefresher extends Affair {

    saveToken() {
        config.token = this.token;
        let configFile = "'use strict';\n\n";
        configFile += 'module.exports = {\n';
        for (let key in config) {
            configFile += `\t${key}: '${config[key]}',\n`;
        }
        configFile += '};\n';
        fs.writeFile('config.js', configFile, (err) => {
            if (err) {
                Debug.warning([this.TAG, 'Can not save config file.']);
            }
        });
    }

    getExpireTime() {
        const decodedToken = jwt.decode(this.token);
        const exp = decodedToken.exp;
        const now = new Date().valueOf();
        return exp * 1000 - now - TokenRefresher.earlierTime;
    }

    refresh() {
        restClient.post('/v1/account/refresh_token', 
            { 
                authorization: this.token,
                nonce: new Date().valueOf()
            }, 
            {}
        ).then((result) => {
            if (!result.success) {
                console.log(result)
                this.retryCount++;
                if (this.retryCount === TokenRefresher.maxRetryCount) {
                    return;
                }
                setTimeout(() => {
                    Debug.warning([this.TAG, 'Can not get refresh token. Retrying...']);
                    this.refresh();
                }, TokenRefresher.retryTime);
                return;
            }
            Debug.success([this.TAG, 'Successfully refresh token.']);
            //console.log(result.result.account.token);
            this.token = result.result.account.token;
            this.saveToken();
            setTimeout(() => {
                this.refresh();
            }, this.getExpireTime());
        }, super.handleErr);
    }

    async getToken() {
        if (config.useConfigToken) {
            return config.token;
        }
        const browser = await puppeteer.launch({
            //executablePath: 'google-chrome',
            headless: false, 
            args: ['--disable-notifications', '--start-fullscreen']
        });
        const page = await browser.newPage();
        await page.setViewport({
            width: 1366, 
            height: 768
        });
        await page.goto('https://cobinhood.com');
        console.log('Browser is opened');
        await page.keyboard.press('Escape');
        await page.waitFor(1000);
        await page.click('#desktop-header-login');
        await page.waitFor(1000);
         
        await page.type('input[name=email]', config.account, { delay: 100 });
        await page.type('input[name=password]', config.password, { delay: 100 });

        await page.waitForNavigation({timeout: 0});
        const cookies = await page.cookies();
        await browser.close();
        const token = getToken(cookies);
        console.log(token);
        function getToken(cookies) {
            for (let cookie of cookies) {
                if (cookie.name == 'Authorization') {
                    return cookie.value;
                }
            }
        }
        return token;              
    }

    async start() {
        this.token = await this.getToken();
        this.retryCount = 0;
        this.refresh();
    }

    constructor() {
        super();
        this.TAG = 'Token Refresher';
    }
}
// refresh token 10 mins earlier than expiration time
TokenRefresher.earlierTime = 10 * 60 * 1000;
TokenRefresher.maxRetryCount = 3;
// retry after 1 min
TokenRefresher.retryTime = 60 * 1000;
module.exports = TokenRefresher;

//const tr = new TokenRefresher();
//tr.saveToken();