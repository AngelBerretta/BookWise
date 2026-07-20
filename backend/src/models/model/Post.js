import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: "",
    },

    thumbnailPublicId: {
      type: String,
      default: "",
    },

    published: {
      type: Boolean,
      default: false,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ── Trazabilidad de quién tocó el post por última vez ──
    // Igual que en Product: el reseed automático usa este dato para
    // limpiar solo lo que ensucia la cuenta admin-demo.
    lastEditedBy: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
      isDemo: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

postSchema.index({ createdAt: -1, _id: -1 });

export default mongoose.model("Post", postSchema);