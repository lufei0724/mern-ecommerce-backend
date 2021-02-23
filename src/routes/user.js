const userRouter = require("express").Router();
const User = require("../models/user");

userRouter.get("/all", async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});
module.exports = userRouter;
