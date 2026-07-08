import { Router }     from "express";
import authRouter     from "./auth.router.js";
import usersRouter    from "./users.router.js";
import productsRouter from "./products.router.js";
import cartRouter     from "./cart.router.js";
import blogRouter     from "./blog.router.js";
import uploadRouter   from "./upload.router.js";

const router = Router();

router.use("/auth",     authRouter);
router.use("/users",    usersRouter);
router.use("/products", productsRouter);
router.use("/carts",    cartRouter);      // ← /api/carts según consigna
router.use("/blog",     blogRouter);
router.use("/uploads",  uploadRouter);

export default router;