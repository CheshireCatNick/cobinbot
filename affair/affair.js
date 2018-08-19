'use strict';

const MailSender = require('../lib/mail-sender');

class Affair {

    handleErr(err) {
        console.log(err);
        process.exit(0);
    }
    
    constructor() {
        this.mailSender = new MailSender();
    }
}

module.exports = Affair;