const Product = require("../models/product");
const slugify = require("slugify");

const addProduct = async (req, res, next) => {
  try {
    const files = req.files;
    console.log(files);
    const { name, description, price, category } = req.body;

    const product = new Product({
      name: name,
      slug: slugify(name, { lowercase: true }),
      description: description,
      price: price,
      category: category,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      productImages:
        files &&
        files.map((f) => ({
          name: f.filename,
          originalName: f.originalname,
          path: f.path,
        })),
    });
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({})
      .populate({ path: "category", select: "name" })
      .populate({ path: "createdBy", select: "username" })
      .populate({ path: "updatedBy", select: "username" });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
  getProducts,
};
