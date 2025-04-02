const express = require('express');
const {requireAuth} = require("../middleware/auth.middleware");
const {calculateATS, getOverallComments, getImprovementTips, uploadResume} = require('../controllers/resumeController');

const router = express.Router();
const fileUpload = require('express-fileupload');
router.use(fileUpload());
router.post('/ats-score', requireAuth, calculateATS);

router.post('/resume-feedback', requireAuth,  getOverallComments);

router.post('/resume-improvement-tips', requireAuth, getImprovementTips);

router.put('/upload-resume', requireAuth, uploadResume);

module.exports = router;