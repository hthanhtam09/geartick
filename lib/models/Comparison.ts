import { Schema, model, models } from "mongoose";

const ComparisonCriteriaSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  description: String,
});

const ComparisonWinnerSchema = new Schema({
  overall: String,
  bestValue: String,
  premium: String,
});

const ComparisonSchema = new Schema(
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
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    criteria: [ComparisonCriteriaSchema],
    winner: ComparisonWinnerSchema,
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create text index for search
ComparisonSchema.index({
  title: "text",
  description: "text",
  category: "text",
});

// Index for filtering
ComparisonSchema.index({ category: 1 });
ComparisonSchema.index({ isPublished: 1 });
ComparisonSchema.index({ views: -1 });
ComparisonSchema.index({ createdAt: -1 });

const Comparison = models.Comparison || model("Comparison", ComparisonSchema);

export default Comparison;
