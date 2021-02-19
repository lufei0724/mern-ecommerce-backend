const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../utils/config");

const generateHashPassword = async (password, next) => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    next(error);
  }
};

const signUp = async (req, res, next) => {
  try {
    const { password } = req.body;
    const hashPassword = await generateHashPassword(password, next);

    const newUser = new User({
      ...req.body,
      hashPassword,
    });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    next(error);
  }
};

const signIn = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const token = await genToken(user, next);
    const { firstName, lastName, username, email, role } = user;
    res.status(200).json({
      token,
      user: {
        firstName,
        lastName,
        username,
        email,
        role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const adminSignUp = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const hashPassword = await generateHashPassword(password, next);

    const newUser = new User({
      ...req.body,
      hashPassword,
      role: "admin",
    });

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    next(error);
  }
};

const genToken = async (user, next) => {
  try {
    return await jwt.sign({ _id: user._id }, config.JWT_SECRET, {
      expiresIn: "2h",
    });
  } catch (error) {
    next(error);
  }
};

const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = await jwt.verify(token, config.JWT_SECRET);
    req.userToken = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signUp,
  signIn,
  adminSignUp,
  verifyToken,
};
