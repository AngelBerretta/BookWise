import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },

    // ── Rol ───────────────────────────────────────────────────────────────────
    // "user"  → cliente normal (acceso de lectura y carrito)
    // "admin" → acceso completo (CRUD productos, posts, gestión de usuarios)
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ── Verificación de cuenta ────────────────────────────────────────────────
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);