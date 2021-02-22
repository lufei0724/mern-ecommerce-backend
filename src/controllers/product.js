const productSchema = require("../models/product");
const slugify = require("slugify");

const addProduct = async (req, res, next) => {
  try {
    const files = req.files;
    console.log(files);
    const { name, description, price, category } = req.body;

    const product = new productSchema({
      name: name,
      slug: slugify(name, { lowercase: true }),
      description: description,
      price: price,
      category: category,
      createdBy: req.user.id,
      updatedBy: req.user.id,
      productImages:
        files && files.map((f) => ({ name: f.originalname, path: f.path })),
    });
    const savedProduct = await product.save();
    res.status(200).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addProduct,
};