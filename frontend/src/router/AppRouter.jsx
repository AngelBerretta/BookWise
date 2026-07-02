import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';

// Pages
import Home          from '../pages/Home';
import Login         from '../pages/Login';
import Register      from '../pages/Register';
import VerifyAccount from '../pages/VerifyAccount';
import Products      from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import Cart          from '../pages/Cart';
import Blog          from '../pages/Blog';
import BlogPost      from '../pages/BlogPost';
import Dashboard     from '../pages/admin/Dashboard';
import AdminProducts from '../pages/admin/AdminProducts';
import AdminBlog     from '../pages/admin/AdminBlog';
import NotFound      from '../pages/NotFound';

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Rutas sin layout — diseño propio centrado */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas para usuarios autenticados — con layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/cart" element={<Cart />} />
          </Route>
        </Route>

        {/* Rutas protegidas solo para admin — con layout */}
        <Route element={<ProtectedRoute requiredRole="admin" />}>
          <Route element={<Layout />}>
            <Route path="/admin"          element={<Dashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/blog"     element={<AdminBlog />} />
          </Route>
        </Route>

        {/* Rutas públicas — con layout */}
        <Route element={<Layout />}>
          <Route path="/"             element={<Home />} />
          <Route path="/products"     element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/blog"         element={<Blog />} />
          <Route path="/blog/:slug"   element={<BlogPost />} />
          <Route path="/verify"       element={<VerifyAccount />} />
          <Route path="*"             element={<NotFound />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
