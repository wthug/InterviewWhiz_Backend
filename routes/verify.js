const express = require('express');
const router = express.Router()
const mailVerify = require('../controllers/mailController');

router.get("/mail/:uniqueString", mailVerify)

module.exports = router