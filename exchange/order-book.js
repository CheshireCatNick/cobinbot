'use strict';

class OrderBook {

    getLowestAsk() {
        return this.getRaw().asks[0];
    }

    getHighestBid() {
        return this.getRaw().bids[0];
    }

    getRaw() {
        // create array version book
        const rawOrderBook = {
            asks: [],
            bids: []
        };
        for (let k in this.orderBook.asks) {
            rawOrderBook.asks.push(this.orderBook.asks[k]);
        }
        for (let k in this.orderBook.bids) {
            rawOrderBook.bids.push(this.orderBook.bids[k]);
        }
        rawOrderBook.asks.sort((a, b) => a.price - b.price);
        rawOrderBook.bids.sort((a, b) => b.price - a.price);
        //console.log(rawOrderBook);
        return rawOrderBook;
    }

    update(msg) {
        function parseSnapshot(raw) {
            return {
                priceKey: raw.price.toString(),
                data: {
                    price: raw.price.toNumber(),
                    count: raw.count,
                    size: raw.size.toNumber()
                }
            };
        }
        function parseUpdate(raw) {
            return {
                price: raw.price.toString(),
                countDiff: raw.countDiff,
                sizeDiff: raw.sizeDiff.toNumber()
            };
        }
        if (msg.snapshot) {
            msg.snapshot.bids.forEach((bid) => {
                const pBid = parseSnapshot(bid);
                this.orderBook.bids[pBid.priceKey] = pBid.data;
            });
            msg.snapshot.asks.forEach((ask) => {
                const pAsk = parseSnapshot(ask);
                this.orderBook.asks[pAsk.priceKey] = pAsk.data;
            });
        }
        else if (msg.update) {
            //console.log(msg.update);
            msg.update.bids.forEach((bid) => {
                const pBid = parseUpdate(bid);
                if (this.orderBook.bids[pBid.price]) {
                    this.orderBook.bids[pBid.price].count += pBid.countDiff;
                    this.orderBook.bids[pBid.price].size += pBid.sizeDiff;
                    if (this.orderBook.bids[pBid.price].count <= 0 ||
                        this.orderBook.bids[pBid.price].size <= 0) {
                            delete this.orderBook.bids[pBid.price];
                    }
                }
                else {
                    //console.log(pBid);
                    this.orderBook.bids[pBid.price] = {
                        price: parseFloat(pBid.price),
                        count: pBid.countDiff,
                        size: pBid.sizeDiff
                    };
                    //console.log(this.orderBook.bids[pBid.price]);
                }
            });
            msg.update.asks.forEach((ask) => {
                const pAsk = parseUpdate(ask);
                if (this.orderBook.asks[pAsk.price]) {
                    this.orderBook.asks[pAsk.price].count += pAsk.countDiff;
                    this.orderBook.asks[pAsk.price].size += pAsk.sizeDiff;
                    if (this.orderBook.asks[pAsk.price].count <= 0 ||
                        this.orderBook.asks[pAsk.price].size <= 0) {
                            delete this.orderBook.asks[pAsk.price];
                    }
                }
                else {
                    //console.log(pAsk);
                    this.orderBook.asks[pAsk.price] = {
                        price: parseFloat(pAsk.price),
                        count: pAsk.countDiff,
                        size: pAsk.sizeDiff
                    };
                    //console.log(this.orderBook.asks[pAsk.price]);
                }
            });
        }
    }

    constructor() {
        this.orderBook = {
            asks: {},
            bids: {}
        };
        
    }
}

module.exports = OrderBook;
