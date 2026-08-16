import { createPortal } from 'react-dom';
import useSearchModal from './useSearchModal';
import SearchModalHeader from './SearchModalHeader';
import SearchModalProductResults from './SearchModalProductResults';
import SearchModalPostResults from './SearchModalPostResults';
import SearchModalEmptyState from './SearchModalEmptyState';
import SearchModalFooter from './SearchModalFooter';

/**
 * Buscador global — se abre con el ícono de lupa del navbar o Cmd+K / Ctrl+K.
 * Busca productos y posts del blog en paralelo (debounced) y linkea directo
 * a cada resultado, o a "ver todos los resultados" en /products.
 */
const SearchModal = ({ onClose }) => {
  const {
    query, setQuery, loading, searched, inputRef,
    term, displayedProducts, displayedPosts, hasResults,
    goToAllResults, handleSubmit,
  } = useSearchModal(onClose);

  return createPortal(
    <div
      className="fixed inset-0 z-[9500] flex items-start justify-center px-4 pt-20 sm:pt-28"
      role="dialog"
      aria-modal="true"
      aria-label="Buscador"
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div className="relative w-full max-w-xl rounded-2xl bg-[var(--bg)] border border-[var(--border)] shadow-[var(--shadow-lg)] flex flex-col max-h-[70vh] overflow-hidden">
        <SearchModalHeader query={query} setQuery={setQuery} loading={loading} onSubmit={handleSubmit} inputRef={inputRef} />

        <div className="overflow-y-auto flex-1">
          <SearchModalEmptyState term={term} loading={loading} searched={searched} hasResults={hasResults} />

          {displayedProducts.length > 0 && (
            <SearchModalProductResults products={displayedProducts} onNavigate={onClose} />
          )}

          {displayedPosts.length > 0 && (
            <SearchModalPostResults posts={displayedPosts} onNavigate={onClose} />
          )}
        </div>

        {term && hasResults && <SearchModalFooter term={term} onClick={goToAllResults} />}
      </div>
    </div>,
    document.body
  );
};

export default SearchModal;