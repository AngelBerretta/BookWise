import useBlog from '../../hooks/useBlog';

/**
 * Envuelve useBlog con los datos derivados propios de esta página:
 * separa el primer post (destacado) del resto, y decide si corresponde
 * mostrarlo (solo en la página 1 sin búsqueda activa).
 */
const useBlogList = () => {
  const { posts, loading, error, search, setSearch, page, setPage, totalPages, refetch } = useBlog();

  const [featured, ...rest] = posts;

  // Se sabe antes de que responda el fetch, por eso también puede
  // decidirse durante el estado de loading (para el skeleton).
  const showFeatured = !search && page === 1;

  const visiblePosts = search || page > 1 ? posts : rest;

  return {
    posts, loading, error, search, setSearch,
    page, setPage, totalPages, refetch,
    featured, showFeatured, visiblePosts,
  };
};

export default useBlogList;