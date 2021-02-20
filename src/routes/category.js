const categoryRouter = require("express").Router();
const middleware = require("../utils/middleware");
const {
  initCategory,
  addCategory,
  getCategoryList,
} = require("../controllers/category");

categoryRouter.post("/init", initCategory);

categoryRouter.post("/add", middleware.verifySignIn, addCategory);

categoryRouter.get("/list", getCategoryList);

module.exports = categoryRouter;
