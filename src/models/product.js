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
      ref: "Category",
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
    createdBy: { type: mongoose.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.ObjectId, ref: "User" },
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

module.exports = mongoose.model("Product", productSchema);
