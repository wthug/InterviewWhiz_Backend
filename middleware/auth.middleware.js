const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  try {
    console.log("Request path:", req.path);
    console.log("Cookies received:", req.cookies);
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized-No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized-Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden - Admins only" });
  }
  next();
};

module.exports = { requireAuth, isAdmin };
