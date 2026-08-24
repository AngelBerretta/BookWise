import { useEffect, useState } from 'react';
import { getProducts } from '../../../services/productService';
import { getPosts } from '../../../services/blogService';
import useAuth from '../../../hooks/useAuth';

const useDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    products: 0, posts: 0, publishedPosts: 0,
    outOfStock: 0, lowStock: 0,
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecent, setLoadingRecent] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsData, postsData, publishedData, outOfStockData, lowStockData] = await Promise.allSettled([
          getProducts({ limit: 1 }),
          getPosts({ limit: 1 }),
          getPosts({ limit: 1, published: true }),
          getProducts({ limit: 1, stock: 'out' }),
          getProducts({ limit: 1, stock: 'low' }),
        ]);

        const products = productsData.status === 'fulfilled' ? (productsData.value?.totalDocs ?? 0) : 0;
        const posts = postsData.status === 'fulfilled' ? (postsData.value?.totalDocs ?? 0) : 0;
        const publishedPosts = publishedData.status === 'fulfilled' ? (publishedData.value?.totalDocs ?? 0) : 0;
        const outOfStock = outOfStockData.status === 'fulfilled' ? (outOfStockData.value?.totalDocs ?? 0) : 0;
        const lowStock = lowStockData.status === 'fulfilled' ? (lowStockData.value?.totalDocs ?? 0) : 0;

        setStats({ products, posts, publishedPosts, outOfStock, lowStock });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getProducts({ limit: 3, sort: 'newest' });
        setRecentProducts(Array.isArray(data) ? data : (data?.payload ?? []));
      } catch {
        setRecentProducts([]);
      } finally {
        setLoadingRecent(false);
      }
    };
    fetchRecent();
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return { user, stats, recentProducts, loading, loadingRecent, greeting };
};

export default useDashboard;