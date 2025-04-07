const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

//user schema
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: "",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  resumeUrl: {
    type: String, // Store the path to the resume file
    default: null,
  },
  atsScore: {
    type: Number,
    default: 0,
  },
});

//static signup method
userSchema.statics.signup = async function (username, email, password) {
  //validation
  if (!username || !email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  //confirming no duplicates
  const exists = await this.findOne({ email });
  if (exists) {
    throw Error("Email already in use");
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  //creating user
  const user = await this.create({
    username,
    email,
    password: hash,
  });
  return user;
};

userSchema.statics.updatePassword = async function (email, password) {
  //validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  //confirming no duplicates
  const exists = await this.findOne({ email });
  if (!exists) {
    throw Error("Enter valid credentials");
  }

  //hashing password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  //creating user
  const user = await this.findByIdAndUpdate(exists._id, { password: hash });
  return user;
};

//static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect Email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("incorrect password");
  }
  return user;
};

module.exports = mongoose.model("User", userSchema);
