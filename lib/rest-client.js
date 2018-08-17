'use strict';
/**
* @description: Restful API client (JSON)
* @author: Nicky
*/
const Debug = require('./debug');
const https = require('https');
const TAG = 'RestClient';
class RestClient {
    // return an object if parsed successfully
    // otherwise, it will print raw reponse and return status code
    _makeRequest(option, dataStr) {
        return new Promise((resolve, reject) => {
            let req = https.request(option, (res) => {
                let result = '';
                res.on('data', (data) => {
                    result += data;
                });
                res.on('end', () => {
                    try {
                        const obj = JSON.parse(result);
                        resolve(obj);
                    }
                    catch (err) {
                        Debug.warning([TAG, 'Parse JSON failed', 'raw response is printed']);
                        Debug.warning(['Raw response', result]);
                        Debug.warning(['Error is', err]);
                        reject(res.statusCode);
                    }
                });
            });
            if (dataStr.length > 0) req.write(dataStr);
            req.end();
        });
    }
    get(path, header) {
        const option = {
            host: this.host,
            port: this.port,
            path: path,
            headers: Object.assign({}, RestClient.getHeader, header),
            method: 'GET'
        };
        return this._makeRequest(option, '');
    }
    post(path, header, data) {
        let dataStr = JSON.stringify(data);
        const option = {
            host: this.host,
            port: this.port,
            path: path,
            headers: Object.assign({}, RestClient.postHeader, header),
            method: 'POST'
        }
        return this._makeRequest(option, dataStr);
    }
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
}
RestClient.commonHeader = {
    'Content-Type': 'application/json',
    'Origin': 'https://cobinhood.com'    
};
RestClient.getHeader = Object.assign({}, 
    RestClient.commonHeader, {
    'Content-Length': 0
});
RestClient.postHeader = Object.assign({}, 
    RestClient.commonHeader, {
    'nonce': new Date().valueOf()
});
module.exports = RestClient;