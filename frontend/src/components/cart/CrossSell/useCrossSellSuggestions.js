import { useEffect, useState } from 'react';
import useCart from '../../../hooks/useCart';
import { getMostFrequentCategory } from '../../../services/cartService';
import { getProducts } from '../../../services/productService';

export const SUGGESTIONS_LIMIT = 4;
// Pedimos de más al server porque después excluimos lo que ya está en el
// carrito y lo que está sin stock.
const FETCH_LIMIT = 12;

/**
 * Sugiere productos de la categoría más frecuente dentro del carrito
 * actual (ver cartService.getMostFrequentCategory).
 */
const useCrossSellSuggestions = () => {
  const { products } = useCart();
  const category = getMostFrequentCategory(products);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(category));
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!category) return;

    let ignore = false;
    const cartProductIds = new Set(
      products.map((item) => item.product?._id ?? item._id)
    );

    const loadSuggestions = async () => {
      setLoading(true);
      setError(false);
      try {
        const data = await getProducts({ category, limit: FETCH_LIMIT, sort: 'newest' });
        if (ignore) return;
        const list = Array.isArray(data) ? data : (data.payload ?? []);
        const filtered = list
          .filter((p) => !cartProductIds.has(p._id))
          .filter((p) => (p.stock ?? 0) > 0)
          .slice(0, SUGGESTIONS_LIMIT);
        setSuggestions(filtered);
      } catch {
        if (!ignore) setError(true);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    loadSuggestions();

    return () => { ignore = true; };
    // Solo re-consultamos cuando cambia la categoría dominante.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  return { category, suggestions, loading, error };
};

export default useCrossSellSuggestions;