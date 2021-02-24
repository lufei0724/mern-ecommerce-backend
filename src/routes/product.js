const productRouter = require("express").Router();
const { addProduct, getProducts } = require("../controllers/product");
const { verifySignIn, upload } = require("../utils/middleware");

productRouter.post(
  "/add",
  verifySignIn,
  upload.array("productImages", 8),
  addProduct
);

productRouter.get("/all", getProducts);

module.exports = productRouter;
