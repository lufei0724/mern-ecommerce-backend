const productRouter = require("express").Router();
const { addProduct, getProducts } = require("../controllers/product");
const { verifySignIn, uploadFiles } = require("../utils/middleware");

productRouter.post("/add", verifySignIn, uploadFiles, addProduct);

productRouter.get("/all", getProducts);

module.exports = productRouter;
