const User = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");

const isEmailFound = async (email) => {
  const user = await User.findOne({
    email,
  });
  if (user) return true;
  return false;
};

const validateSignUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (validator.isEmpty(username)) throw new Error("Name is required.");

    if (validator.isEmpty(email)) throw new Error("Email is required.");

    if (!validator.isEmail(email)) throw new Error("Email is invalid.");

    if (validator.isEmpty(password)) throw new Error("Password is required.");

    if (!validator.isLength(password, { min: 6 }))
      throw new Error("Password must be at least 6 characters.");

    const emailFound = await isEmailFound(email);
    if (emailFound) throw new Error("Email is already in use.");
  } catch (error) {
    next(error);
  }

  next();
};

const authenticate = async (email, password) => {
  const user = await User.findOne({
    email,
  });

  return await bcrypt.compare(password, user.hashPassword);
};

const validateSignIn = async (req, res, next) => {
  const { email = "", password = "" } = req.body;

  try {
    if (validator.isEmpty(email)) throw new Error("Email is required.");

    const emailFound = await isEmailFound(email);
    if (!emailFound) throw new Error("Email is not found.");

    if (validator.isEmpty(password)) throw new Error("Password is required.");

    const correctPassword = await authenticate(email, password);
    if (!correctPassword) throw new Error("Password is not correct.");
  } catch (error) {
    next(error);
  }

  next();
};

module.exports = {
  validateSignUp,
  validateSignIn,
};
