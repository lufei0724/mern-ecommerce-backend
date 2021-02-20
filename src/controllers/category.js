const Category = require("../models/category");
const slugify = require("slugify");

const initCategory = async (req, res, next) => {
  const addCategory = async (category, parentId = "") => {
    try {
      const newCategory = new Category({
        name: category.name,
        slug: slugify(category.name, { lower: true }),
        parentId: parentId,
      });
      const savedCategory = await newCategory.save();
      if (!category.children || category.children.length === 0) {
        return;
      }
      for (const subCate of category.children) {
        await addCategory(subCate, savedCategory.id);
      }
    } catch (error) {
      next(error);
    }
  };

  try {
    const initCategories = [
      {
        name: "TV & Home Theatre",
        children: [
          {
            name: "Televisions & Projectors",
            children: [
              {
                name: "LED Televisions",
              },
              {
                name: "Projects",
              },
            ],
          },
          { name: "TV & Projector Accessories" },
          { name: "Media Devices" },
        ],
      },
      {
        name: "Phones, Tablets & Wearables",
        children: [
          { name: "iPhones" },
          { name: "Android" },
          { name: "Phone Accessories" },
        ],
      },
      {
        name: "Shoes & Fashion",
        children: [
          { name: "Footwear" },
          { name: "Clothing" },
          { name: "Accessories" },
        ],
      },
    ];

    await Category.deleteMany({});
    for (const initCate of initCategories) {
      await addCategory(initCate);
    }
    res.status(200).json("category initialized");
  } catch (error) {
    next(error);
  }
};

const addCategory = async (req, res, next) => {
  try {
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
  initCategory,
  addCategory,
  getCategoryList,
};
