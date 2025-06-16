import dotenv from 'dotenv'
import nodemailer from 'nodemailer';

dotenv.config();

class MailManager {

    constructor(parameters) {
      
        this.transport = {
            sendEmail: true,
            host: "smtp.gmail.com",
            port: 587, //465 to SSL
            secure: false, // upgrade later with STARTTLS
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            },
        }

        this.from = process.env.MAIL_FROM_ADDRESS;
        this.fromName = process.env.MAIL_FROM_NAME;

    }

    async sendEmail(toEmail, toName, subject, html ) {

        // Create a transport. Replace with your own transport options.
        const transport = nodemailer.createTransport(this.transport);

        const info = await transport.sendMail(
            {
                from: this.fromName, // Header From:
                to: `${toName} <${toEmail}>`, // Header To:
                envelope: {
                from: this.from,
                to: [toEmail]
            },
            html: html,
            subject: subject
            //text: text
        });

        console.log("Envelope used:", info.envelope);
    }

}

const mail = new MailManager();

export {mail};