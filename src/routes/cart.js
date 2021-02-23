const cartRouter = require("express").Router();
const { addToCart } = require("../controllers/cart");
const middleware = require("../utils/middleware");

cartRouter.post("/add-to-cart", middleware.verifySignIn, addToCart);

module.exports = cartRouter;
