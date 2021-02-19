const User = require("../models/user");
const validator = require("validator");

const isEmailInUse = async (email) => {
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

    const emailInUse = await isEmailInUse(email);
    if (emailInUse) throw new Error("Email is already in use.");
  } catch (error) {
    next(error);
  }

  next();
};

module.exports = {
  validateSignUp,
};
