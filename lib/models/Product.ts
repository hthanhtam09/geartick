import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    affiliateUrl: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
    tags: [
      {
        type: String,
      },
    ],
    seoTitle: String,
    seoDescription: String,
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
ProductSchema.index({
  title: "text",
  description: "text",
  brand: "text",
  category: "text",
  tags: "text",
});

const Product = models.Product || model("Product", ProductSchema);

export default Product;
