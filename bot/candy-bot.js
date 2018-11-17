'use strict';
const TokenRefresher = require('../affair/token-refresher');
const TicketClaimer = require('../affair/ticket-claimer');
const CandyMachinePlayer = require('../affair/candy-machine-player');
const COBPointClaimer = require('../affair/cob-point-claimer');
const CMTPointClaimer = require('../affair/cmt-point-claimer');

const TAG = 'Candy Bot';

const tr = new TokenRefresher();
const tc = new TicketClaimer();
const cmp = new CandyMachinePlayer();
const cc = new COBPointClaimer();
const cmt = new CMTPointClaimer();

(async () => {
    await tr.start();
    tc.claim(tr.token);
    cmp.play(tr.token);
    cc.claim(tr.token);
    cmt.claim(tr.token);
    // claim ticket and play candy machine every 24h
    setInterval(() => {
        tc.claim(tr.token);
        cmp.play(tr.token);
        cc.claim(tr.token);
        cmt.claim(tr.token);
    }, 24 * 60 * 60 * 1000);
})();

