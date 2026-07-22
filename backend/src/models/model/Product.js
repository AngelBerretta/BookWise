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
    // ── Trazabilidad de quién tocó el producto por última vez ──
    // Se usa en el reseed automático para limpiar solo lo que ensucia la
    // cuenta admin-demo, sin tocar nada gestionado por un admin real.
    createdBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      isDemo: { type: Boolean, default: false },
    },
    lastEditedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      isDemo: { type: Boolean, default: false },
    },
    // Última versión guardada por un admin REAL (no demo) de los campos
    // editables. El reseed la usa para restaurar acá cuando la cuenta demo
    // ensucia un producto — en vez de resetear al catálogo base y perder
    // la personalización real (ej: la miniatura que subiste vos).
    // null = todavía nunca lo tocó un admin real (recién nace del seed).
    lastRealSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

productSchema.index({ createdAt: -1, _id: -1 });

export default mongoose.model("Product", productSchema);