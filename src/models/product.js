const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: mongoose.ObjectId,
      get: (v) => v.toString(),
      ref: "category",
    },
    brand: {
      type: mongoose.ObjectId,
      get: (v) => v.toString(),
      ref: "brand",
    },
    productImages: [
      {
        name: {
          type: String,
          required: true,
        },
        path: {
          type: String,
        },
      },
    ],
    createdBy: {
      type: mongoose.ObjectId,
      get: (v) => v.toString(),
      ref: "user",
    },
    updatedBy: {
      type: mongoose.ObjectId,
      get: (v) => v.toString(),
      ref: "user",
    },
  },
  { timestamps: true }
);

productSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.productImages.map((i) => {
      i.id = i._id.toString();
      delete i._id;
      return i;
    });
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("product", productSchema);
