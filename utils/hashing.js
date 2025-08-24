const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

const hash_password = async (password) => {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(password, salt);
};

const compare_password = async (plain_password, hashed_password) => {
  return bcrypt.compare(plain_password, hashed_password);
};

const create_token = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "90d" });
};

const verify_token = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

module.exports = {
  hash_password,
  compare_password,
  create_token,
  verify_token,
};
