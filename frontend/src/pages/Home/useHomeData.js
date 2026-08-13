import { useEffect, useState } from 'react';
import { getProducts } from '../../services/productService';
import { getPosts } from '../../services/blogService';
import useToast from '../../hooks/useToast';
import useScrollReveal from '../../hooks/useScrollReveal';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const FEATURED_PRODUCTS_LIMIT = 4;
export const FEATURED_POSTS_LIMIT = 3;

/** Fetch de productos/posts destacados, stats, newsletter y scroll-reveal de cada sección. */
const useHomeData = () => {
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loadingP, setLoadingP] = useState(true);
  const [loadingB, setLoadingB] = useState(true);
  const [errorP, setErrorP] = useState(false);
  const [errorB, setErrorB] = useState(false);
  const [totalBooks, setTotalBooks] = useState(null);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const [categoriesRef, categoriesVisible] = useScrollReveal();
  const [productsRef, productsVisible] = useScrollReveal();
  const [blogRef, blogVisible] = useScrollReveal();
  const [statsRef, statsVisible] = useScrollReveal();
  const [ctaRef, ctaVisible] = useScrollReveal();
  const [newsletterRef, newsletterVisible] = useScrollReveal();

  useEffect(() => {
    getProducts({ limit: FEATURED_PRODUCTS_LIMIT })
      .then((d) => {
        setProducts(Array.isArray(d) ? d : (d.payload ?? []));
        setTotalBooks(Array.isArray(d) ? null : (d.totalDocs ?? null));
      })
      .catch(() => setErrorP(true))
      .finally(() => setLoadingP(false));
  }, []);

  useEffect(() => {
    getPosts({ limit: FEATURED_POSTS_LIMIT })
      .then((d) => {
        const arr = Array.isArray(d) ? d : (d.payload ?? []);
        setPosts(arr.slice(0, FEATURED_POSTS_LIMIT));
      })
      .catch(() => setErrorB(true))
      .finally(() => setLoadingB(false));
  }, []);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!EMAIL_RE.test(email)) {
      showToast({ type: 'warning', message: 'Ingresá un correo electrónico válido.' });
      return;
    }
    setSubscribing(true);
    setTimeout(() => {
      setSubscribing(false);
      setNewsletterEmail('');
      showToast({ type: 'success', message: '¡Listo! Te vamos a avisar de las novedades por correo.' });
    }, 500);
  };

  const stats = [
    { value: loadingP || totalBooks === null ? null : totalBooks, label: 'Libros en catálogo' },
    { value: PRODUCT_CATEGORIES.length, label: 'Categorías para explorar' },
    { value: '+200', label: 'Lectores en la comunidad' },
  ];

  return {
    products, posts, loadingP, loadingB, errorP, errorB, stats,
    newsletterEmail, setNewsletterEmail, subscribing, handleNewsletterSubmit,
    categoriesRef, categoriesVisible,
    productsRef, productsVisible,
    blogRef, blogVisible,
    statsRef, statsVisible,
    ctaRef, ctaVisible,
    newsletterRef, newsletterVisible,
  };
};

export default useHomeData;