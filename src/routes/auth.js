const authRouter = require("express").Router();
const { signUp, signIn, adminSignUp } = require("../controllers/auth");

const {
  validateSignUp,
  validateSignIn,
} = require("../validator/authValidator");

authRouter.post("/signin", validateSignIn, signIn);

authRouter.post("/signup", validateSignUp, signUp);

authRouter.post("/admin/signup", validateSignUp, adminSignUp);

module.exports = authRouter;
