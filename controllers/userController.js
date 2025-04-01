const User = require("../models/user");
const randString = require("../utils/randString");
const sendMail = require("../utils/sendEmail");
const { generateToken } = require("../utils/generateToken");
const mailCache = require("../cache/mailcache");
const cloudinary = require("../lib/cloudinary");

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
    res.status(400).json({ error: error.message });
  }
};

//signup user
const signupUser = async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;

  const uniqueString = randString();

  mailCache.set(uniqueString, { username, email, password });

  try {
    // const user = await User.signup(
    //   username,
    //   email,
    //   password,
    //   uniqueString,
    //   isValid,
    // );
    const status = await sendMail(email, uniqueString);
    // console.log("verification status", status);
    console.log(status);
    if (status) {
      res.status(200).json({ info: "verification mail sent" });
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ error: error.message });
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

const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in logout contoller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { loginUser, signupUser, logout, checkAuth, updateProfile };
