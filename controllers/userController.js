const randString = require("../utils/randString");
const { sendMail } = require("../utils/sendEmail");
const { generateToken } = require("../utils/generateToken");
const { mailCache } = require("../cache/mailcache");
const cloudinary = require("../lib/cloudinary");
const validator = require("validator");
const User = require("../models/userModel");

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(400).json({ message: error.message });
  }
};

//signup user
const signupUser = async (req, res) => {
  // console.log(ry);
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("Email is not valid");
    }
    if (!validator.isStrongPassword(password)) {
      throw Error("Password not strong enough");
    }

    const exists = await User.findOne({ email });
    if (exists) {
      throw Error("Email already in use");
    }
    const uniqueString = randString();

    mailCache.set(uniqueString, { username, email, password });

    const status = await sendMail(email, uniqueString);
    // console.log("verification status", status);
    console.log(status);
    if (status) {
      res.status(200).json({ info: "verification mail sent" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ message: error.message });
  }
};

const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    console.log("Error in logout contoller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile Pic required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in logout contoller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateAtsScore = async (req, res) => {
  try {
    console.log(req.body);
    const { atsScore } = req.body;
    const userId = req.user._id;

    if (atsScore === undefined || isNaN(atsScore)) {
      return res
        .status(400)
        .json({ message: "ATS Score must be a valid number" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { atsScore },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error updating ATS score:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in logout contoller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  loginUser,
  signupUser,
  logout,
  checkAuth,
  updateProfile,
  updateAtsScore,
};
