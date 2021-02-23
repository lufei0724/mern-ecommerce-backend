const Cart = require("../models/cart");

const addToCart = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { item, quantity, price } = req.body;
    const cart = await Cart.findOne({ user: userId });
    let newCartItem = { item, quantity, price };
    if (!cart) {
      const newCart = new Cart({
        user: userId,
        cartItems: [newCartItem],
      });
      const savedCart = await newCart.save();
      res.status(200).json(savedCart);
    } else {
      const itemInCart = cart.cartItems.find(
        (i) => i.item === newCartItem.item
      );
      let newCartItems = [];
      if (!itemInCart) {
        newCartItems = [...cart.cartItems, newCartItem];
      } else {
        newCartItems = cart.cartItems.map((i) =>
          i.item === itemInCart.item
            ? {
                item: i.item,
                price: i.price,
                quantity: i.quantity + newCartItem.quantity,
              }
            : i
        );
      }
      await Cart.updateOne({ user: userId }, { cartItems: newCartItems });
      const modifiedCart = await Cart.findOne({ user: userId });
      res.status(200).json(modifiedCart);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToCart,
};
