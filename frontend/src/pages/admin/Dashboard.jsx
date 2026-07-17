import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/productService';
import { getPosts } from '../../services/blogService';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/ui/Spinner';

/* ─── Íconos ────────────────────────────────────────────────────────────────── */
const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const PostIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const StoreIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const BlogIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const AlertIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"
    strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path fillRule="evenodd"
      d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd" />
  </svg>
);

/* ─── Stat Card ─────────────────────────────────────────────────────────────── */
const StatCard = ({ label, value, sublabel, icon, href, colorClass, delay }) => (
  <Link
    to={href}
    className="stat-card group relative rounded-2xl border border-[var(--border)] bg-[var(--bg-subtle)] p-6 overflow-hidden
               hover:border-[var(--accent-border)] hover:shadow-lg transition-all duration-300"
    style={{ animationDelay: delay }}
  >
    {/* Glow de fondo al hover */}
    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${colorClass.glow}`} />

    <div className="relative flex items-start justify-between gap-3">
      <div>
        <p className="text-[var(--text)] text-xs font-medium uppercase tracking-widest mb-2">{label}</p>
        <p className="text-4xl font-bold text-[var(--text-h)] tabular-nums leading-none">
          {value}
        </p>
        {sublabel && (
          <p className="text-xs text-[var(--text)] mt-2">{sublabel}</p>
        )}
      </div>
      <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${colorClass.icon}`}>
        {icon}
      </div>
    </div>

    <div className="relative mt-4 flex items-center gap-1 text-xs font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition-colors duration-200">
      Gestionar <ArrowIcon />
    </div>
  </Link>
);

/* ─── Quick Link ────────────────────────────────────────────────────────────── */
const QuickLink = ({ to, label, description, icon, delay }) => (
  <Link
    to={to}
    className="quick-link flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-4
               hover:border-[var(--accent-border)] hover:bg-[var(--bg-subtle)] hover:shadow-sm
               transition-all duration-200 group"
    style={{ animationDelay: delay }}
  >
    <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[var(--accent-bg)] text-[var(--accent)] shrink-0
                    group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-200">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm font-semibold text-[var(--text-h)] group-hover:text-[var(--accent)] transition-colors duration-150 truncate">
        {label}
      </p>
      <p className="text-xs text-[var(--text)] mt-0.5 leading-relaxed">{description}</p>
    </div>
    <div className="ml-auto text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-200 shrink-0">
      <ArrowIcon />
    </div>
  </Link>
);

