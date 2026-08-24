import { BookIcon, PostIcon, AlertIcon, StoreIcon, BlogIcon } from './icons';

export const buildStatCards = (stats) => [
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

export const quickLinks = [
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