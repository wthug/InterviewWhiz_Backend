const express = require("express");
const router = express.Router();
const mailVerify = require("../controllers/mailController");
// const sendEmail = require("../controllers/resetPass");

router.get("/mail/:uniqueString", mailVerify);
// router.post("/sendotp",sendEmail);
module.exports = router;
