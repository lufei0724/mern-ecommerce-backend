const categoryRouter = require("express").Router();
const { verifySignIn, adminRoleRequired } = require("../utils/middleware");
const {
  initCategory,
  addCategory,
  getCategoryList,
} = require("../controllers/category");

categoryRouter.post("/init", initCategory);

categoryRouter.post("/add", verifySignIn, adminRoleRequired, addCategory);

categoryRouter.get("/list", getCategoryList);

module.exports = categoryRouter;
