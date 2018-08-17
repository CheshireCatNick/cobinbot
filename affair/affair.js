'use strict';

class Affair {

    handleErr(err) {
        console.log(err);
        process.exit(0);
    }
    
    constructor(){}
}

module.exports = Affair;