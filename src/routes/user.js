const express = require("express");
const userRouter = express.Router();
const { signup } = require("../controllers/auth");

userRouter.post("/signin", (req, res) => {});

userRouter.post("/signup", signup);

module.exports = userRouter;
