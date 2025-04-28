const jwt = require("jsonwebtoken");

const createAccessToken = (id) => {
  return jwt.sign({ id }, process.env.SECRETKEY, { expiresIn: "15s" });
};

const createRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.SECRETREFRESHKEY, { expiresIn: "7d" });
};

module.exports = { createAccessToken, createRefreshToken };
