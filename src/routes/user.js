const express = require("express");
const userRouter = express.Router();
const {
  signUp,
  signIn,
  adminSignUp,
  verifyToken,
} = require("../controllers/auth");

userRouter.post("/signin", signIn);

userRouter.post("/signup", signUp);

userRouter.post("/admin/signup", adminSignUp);

userRouter.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({ message: "User profile" });
});

module.exports = userRouter;
