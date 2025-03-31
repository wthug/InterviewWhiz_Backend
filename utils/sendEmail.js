const nodemailer = require("nodemailer");

async function sendMail(email, uniqueString) {
  /// returns true if sending mail is successful
  let status = false;

  var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  var mailOptions;
  let addr = process.env.IP;
  let sender = "Interview Whiz";
  mailOptions = {
    from: sender,
    to: email,
    subject: "verification email",
    html: `Press <a href="http://${addr}/api/verify/mail/${uniqueString}">here</a> to verify your email`,
  };

  // await transport.sendMail(mailOptions, (err, res) => {

  //     if (err) {
  //         console.log("=>nodemailer err", err);
  //         throw Error("Error sending Mail");
  //     } else {
  //         console.log("mail sent");
  //         status = true
  //     }
  // })

  try {
    await transport.sendMail(mailOptions);
    console.log("Mail sent successfully!");
    status = true;
  } catch (err) {
    console.error("=> Nodemailer error:", err);
    throw new Error("Error sending mail");
  }

  return status;
}

module.exports = sendMail;
