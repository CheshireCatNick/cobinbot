'use strict';
const config = require('./config');
const TokenRefresher = require('./affair/token-refresher');
const TicketClaimer = require('./affair/ticket-claimer');
const CandyMachinePlayer = require('./affair/candy-machine-player');

const TAG = 'Candy Bot';

const tr = new TokenRefresher(config.token);
const tc = new TicketClaimer();
const cmp = new CandyMachinePlayer();

tc.claim(tr.token);
cmp.play(tr.token);
// claim ticket and play candy machine every 24h
setInterval(() => {
    tc.claim(tr.token);
    cmp.play(tr.token);
}, 24 * 60 * 60 * 1000);
