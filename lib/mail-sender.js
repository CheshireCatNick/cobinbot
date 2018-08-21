'use strict';
const config = require('../config');
const nodemailer = require('nodemailer');
const Debug = require('./debug');

class MailSender {

    send(msg) {
        const email = {
            to: config.email_recv,
            subject: "Message from Candy Bot!",
            text: msg
        };
        const TAG = this.TAG;
        this.transporter.sendMail(email, function(err, info){
            if (err) {
                Debug.warning([TAG, err]);
            }
            else {
                Debug.success([TAG, 'Email sent.']);
            }
        });
    }

    constructor() {
        this.TAG = 'Mail Sender';
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email_send,
                pass: config.password
            }
        });
        //this.send('Mail Sender Created.');
    }
}
module.exports = MailSender;

//const ms = new MailSender();
