const SearchModalEmptyState = ({ term, loading, searched, hasResults }) => {
  if (!term) {
    return (
      <p className="px-5 py-10 text-center text-sm text-[var(--text)] opacity-60">
        Empezá a escribir para buscar en todo BookWise.
      </p>
    );
  }

  if (!loading && searched && !hasResults) {
    return (
      <p className="px-5 py-10 text-center text-sm text-[var(--text)]">
        No encontramos nada para <span className="font-medium text-[var(--text-h)]">"{term}"</span>.
      </p>
    );
  }

  return null;
};

export default SearchModalEmptyState;