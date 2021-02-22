const productRouter = require("express").Router();
const { addProduct } = require("../controllers/product");
const { verifySignIn, uploadFiles } = require("../utils/middleware");

productRouter.post("/add", verifySignIn, uploadFiles, addProduct);

module.exports = productRouter;
