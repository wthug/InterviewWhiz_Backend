const {mailCache} = require("../cache/mailcache");
const User = require("../models/userModel");

const mailVerify = async (req, res) => {
  const { uniqueString } = req.params;

  // const user = await User.findOne({ uniqueString });
  const { username, email, password } = mailCache.get(uniqueString);

  const user = await User.signup(username, email, password);
  console.log(user)
  if (user) {
    res.status(201).send("Account creation was successful");
  } else {
    res.status(404).send("User not found");
  }
};


module.exports = mailVerify;
