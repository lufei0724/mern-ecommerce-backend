const express = require("express");
const userRouter = express.Router();
const {
  signUp,
  signIn,
  adminSignUp,
  verifyToken,
} = require("../controllers/auth");

const {
  validateSignUp,
  validateSignIn,
} = require("../validator/authValidator");

userRouter.post("/signin", validateSignIn, signIn);

userRouter.post("/signup", validateSignUp, signUp);

userRouter.post("/admin/signup", validateSignUp, adminSignUp);

userRouter.get("/profile", verifyToken, (req, res) => {
  res.status(200).json({ message: "User profile" });
});

module.exports = userRouter;
