const NodeCache = require("node-cache");
const mailCache = new NodeCache();
const otpCache = new NodeCache();

module.exports = {mailCache,otpCache};
