const User = require("../models/user");
const Category = require("../models/category");
const Product = require("../models/product");
const bcrypt = require("bcrypt");
const slugify = require("slugify");

const users = [
  {
    username: "pmurphy",
    email: "pm@gmail.com",
    password: "123123",
    role: "admin",
  },
  {
    username: "mattl",
    email: "ml@gmail.com",
    password: "123123",
    role: "user",
  },
  {
    username: "shazt",
    email: "sh@gmail.com",
    password: "123123",
    role: "user",
  },
  {
    username: "kchan",
    email: "kchan@gmail.com",
    password: "123123",
    role: "admin",
  },
];

const generateHashPassword = async (password, next) => {
  try {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  } catch (error) {
    throw new Error(error.message);
  }
};

const initUsers = async (req, res, next) => {
  try {
    await User.deleteMany({});
    for (const user of users) {
      const hashPassword = await generateHashPassword(user.password, next);
      const newUser = new User({
        ...user,
        hashPassword,
      });
      await newUser.save();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

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
      throw new Error(error.message);
    }
  };

  try {
    await Category.deleteMany({});
    for (const initCate of initCategories) {
      await addCategory(initCate);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const products = [
  {
    name: "Apple iPhone 11 (64GB, Black)",
    description:
      "Engineered for uncompromising performance, the iPhone 11 is ready to capture pro-grade photos with dual cameras, power through the whole day with a long-lasting battery and deliver high-quality smartphone video!",
    price: 969,
    category: "iPhones",
    productImages: [
      {
        name: "KHIP1164BLK_1.jpg",
      },
    ],
  },
  {
    name: "42 Full HD LED Smart TV Android TV™ (Series 9, RF9220)",
    description:
      "Lose yourself in cinematic-quality viewing with built-in Chromecast and Google Assistant for faster, easier support for your favourite streaming services on this stunning 42” Smart Full HD LED Android TV™.",
    price: 319,
    category: "LED Televisions",
    productImages: [
      {
        name: "KALED42RF9220STA_1.jpg",
      },
      {
        name: "KALED42RF9220STA_2.jpg",
      },
    ],
  },
  {
    name: "Dr. Martens 2976 Smooth Chelsea Hi Top Shoe (Black, Size 5 UK)",
    description:
      "The Dr. Martens 2976 Smooth Leather Chelsea Hi Top Shoes offer the slick, uncompromisingly fashion-forward look for both men and women.",
    price: 119.99,
    category: "Footwear",
    productImages: [
      { name: "DOC-2976-R11853001-M-8_1.jpg" },
      { name: "DOC-2976-R11853001-M-8_2.jpg" },
      { name: "DOC-2976-R11853001-M-8_3.jpg" },
    ],
  },
];

const initProducts = async (req, res, next) => {
  try {
    await Product.deleteMany({});
    for (const prod of products) {
      const categoryId = await Category.findOne({ name: prod.category });
      const userId = await User.findOne({ username: "pmurphy" });
      const newProduct = new Product({
        ...prod,
        slug: slugify(prod.name, { lowercase: true }),
        category: categoryId,
        createdBy: userId,
      });
      await newProduct.save();
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const initDB = async (req, res, next) => {
  try {
    await initUsers(req, res, next);
    await initCategory(req, res, next);
    await initProducts(req, res, next);
    res.status(200).json({ message: "DB initialized." });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initDB,
};
