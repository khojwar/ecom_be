
email --> Receiver (internet)

node receiver --> SMTP server (queue build)  --> receiver

from => email@gmail.com

## node mailer

--> To send mail

    npm i nodemailer

## mailtrap

## if you want to use your own gmail, you need following configurations in `.env` file

    SMTP_HOST=smtp.gmail.com
    SMTP_PROVIDER=smtp
    SMTP_PORT=587
    SMTP_USER=abc@gmail.com
    SMTP_PASSWROD=
    SMTP_FROM=abc@gmail.com


## gmail setup  (If you want to use your email)

* go to https://myaccount.google.com/security
* got to security
* configure the 2 step verification
* search for app passwords





## code Flow

![alt text](image.png)




`src/services/email.service.js`

   const nodemailer = require("nodemailer");
    const { SMTPConfig } = require("../config/config");

    class EmailService {
        #transport;

        constructor() {
            try {
                const config = {
                    host: SMTPConfig.host,
                    port: SMTPConfig.port,
                    auth: {
                        user: SMTPConfig.user,
                        pass: SMTPConfig.password,
                    },
                }

                if (SMTPConfig.provider === "gmail") {
                    config.service = "gmail";
                }
                
                this.#transport = nodemailer.createTransport(config);
                console.log("SMTP server connected successfully ...");
                
            } catch (exception) {
                console.log(exception);
                throw {message: "SMTP server connection failed ... ", status: "SMTP_CONNECTION_ERR" }
            }
        }

        sendEmail = async ({to, sub, msg, cc=null, bcc=null, attachments=null}) => {
            try {
                let msgBody ={
                    to: to,
                    from: SMTPConfig.from,
                    subject: sub,
                    html: msg,
                }

                if (cc) {
                    msgBody.cc = cc;
                }

                if (bcc) {
                    msgBody.bcc = bcc;
                }

                if (attachments) {
                    msgBody.attachments = attachments;
                }

                let response = await this.#transport.sendMail(msgBody);
                console.log({response});

                return response;
                
            } catch (exception) {
                console.log(exception);
                throw {message: "Email sending failed ... ", status: "EMAIL_SENDING_FAILED_ERR" }
            }
        }


    }

    const emailSvc = new EmailService();
    module.exports = emailSvc;



`src/modules/auth/auth.controller.js`

    await authServ.sendActivationNotification(data);



`src/modules/auth/auth.service.js`

    const nodemailer = require("nodemailer");
    const { SMTPConfig } = require("../config/config");

    class EmailService {
        #transport;

        constructor() {
            try {
                const config = {
                    host: SMTPConfig.host,
                    port: SMTPConfig.port,
                    auth: {
                        user: SMTPConfig.user,
                        pass: SMTPConfig.password,
                    },
                }

                if (SMTPConfig.provider === "gmail") {
                    config.service = "gmail";
                }
                
                this.#transport = nodemailer.createTransport(config);
                console.log("SMTP server connected successfully ...");
                
            } catch (exception) {
                console.log(exception);
                throw {message: "SMTP server connection failed ... ", status: "SMTP_CONNECTION_ERR" }
            }
        }

        sendEmail = async ({to, sub, msg, cc=null, bcc=null, attachments=null}) => {
            try {
                let msgBody ={
                    to: to,
                    from: SMTPConfig.from,
                    subject: sub,
                    html: msg,
                }

                if (cc) {
                    msgBody.cc = cc;
                }

                if (bcc) {
                    msgBody.bcc = bcc;
                }

                if (attachments) {
                    msgBody.attachments = attachments;
                }

                let response = await this.#transport.sendMail(msgBody);
                console.log({response});

                return response;
                
            } catch (exception) {
                console.log(exception);
                throw {message: "Email sending failed ... ", status: "EMAIL_SENDING_FAILED_ERR" }
            }
        }


    }

    const emailSvc = new EmailService();
    module.exports = emailSvc;


