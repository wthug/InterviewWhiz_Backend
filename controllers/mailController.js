const { mailCache } = require("../cache/mailcache");
const User = require("../models/userModel");

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
  } catch (err) {
    console.error("Error in mail verification:", err);
    res.status(500).send({ error: err.message });
  }
};

module.exports = mailVerify;
