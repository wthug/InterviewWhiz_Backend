const { mailCache } = require("../cache/mailcache");
const User = require("../models/userModel");
const validator = require("validator");

const mailVerify = async (req, res) => {
  try {
    const { uniqueString } = req.params;

    const cachedUser = mailCache.get(uniqueString);

    if (!cachedUser) {
      return res.status(404).send("Verification link expired or invalid");
    }

    const { username, email, password } = cachedUser;

    const user = await User.signup(username, email, password);
    console.log(user);

    if (user) {
      res.status(201).send("Account creation was successful");
    } else {
      res.status(500).send("Failed to create account");
    }
  } catch (error) {
    console.error("Error in mail verification:", error);
    res.status(400).json({ message: error.message });
  }
};

module.exports = mailVerify;
