const categoryRouter = require("express").Router();
const middleware = require("../utils/middleware");
const {
  addCategory,
  getCategoryList,
  getLeafCategories,
} = require("../controllers/category");

categoryRouter.post(
  "/add",
  middleware.verifySignIn,
  middleware.adminRoleRequired,
  middleware.upload.none(),
  addCategory
);

categoryRouter.get("/list", getCategoryList);

categoryRouter.get("/leaves", getLeafCategories);

module.exports = categoryRouter;
