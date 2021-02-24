const Category = require("../models/category");
const slugify = require("slugify");

const addCategory = async (req, res, next) => {
  try {
    const files = req.files;
    const { name, parentId = "" } = req.body;
    const category = new Category({
      name,
      slug: slugify(name, { lower: true }),
      parentId,
    });
    const savedCategory = await category.save();
    res.status(200).json(savedCategory);
  } catch (error) {
    next(error);
  }
};

const createCategoryList = (categories, parentId = "") => {
  const categoryList = [];
  const topCategories = categories.filter((cat) => cat.parentId === parentId);
  for (const cat of topCategories) {
    categoryList.push({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      children: createCategoryList(categories, cat.id),
    });
  }
  return categoryList;
};

const getCategoryList = async (req, res, next) => {
  try {
    const categories = await Category.find({});
    const categoryList = createCategoryList(categories);
    res.status(200).json(categoryList);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCategory,
  getCategoryList,
};
