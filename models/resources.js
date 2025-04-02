const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  icon: String,
  link: String,
});

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
