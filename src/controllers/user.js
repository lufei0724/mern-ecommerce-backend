const User = require("../models/user");
const bcrypt = require("bcrypt");

const signup = async (req, res, next) => {
  try {
    const body = req.body;

    if (body.password.length === 0) {
      return res.status(400).json({
        error: `Password is required.`,
      });
    }

    const user = await User.findOne({
      email: body.email,
    });
    if (user) {
      return res.status(400).json({
        error: `Email already exists.`,
      });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(body.password, saltRounds);
    const newUser = new User({
      ...body,
      hashPassword,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
};
