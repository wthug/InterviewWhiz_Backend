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
    html: 

      `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #0062cc 0%, #0096ff 100%); padding: 30px 20px; text-align: center;">
      <div style="font-size: 28px; font-weight: bold; color: white; letter-spacing: 1px;">Interview <span style="color: #ffe74c;">Whiz</span></div>
      
    </div>
    
    <div style="padding: 30px 40px;">
      <h2 style="color: #0062cc; margin-top: 0;">Welcome to MockXpert!</h2>
      <p>Hello future interview champion,</p>
      <p>Thank you for joining MockXpert - your personal interview preparation assistant. We're excited to help you ace your next interview and land your dream job!</p>
      
      <div style="background-color: #f0f8ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #0096ff;">
        <strong>Did you know?</strong> Candidates who prepare with structured interview practice are 2.6x more likely to receive job offers.
      </div>
      
      <p>To get started with your interview preparation journey, please verify your email address:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="http://${addr}/api/verify/mail/${uniqueString}" style="display: inline-block; background: linear-gradient(135deg, #0062cc 0%, #0096ff 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 30px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 150, 255, 0.25);">Verify My Email</a>
      </div>
      
      <p>Once verified, you'll gain access to:</p>
      <ul>
        <li>Personalized interview questions based on your industry</li>
        <li>AI-powered feedback on your responses</li>
        <li>Expert tips from top hiring managers</li>
      </ul>
      
      <p>If you have any questions, our support team is ready to help you succeed!</p>
      
      <p>Best regards,<br>The MockXpert Team</p>
    </div>
    
    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eaeaea;">
      <div style="margin: 15px 0;">
        <a href="#" style="display: inline-block; margin: 0 8px; color: #0062cc; font-size: 20px; text-decoration: none;">📱</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #0062cc; font-size: 20px; text-decoration: none;">📘</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #0062cc; font-size: 20px; text-decoration: none;">📸</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #0062cc; font-size: 20px; text-decoration: none;">🐦</a>
      </div>
      <p style="margin: 5px 0;">MockXpert Inc.</p>
      <p style="margin: 5px 0;">Founded by navJyotish | Kamrej</p>
      <p style="margin: 5px 0;">&copy; 2025 MockXpert. All rights reserved.</p>
      <p style="margin: 5px 0;"><small>If you didn't sign up for MockXpert, please disregard this email.</small></p>
    </div>
  </div>
</div>
      `,
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
async function sendOTPEmail(email, OTP) {
  var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  var mailOptions = {
    from: "Interview Whiz",
    to: email,
    subject: 'INTERVIEW WHIZ PASSWORD RECOVERY',
    html: 
      `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">
    <div style="background: linear-gradient(135deg, #00466a 0%, #007bff 100%); padding: 25px 20px; text-align: center;">
      <div style="font-size: 28px; font-weight: bold; color: white; letter-spacing: 1px;">Interview <span style="color: #ffe74c;">Whiz</span></div>
      <img src="/api/placeholder/80/80" alt="Interview Whiz Logo" style="margin-top: 10px;" />
    </div>
    
    <div style="padding: 30px 40px;">
      <h2 style="color: #00466a; margin-top: 0;">Password Recovery</h2>
      
      <p style="font-size: 16px;">Hello,</p>
      
      <p style="font-size: 16px;">We received a request to reset your password. Use the following One-Time Password (OTP) to complete your password recovery procedure:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="background: linear-gradient(135deg, #00466a 0%, #007bff 100%); color: #fff; font-size: 28px; font-weight: bold; padding: 15px 25px; display: inline-block; border-radius: 6px; letter-spacing: 5px; box-shadow: 0 4px 6px rgba(0, 70, 106, 0.2);">${OTP}</div>
        <p style="margin-top: 15px; font-size: 14px; color: #666;">This OTP is valid for <strong>5 minutes</strong> only</p>
      </div>
      
      <div style="background-color: #f0f7ff; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #00466a;">
        <p style="margin: 0; font-size: 14px;"><strong>Security Tip:</strong> Never share this OTP with anyone, including Interview Whiz staff. Our team will never ask for your OTP.</p>
      </div>
      
      <p style="font-size: 16px;">If you didn't request this password reset, please ignore this email or contact our support team immediately.</p>
      
      <p style="font-size: 16px;">Best regards,<br>The Interview Whiz Team</p>
    </div>
    
    <div style="background-color: #f5f5f5; padding: 20px; text-align: center; color: #666; font-size: 14px; border-top: 1px solid #eaeaea;">
      <div style="margin: 15px 0;">
        <a href="#" style="display: inline-block; margin: 0 8px; color: #00466a; font-size: 20px; text-decoration: none;">📱</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #00466a; font-size: 20px; text-decoration: none;">📘</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #00466a; font-size: 20px; text-decoration: none;">📸</a>
        <a href="#" style="display: inline-block; margin: 0 8px; color: #00466a; font-size: 20px; text-decoration: none;">🐦</a>
      </div>
      <p style="margin: 5px 0;">Interview Whiz Inc.</p>
      <p style="margin: 5px 0;">Founded by Jyotish | Kamrej</p>
      <p style="margin: 5px 0;">&copy; 2025 Interview Whiz. All rights reserved.</p>
    </div>
  </div>
</div>
      `
  };

  try {
    await transport.sendMail(mailOptions);
    console.log("OTP sent successfully!");
    return true;
    
  } catch (err) {
    console.error("=> Nodemailer error:", err);
    throw new Error("Error sending mail");
    return false;
  }
}


module.exports ={ sendMail,sendOTPEmail};
