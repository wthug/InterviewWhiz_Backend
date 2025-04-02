const express = require("express");
const {sendOtp, varifyOtp, resetPassword} = require("../controllers/resetPass");
const { route } = require("./interviewRoutes");
const router = express.Router();

router.post("/sendotp", sendOtp);
router.post("/varifyotp",varifyOtp);
router.post("/updatepass",resetPassword);
module.exports = router;