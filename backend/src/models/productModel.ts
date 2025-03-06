import { Schema, model } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true, // Adding index
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Herbal Supplements",
        "Ayurvedic Oils",
        "Personal Care Products",
        "Ayurvedic Teas and Beverages",
        "Ayurvedic Medicines",
      ],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 1,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    ratings: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    reviews: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        rating: { type: Number, min: 0, max: 5, required: true },
      },
    ],
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    collection: "product"
  }
);

const ProductModel = model("product", ProductSchema);
export default ProductModel;