/* ─── Fila de "último producto agregado" ────────────────────────────────────── */
const RecentProductRow = ({ product }) => {
  const fmt = (val) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      maximumFractionDigits: 0,
    }).format(val);

  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }) : '—';

  return (
    <Link
      to="/admin/products"
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 -mx-3 hover:bg-[var(--bg-subtle)] transition-colors duration-150 group"
    >
      <div className="w-9 h-12 rounded-lg overflow-hidden shrink-0 flex items-center justify-center bg-[var(--code-bg)] border border-[var(--border)]">
        {product.thumbnails?.[0] ? (
          <img
            src={product.thumbnails[0]}
            alt={product.title}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        ) : (
          <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4 text-[var(--border)]">
            <rect x="2" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" />
            <rect x="5" y="1" width="9" height="13" rx="1" stroke="currentColor" strokeWidth="1.25" fill="var(--bg-subtle)" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-[var(--text-h)] truncate group-hover:text-[var(--accent)] transition-colors">
          {product.title}
        </p>
        <p className="text-xs text-[var(--text)] mt-0.5">
          {fmt(product.price)} · agregado el {fmtDate(product.createdAt)}
        </p>
      </div>
    </Link>
  );
};

/* ─── Dashboard ─────────────────────────────────────────────────────────────── */
const Dashboard = () => {
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
        // limit: 1 → solo interesa el metadato totalDocs, no la lista
        const [productsData, postsData, publishedData, outOfStockData, lowStockData] = await Promise.allSettled([
          getProducts({ limit: 1 }),
          getPosts({ limit: 1 }),
          getPosts({ limit: 1, published: true }),
          getProducts({ limit: 1, stock: 'out' }),
          getProducts({ limit: 1, stock: 'low' }), // incluye "sin stock"
        ]);

        const products = productsData.status === 'fulfilled'
          ? (productsData.value?.totalDocs ?? 0)
          : 0;
        const posts = postsData.status === 'fulfilled'
          ? (postsData.value?.totalDocs ?? 0)
          : 0;
        const publishedPosts = publishedData.status === 'fulfilled'
          ? (publishedData.value?.totalDocs ?? 0)
          : 0;
        const outOfStock = outOfStockData.status === 'fulfilled'
          ? (outOfStockData.value?.totalDocs ?? 0)
          : 0;
        const lowStock = lowStockData.status === 'fulfilled'
          ? (lowStockData.value?.totalDocs ?? 0)
          : 0;

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

  const statCards = [
    {
      label: 'Productos',
      value: stats.products,
      sublabel: 'en el catálogo',
      icon: <BookIcon />,
      href: '/admin/products',
      colorClass: {
        icon: 'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30',
        glow: 'bg-gradient-to-br from-violet-50/60 to-transparent dark:from-violet-900/10',
      },
      delay: '0ms',
    },
    {
      label: 'Posts totales',
      value: stats.posts,
      sublabel: `${stats.publishedPosts} publicados · ${stats.posts - stats.publishedPosts} borradores`,
      icon: <PostIcon />,
      href: '/admin/blog',
      colorClass: {
        icon: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/30',
        glow: 'bg-gradient-to-br from-sky-50/60 to-transparent dark:from-sky-900/10',
      },
      delay: '60ms',
    },
    {
      label: 'Stock bajo',
      value: stats.lowStock,
      sublabel: `${stats.outOfStock} sin stock · ${stats.lowStock - stats.outOfStock} con pocas unidades`,
      icon: <AlertIcon />,
      href: '/admin/products?stock=low',
      colorClass: {
        icon: stats.outOfStock > 0
          ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
          : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30',
        glow: stats.outOfStock > 0
          ? 'bg-gradient-to-br from-red-50/60 to-transparent dark:from-red-900/10'
          : 'bg-gradient-to-br from-amber-50/60 to-transparent dark:from-amber-900/10',
      },
      delay: '120ms',
    },
  ];

  const quickLinks = [
    {
      to: '/products',
      label: 'Ver tienda',
      description: 'Visualizá la tienda como la ven los usuarios.',
      icon: <StoreIcon />,
      delay: '100ms',
    },
    {
      to: '/blog',
      label: 'Ver blog',
      description: 'Visualizá el blog como lo ven los usuarios.',
      icon: <BlogIcon />,
      delay: '150ms',
    },
  ];

  /* Hora de saludo */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 19 ? 'Buenas tardes' : 'Buenas noches';

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          animation: fadeUp 0.45s ease both;
        }
        .stat-card {
          animation: fadeUp 0.45s ease both;
        }
        .quick-link {
          animation: fadeUp 0.45s ease both;
        }
      `}</style>

      <div className="bg-[var(--bg)]">
        <div className="max-w-4xl">

          {/* ── Encabezado ───────────────────────────────────────────────── */}
          <div className="fade-up mb-10" style={{ animationDelay: '0ms' }}>
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <h1 className="h1-admin leading-tight">
                  {greeting},{' '}
                  <span className="text-[var(--accent)]">
                    {user?.username ?? 'Admin'}
                  </span>
                </h1>
                <p className="mt-1.5 text-[var(--text)] text-sm">
                  Todo bajo control — acá está el resumen de tu sitio.
                </p>
              </div>

              {/* Pill de fecha */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
                               bg-[var(--bg-subtle)] border border-[var(--border)]
                               text-xs font-medium text-[var(--text)] shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {new Date().toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>

          {/* ── Stats ────────────────────────────────────────────────────── */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Spinner size="lg" className="text-[var(--accent)]" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {statCards.map((card) => (
                <StatCard key={card.label} {...card} />
              ))}
            </div>
          )}

          {/* ── Últimos productos agregados ─────────────────────────────────── */}
          {!loadingRecent && recentProducts.length > 0 && (
            <>
              <div className="fade-up flex items-center gap-3 mb-3" style={{ animationDelay: '170ms' }}>
                <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text)]">
                  Últimos productos agregados
                </span>
                <div className="flex-1 h-px bg-[var(--border)]" />
                <Link
                  to="/admin/products"
                  className="text-xs font-medium text-[var(--text)] hover:text-[var(--accent)] transition-colors shrink-0"
                >
                  Ver todos
                </Link>
              </div>
              <div
                className="fade-up rounded-2xl border border-[var(--border)] bg-[var(--bg)] px-3 py-1 mb-10 divide-y divide-[var(--border)]"
                style={{ animationDelay: '190ms' }}
              >
                {recentProducts.map((p) => (
                  <RecentProductRow key={p._id} product={p} />
                ))}
              </div>
            </>
          )}

          {/* ── Divider con label ─────────────────────────────────────────── */}
          <div className="fade-up flex items-center gap-3 mb-5" style={{ animationDelay: '200ms' }}>
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--text)]">
              Acciones rápidas
            </span>
            <div className="flex-1 h-px bg-[var(--border)]" />
          </div>

          {/* ── Quick links ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickLinks.map((link) => (
              <QuickLink key={link.to} {...link} />
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;
