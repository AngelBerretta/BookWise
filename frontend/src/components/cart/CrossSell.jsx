import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { getMostFrequentCategory } from '../../services/cartService';
import { getProducts } from '../../services/productService';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import ProductCard from '../product/ProductCard';
import ProductSkeleton from '../product/ProductSkeleton';

// Cuántas sugerencias mostramos como máximo.
const SUGGESTIONS_LIMIT = 4;
// Pedimos de más al server porque después excluimos lo que ya está en el
// carrito y lo que está sin stock — así, aunque se excluyan varios, casi
// siempre llegamos a las 4 sugerencias.
const FETCH_LIMIT = 12;

/**
 * "También te puede interesar" — sugiere productos de la categoría más
 * frecuente dentro del carrito actual (ver cartService.getMostFrequentCategory).
 * No se muestra si el carrito está vacío o si no hay sugerencias válidas
 * para mostrar (por stock o porque ya están todas en el carrito).
 */
const CrossSell = () => {
  const { products } = useCart();
  const category = getMostFrequentCategory(products);

  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(() => Boolean(category));
  const [error, setError]             = useState(false);

  useEffect(() => {
    // Sin categoría dominante no hay nada que pedir — y el guard de
    // abajo (`if (!category) return null`) ya oculta toda la sección,
    // así que no hace falta tocar el estado acá.
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
    // Solo re-consultamos cuando cambia la categoría dominante — no hace
    // falta re-disparar la request por cada cambio de cantidad.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  // Nada que mostrar: carrito vacío, error al pedir sugerencias, o sin
  // sugerencias válidas tras filtrar. Sin animación — la sección aparece
  // o no aparece, tal cual, sin abrir/cerrar nada.
  if (!category) return null;
  if (error) return null;
  if (!loading && suggestions.length === 0) return null;

  const categoryLabel =
    PRODUCT_CATEGORIES.find((c) => c.value === category)?.label ?? category;

  return (
    // overflow-anchor: none — la causa real del "acordeón": el navegador
    // reajusta solo la posición de scroll cuando algo dentro de esta
    // sección cambia de tamaño aunque sea un poco (CSS Scroll Anchoring,
    // activado por default), y como el sitio tiene `scroll-behavior:
    // smooth` en el <html>, ese reajuste se ve como un scroll animado —
    // no es un cambio de altura del documento (por eso no aparecía en
    // scrollHeight ni en el layout-shift observer) ni algo que se
    // resuelva fijando la altura del contenedor. Esto le dice al
    // navegador que nunca use esta sección como referencia para corregir
    // el scroll.
    <section aria-label="Sugerencias" className="mt-10" style={{ overflowAnchor: 'none' }}>
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
            También te puede interesar
          </p>
          <h2 className="h2-editorial text-xl sm:text-2xl">
            Más de {categoryLabel}
          </h2>
        </div>
        <Link
          to={`/products?category=${category}`}
          className="text-sm font-medium text-[var(--text-h)] flex items-center gap-1 hover:opacity-60 transition-opacity shrink-0"
        >
          Ver todos
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: SUGGESTIONS_LIMIT }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {suggestions.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </section>
  );
};

export default CrossSell;