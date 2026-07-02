import config        from "../../../config.js";
import MongoDAO      from "./MongoDAO.js";
import FileSystemDAO from "./FileSystemDAO.js";

import User    from "../model/User.js";
import Product from "../model/Product.js";
import Cart    from "../model/Cart.js";
import Post    from "../model/Post.js";

let userDAO, productDAO, cartDAO, postDAO;

if (config.mode === "fs") {
  userDAO    = new FileSystemDAO("users");
  productDAO = new FileSystemDAO("products");
  cartDAO    = new FileSystemDAO("carts");
  postDAO    = new FileSystemDAO("posts");
  console.log("📁  Persistence mode: File System");
} else {
  userDAO    = new MongoDAO(User);
  productDAO = new MongoDAO(Product);
  cartDAO    = new MongoDAO(Cart);
  postDAO    = new MongoDAO(Post);
  console.log("🍃  Persistence mode: MongoDB");
}

export { userDAO, productDAO, cartDAO, postDAO };
