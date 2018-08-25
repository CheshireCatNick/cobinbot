'use strict';
const TokenRefresher = require('./affair/token-refresher');
const TicketClaimer = require('./affair/ticket-claimer');
const CandyMachinePlayer = require('./affair/candy-machine-player');

const TAG = 'Bot';

const tr = new TokenRefresher();
const tc = new TicketClaimer();
const cmp = new CandyMachinePlayer();

tc.claim(tr.token);
cmp.play(tr.token);
// claim ticket and play candy machine every 24h
setInterval(() => {
    tc.claim(tr.token);
    cmp.play(tr.token);
}, 24 * 60 * 60 * 1000);