import config        from "../../../config.js";
import MongoDAO      from "./MongoDAO.js";
import FileSystemDAO from "./FileSystemDAO.js";

import User    from "../model/User.js";
import Product from "../model/Product.js";
import Cart    from "../model/Cart.js";
import Post    from "../model/Post.js";
import Order   from "../model/Order.js";

let userDAO, productDAO, cartDAO, postDAO, orderDAO;

if (config.mode === "fs") {
  userDAO    = new FileSystemDAO("users");
  productDAO = new FileSystemDAO("products");
  cartDAO    = new FileSystemDAO("carts");
  postDAO    = new FileSystemDAO("posts");
  // El checkout con Stripe no está soportado en modo "fs" (ver
  // controllers/orders.js), pero se instancia igual para no romper el
  // arranque del server si algo lo importa.
  orderDAO   = new FileSystemDAO("orders");
  console.log("📁  Persistence mode: File System");
} else {
  userDAO    = new MongoDAO(User);
  productDAO = new MongoDAO(Product);
  cartDAO    = new MongoDAO(Cart);
  postDAO    = new MongoDAO(Post);
  orderDAO   = new MongoDAO(Order);
  console.log("🍃  Persistence mode: MongoDB");
}

export { userDAO, productDAO, cartDAO, postDAO, orderDAO };
