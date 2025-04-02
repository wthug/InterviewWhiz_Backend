// const jwt = require("jsonwebtoken");
const generateOTP = () => {
    const OTP = () => Math.floor(1000 + Math.random() * 9000);
    return OTP();
}

module.exports = generateOTP;
