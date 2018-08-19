'use strict';
const config = require('../config');
const nodemailer = require('nodemailer');

class MailSender {

    send(msg) {
        const email = {
            to: config.email,
            subject: "Message from Candy Bot!",
            text: msg
        };
        this.transporter.sendMail(email, function(err, info){
            if (err)
                console.log(err);
            else {
                console.log(info);
            }
        });
    }

    constructor() {
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
