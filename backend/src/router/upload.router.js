import { Router } from "express";
import { uploadImage }    from "../controllers/upload.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";
import { upload }         from "../middlewares/upload.middleware.js";
import { rateLimitDemoUpload } from "../middlewares/rateLimit.middleware.js";

const router = Router();

// POST /api/uploads/image — solo admin (quien crea productos/posts)
router.post(
  "/image",
  authMiddleware,
  roleMiddleware(["admin"]),
  rateLimitDemoUpload,
  upload.single("image"),
  uploadImage
);

export default router;