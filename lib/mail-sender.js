'use strict';
const config = require('../config');
const nodemailer = require('nodemailer');
const Debug = require('./debug');

class MailSender {

    send(msg) {
        const email = {
            to: config.email,
            subject: "Message from Candy Bot!",
            text: msg
        };
        this.transporter.sendMail(email, function(err, info){
            if (err)
                Debug.warning([this.TAG, err]);
            else {
                Debug.success([this.TAG, 'Email sent.']);
            }
        });
    }

    constructor() {
        this.TAG = 'Mail Sender';
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: config.email,
                pass: config.password
            }
        });
        //this.send('Mail Sender Created.');
    }
}
module.exports = MailSender;

//const ms = new MailSender();
