const nodemailer = require('nodemailer');
const generateOTP = require('../utils/generateOTP');
const {sendOTPEmail} = require('../utils/sendEmail');
const User = require("../models/userModel");
const { otpCache} = require("../cache/mailcache");


const sendOtp= async(req,res )=> {
  const {email}= req.body
  const user = await User.findOne({email});
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const OTP = generateOTP();
  otpCache.set(email, {otp:OTP}  ,1000*60*5);

  // console.log(email)
  // console.log(OTP)
  try {
    
    const status = await sendOTPEmail(email, OTP);
    // console.log(status);
    if (status) {
      res.status(200).json({ info: "OTP mail sent" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
  }
  
};

const varifyOtp = async (req,res)=>{
  const {email,otp}=req.body
  
  try {
    const user = otpCache.get(email);
    if(!user) {
      return res.status(404).json({error:"OTP expired"});
    }
    console.log(user.otp)

    if(user.otp===otp){
      return res.status(200).json({message:"OTP varification successful"});
    }
    else return res.status(400).json({error:"Entre valid OTP"})
  } catch (err) {
    return res.status(400).json({error:err.message});
  }
};

const resetPassword = async(req,res) => {
  const {email,password} = req.body
  // console.log(password) 
  const user = await User.updatePassword( email, password);
  console.log(user)
  if (user) {
    res.status(201).send("Password updated successfully");
  } else {
    res.status(404).send("User not found");
  }
  
}

module.exports = {sendOtp,varifyOtp,resetPassword};