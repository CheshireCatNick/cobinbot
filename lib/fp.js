'use strict';

// return [str(value), [element]]
Array.prototype.groupBy = function(f) {
    const o = {};
    Object(this).forEach(e => {
        const k = f(e);
        (k in o) ? o[k].push(e) : (o[k] = [e]);
    });
    const a = [];
    for (let k in o) {
        a.push([k, o[k]]);
    }
    return a;
};
// return an element in array
Array.prototype.maxBy = function(f) {
    return Object(this).reduce((a, b) => f(a) > f(b) ? a : b);
};
// return an element in array
Array.prototype.minBy = function(f) {
    return Object(this).reduce((a, b) => f(a) < f(b) ? a : b);
};
// return an element in array
Array.prototype.max = function() {
    return Object(this).reduce((a, b) => (a > b) ? a : b);
};
// return an element in array  
Array.prototype.min = function() {
    return Object(this).reduce((a, b) => (a < b) ? a : b);
};