const brandRouter = require("express").Router();
const middleware = require("../utils/middleware");
const { addBrand, getAllBrands } = require("../controllers/brand");

brandRouter.post(
  "/add",
  middleware.verifySignIn,
  middleware.adminRoleRequired,
  middleware.upload.single("brandImage"),
  addBrand
);

brandRouter.get("/all", getAllBrands);
module.exports = brandRouter;
