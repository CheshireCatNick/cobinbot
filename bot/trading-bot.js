'use strict';

const Trader = require('../affair/trader');
const Strategy = require('../strategty/risk-control-strategy');

const s = new Strategy();
const t = new Trader(s, true);

setInterval(() => {
    t.run();
    //t.wallet.toString();
}, s.period * 1000);