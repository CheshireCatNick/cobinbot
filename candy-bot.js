'use strict';
const config = require('./config');
const Debug = require('./lib/debug');
const TokenRefresher = require('./affair/token-refresher');
const TicketClaimer = require('./affair/ticket-claimer');

const TAG = 'Candy Bot';
/*
process.argv.forEach(args => {
    if (args === '-s') {
        swap(false);
    }
    else if (args === '-is') {
        swap(true);
    }
    else if (args === '-l1') {
        laBar(1);
    }
    else if (args === '-l2') {
        laBar(2)
    }
});
*/

const tr = new TokenRefresher(config.token);
const tc = new TicketClaimer();

// claim ticket every 24h
setInterval(() => {
    Debug.info([TAG, 'Claiming ticket.']);
    tc.claim(tr.token);
}, 24 * 60 * 60 * 1000);

setInterval(() => {
    Debug.info([TAG, tr.token]);
}, 30 * 1000);