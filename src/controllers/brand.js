const Brand = require("../models/brand");
const slugify = require("slugify");

const addBrand = async (req, res, next) => {
  try {
    const file = req.file;
    console.log(file);
    const { name } = req.body;

    const brand = new Brand({
      name: name,
      slug: slugify(name, { lower: true }),
      brandImage: file.filename,
    });

    const savedBrand = await brand.save();
    res.status(200).json(savedBrand);
  } catch (error) {
    next(error);
  }
};

const getAllBrands = async (req, res, next) => {
  try {
    const brands = await Brand.find({});
    res.status(200).json(brands);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBrand,
  getAllBrands,
};
