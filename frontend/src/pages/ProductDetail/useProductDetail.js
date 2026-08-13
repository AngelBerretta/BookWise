import { useState, useEffect } from 'react';
import { getProductById, getProducts } from '../../services/productService';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';

/** Fetch del producto + relacionados, y las acciones de carrito/wishlist. */
const useProductDetail = (id) => {
  const { addToCart } = useCart();
  const { isSaved, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [savingWish, setSavingWish] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data.product ?? data);
      } catch (err) {
        setError(
          err?.message ||
          err?.response?.data?.message ||
          'No pudimos cargar el producto.'
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  // Relacionados — depende del producto ya cargado
  useEffect(() => {
    if (!product?.category) return;
    getProducts({ category: product.category, limit: 5 })
      .then((d) => {
        const arr = Array.isArray(d) ? d : (d.payload ?? []);
        setRelated(arr.filter((p) => p._id !== product._id).slice(0, 4));
      })
      .catch(() => setRelated([]));
  }, [product?._id, product?.category]);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      showToast({ type: 'warning', message: 'Iniciá sesión para guardar productos.' });
      return;
    }
    setSavingWish(true);
    try {
      const result = await toggleWishlist(product._id, product.title);
      if (result?.added) {
        showToast({ type: 'success', message: `"${product.title}" agregado a favoritos` });
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'No pudimos actualizar tus guardados.';
      showToast({ type: 'error', message: msg });
    } finally {
      setSavingWish(false);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      showToast({ type: 'warning', message: 'Iniciá sesión para agregar al carrito.' });
      return;
    }
    setAdding(true);
    try {
      await addToCart(product._id, quantity);
      showToast({ type: 'success', message: `"${product.title}" agregado al carrito.` });
    } catch (err) {
      const msg = err?.response?.data?.message || 'No pudimos agregar el producto. Intentá de nuevo.';
      showToast({ type: 'error', message: msg });
    } finally {
      setAdding(false);
    }
  };

  const saved = product ? isSaved(product._id) : false;
  const outOfStock = product?.stock === 0;
  const maxQty = product ? Math.min(product.stock, 10) : 1;

  return {
    product, loading, error, related,
    adding, quantity, setQuantity, savingWish,
    saved, outOfStock, maxQty,
    handleToggleWishlist, handleAddToCart,
  };
};

export default useProductDetail;