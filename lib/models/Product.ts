import { Schema, model, models } from "mongoose";

const ProductColorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  hex: {
    type: String,
    required: true,
  },
  image: String,
});

const ProductSpecificationSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

const ProductDimensionsSchema = new Schema({
  length: Number,
  width: Number,
  height: Number,
  weight: Number,
  unit: {
    type: String,
    default: "mm",
  },
});

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
    subcategory: {
      type: String,
      required: false,
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
    // New fields for comparison
    colors: [ProductColorSchema],
    materials: [String],
    developerSupport: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor", "None"],
      default: "Fair",
    },
    specifications: [ProductSpecificationSchema],
    dimensions: ProductDimensionsSchema,
    pros: [String],
    cons: [String],
    score: {
      type: Number,
      min: 0,
      max: 10,
      default: 0,
    },
    bestFor: [String],
    worstFor: [String],
    releaseDate: Date,
    isDiscontinued: {
      type: Boolean,
      default: false,
    },
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
  subcategory: "text",
  tags: "text",
});

// Index for filtering
ProductSchema.index({ category: 1, subcategory: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ averageRating: -1 });

const Product = models.Product || model("Product", ProductSchema);

export default Product;
