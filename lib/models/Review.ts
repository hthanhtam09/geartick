import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    pros: [
      {
        type: String,
      },
    ],
    cons: [
      {
        type: String,
      },
    ],
    verdict: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorImage: String,
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
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    seoTitle: String,
    seoDescription: String,
    tags: [
      {
        type: String,
      },
    ],
    readTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
ReviewSchema.index({
  title: "text",
  content: "text",
  tags: "text",
  verdict: "text",
});

ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ isPublished: 1, isFeatured: -1, createdAt: -1 });

const Review = models.Review || model("Review", ReviewSchema);

export default Review;
