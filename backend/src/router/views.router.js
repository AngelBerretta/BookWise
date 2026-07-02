import { Router } from "express";
import { productDAO, cartDAO } from "../models/DAOs/index.js";
import { toProductDTO, toCartDTO } from "../models/DTOs/index.js";
import CartModel from "../models/model/Cart.js";
import config from "../../config.js";

const router = Router();

const CATEGORIES = [
  "ficcion", "no-ficcion", "ciencia-tecnologia",
  "desarrollo-personal", "infantil-juvenil", "poesia", "ebooks",
];

// ── GET /products ─────────────────────────────────────────────────────────────

router.get("/products", async (req, res) => {
  try {
    const {
      limit = 10, page = 1, query, sort,
    } = req.query;

    const limitNum = Math.max(1, parseInt(limit, 10) || 10);
    const pageNum  = Math.max(1, parseInt(page,  10) || 1);

    const filters = {};
    if (query) {
      if (query === "status=true")       filters.status = true;
      else if (query === "status=false") filters.status = false;
      else                               filters.category = query;
    }

    const sortObj = {};
    if (sort === "asc")  sortObj.price = 1;
    if (sort === "desc") sortObj.price = -1;

    const { docs, totalPages, page: currentPage } = await productDAO.paginate(filters, {
      page: pageNum, limit: limitNum, sort: sortObj,
    });

    const hasPrevPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    const buildLink = (p) => {
      const params = new URLSearchParams({ limit: limitNum, page: p });
      if (query) params.set("query", query);
      if (sort)  params.set("sort", sort);
      return `/products?${params.toString()}`;
    };

    res.render("products", {
      title: "Catálogo",
      products:    docs.map(toProductDTO),
      categories:  CATEGORIES,
      totalPages,
      page:        currentPage,
      hasPrevPage,
      hasNextPage,
      prevLink:    hasPrevPage ? buildLink(currentPage - 1) : null,
      nextLink:    hasNextPage ? buildLink(currentPage + 1) : null,
      query:       query || "",
      sort:        sort  || "",
      limit:       limitNum,
    });
  } catch (err) {
    res.status(500).send("Error al cargar productos: " + err.message);
  }
});

// ── GET /products/:pid ────────────────────────────────────────────────────────

router.get("/products/:pid", async (req, res) => {
  try {
    const product = await productDAO.getById(req.params.pid);
    if (!product) return res.status(404).send("Producto no encontrado");
    res.render("product-detail", { title: product.title, ...toProductDTO(product) });
  } catch (err) {
    res.status(500).send("Error: " + err.message);
  }
});

// ── GET /carts/:cid ───────────────────────────────────────────────────────────

router.get("/carts/:cid", async (req, res) => {
  try {
    const cid = req.params.cid;
    let cart;

    if (config.mode === "fs") {
      cart = await cartDAO.getById(cid);
      if (!cart) return res.status(404).send("Carrito no encontrado");
      cart = { ...cart };
      cart.products = await Promise.all(
        (cart.products || []).map(async (item) => {
          const product = await productDAO.getById(item.product);
          return { product, quantity: item.quantity };
        })
      );
    } else {
      cart = await CartModel.findById(cid).populate("products.product").lean();
      if (!cart) return res.status(404).send("Carrito no encontrado");
    }

    const dto = toCartDTO(cart);

    // Calcular subtotales y total
    let total = 0;
    const products = dto.products.map((item) => {
      const subtotal = (item.product?.price || 0) * item.quantity;
      total += subtotal;
      return { ...item, subtotal };
    });

    res.render("cart", { title: "Mi carrito", cartId: cid, products, total });
  } catch (err) {
    res.status(500).send("Error al cargar carrito: " + err.message);
  }
});

export default router;
