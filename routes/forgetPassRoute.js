const express = require("express");
const {sendOtp, verifyOtp, resetPassword} = require("../controllers/resetPass");
const { route } = require("./interviewRoutes");
const router = express.Router();

router.post("/sendotp", sendOtp);
router.post("/verifyotp",verifyOtp);
router.post("/updatepass",resetPassword);
module.exports = router;