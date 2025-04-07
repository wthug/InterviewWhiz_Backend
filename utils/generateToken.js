const jwt = require("jsonwebtoken");
const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  console.log(token);
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: false,
    secure: false,
    SameSite: "None",
    path: "/",
  });
  // res.cookie("testCookie", "testValue", {
  //   httpOnly: false, // So JavaScript can read it
  //   secure: false,
  //   path: "/",
  // });

  return token;
};

module.exports = { generateToken };
