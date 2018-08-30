'use strict';

const Debug = require('../lib/debug');
class Wallet {

    withdraw(asset, amount) {
        if (amount < 0) return false;
        if (this.balance[asset] === undefined) {
            return false;
        }
        else if (this.balance[asset] - amount >= 0) {
            this.balance[asset] -= amount;
            return true;
        }
        return false;
    }

    deposit(asset, amount) {
        if (amount < 0) return;
        if (this.balance[asset]) {
            this.balance[asset] += amount;
        }
        else {
            this.balance[asset] = amount;
        }
    }

    toString() {
        console.log('Your wallet:');
        for (let asset in this.balance) {
            console.log(`${asset}: ${this.balance[asset]}`);
        }
    }

    constructor(balance) {
        this.TAG = 'Wallet';
        if (balance === undefined) {
            Debug.warning([this.TAG, 'Balance undefined.']);
            process.exit(0);
        }
        this.balance = balance;
    }
}

module.exports = Wallet;