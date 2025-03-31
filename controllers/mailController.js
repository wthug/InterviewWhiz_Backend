const User = require("../models/User");

const mailVerify = async (req, res) => {
  const { uniqueString } = req.params;

  const user = await User.findOne({ uniqueString });

  if (user) {
    user.isValid = true;
    await user.save();
    res.send("verification was successful");
  } else {
    res.send("User not found");
  }
};

module.exports = mailVerify;
