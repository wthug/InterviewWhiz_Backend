const express = require("express");
const router = express.Router();
const {
  loginUser,
  signupUser,
  logout,
  updateProfile,
  checkAuth,
} = require("../controllers/userController");
const requireAuth = require("../middleware/auth.middleware");

//login
router.post("/login", loginUser);

//signup
router.post("/signup", signupUser);

//logout
router.post("/logout", logout);

//update profile
router.put("/update-profile", requireAuth, updateProfile);

//checkAuth
router.post("/check", requireAuth, checkAuth);

module.exports = router;
