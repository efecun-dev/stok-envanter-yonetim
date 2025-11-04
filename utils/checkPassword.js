const db = require("../config/database");
const User = require("../models/User");
const bcrypt = require("bcrypt");

exports.check = async (email, password) => {
  const [user] = await User.findByEmail(email);
  const auth = await bcrypt.compare(password, user.password);
  return auth;
};
