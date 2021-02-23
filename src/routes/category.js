const categoryRouter = require("express").Router();
const { verifySignIn, adminRoleRequired } = require("../utils/middleware");
const { addCategory, getCategoryList } = require("../controllers/category");

categoryRouter.post("/add", verifySignIn, adminRoleRequired, addCategory);

categoryRouter.get("/list", getCategoryList);

module.exports = categoryRouter;
