const nodemailer = require('nodemailer');

async function sendMail(email, uniqueString) {

    /// returns true if sending mail is successful
    let status = false;

    var transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        service: "Gmail",
        auth: {
            user: process.env.MAIL,
            pass: process.env.PASS
        }
    })

    var mailOptions
    let addr = process.env.IP
    let sender = "Yash Sojitra"
    mailOptions = {
        from: sender,
        to: email,
        subject: "verification email",
        html: `Press <a href="http://${addr}/api/verify/mail/${uniqueString}">here</a> to verify your email`
    }

    await transport.sendMail(mailOptions, (err, res) => {

        if (err) {
            console.log("=>nodemailer err", err);
            throw Error("Error sending Mail");
        } else {
            console.log("mail sent");
            status = true
        }
    })
    return status

}

module.exports = sendMail