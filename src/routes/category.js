const categoryRouter = require("express").Router();
const middleware = require("../utils/middleware");
const { addCategory, getCategoryList } = require("../controllers/category");

categoryRouter.post(
  "/add",
  middleware.verifySignIn,
  middleware.adminRoleRequired,
  addCategory
);

categoryRouter.get("/list", getCategoryList);

module.exports = categoryRouter;
