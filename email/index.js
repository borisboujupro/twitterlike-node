const nodemailer = require('nodemailer')
const nodemailerSparkpostTransporter = require('nodemailer-sparkpost-transport')
const path = require('path')
const ejs = require('ejs')

class Email{

    constructor(){
        this.from = 'Test Sender<noreply@test.com>'
        if(process.env.NODE_ENV === 'prod'){
            this.transporter = nodemailer.createTransport(nodemailerSparkpostTransporter({
                sparkPostApiKey : '',
                endpoint : 'https://api.eu.sparkpost.com'
            }))
        }else{
            this.transporter= nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: {
                  user: "68cdf65fa0f0b7",
                  pass: "dcb5ca6a133a2e"
                }
              })
        }
    }

    async sendEmailVerification(options){
        try {
            const email = {
                from : this.from,
                subject : 'Email Verification',
                to : options.to,
                html : await ejs.renderFile(path.join(__dirname,'templates/email-verification')+'.ejs', {
                    username : options.username,
                    url : `https://${options.host}/users/email-verify/${options.userId}/${options.emailToken}`
                })
            }
            this.transporter.sendMail(email)
        } catch (error) {
            throw error
        }
    }

    async sendEmailPasswordReset(options){
        try {
            const email = {
                from : this.from,
                subject : 'Email Verification',
                to : options.to,
                html : await ejs.renderFile(path.join(__dirname,'templates/email-password-reset')+'.ejs', {
                    username : options.username,
                    url : `https://${options.host}/users/reset-password/${options.userId}/${options.passwordToken}`
                })
            }
            this.transporter.sendMail(email)
        } catch (error) {
            throw error
        }
    }
}

module.exports = new Email()