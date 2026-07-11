import mongoose from "mongoose";

const CATEGORIES = [
  "ficcion",
  "no-ficcion",
  "ciencia-tecnologia",
  "desarrollo-personal",
  "infantil-juvenil",
  "poesia",
  "ebooks",
];

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },
    thumbnails: {
      type: [String],
      default: [],
    },

    thumbnailPublicId: {
      type: String,
      default: "",
    },    

    url: {
      type: String,
      default: "",
      trim: true,
    },
    author: {
      type: String,
      default: "",
      trim: true,
    },

    // ── Campos nuevos ──
    pages: {
      type: Number,
      min: 1,
      default: null,
    },
    publicationDate: {
      type: String,
      trim: true,
      default: null,   // ej: "Feb 2015" | "2023" | "Marzo 2021"
    },
  },
  { timestamps: true }
);

productSchema.index({ createdAt: -1, _id: -1 });

export default mongoose.model("Product", productSchema);