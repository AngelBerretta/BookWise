import { Link } from 'react-router-dom';
import { PRODUCT_CATEGORIES } from '../../utils/constants';

const CategoryArrow = ({ className = '' }) => (
  <svg
    viewBox="0 0 16 16"
    fill="currentColor"
    className={`w-3.5 h-3.5 shrink-0 text-[var(--text-muted)] opacity-0 -translate-x-1
               group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ${className}`}
    aria-hidden="true"
  >
    <path fillRule="evenodd" d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

const HomeCategories = ({ sectionRef, visible }) => (
  <section ref={sectionRef} className={`container py-14 sm:py-20 reveal ${visible ? 'is-visible' : ''}`}>
    <div className="mb-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-2">
        Explorá
      </p>
      <h2 className="h2-editorial">Categorías</h2>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 border-t border-l border-[var(--border-subtle)]">
      {PRODUCT_CATEGORIES.map((cat, i) => {
        const number = String(i + 1).padStart(2, '0');
        return (
          <Link
            key={cat.value}
            to={`/products?category=${cat.value}`}
            className={`group relative border-r border-b border-[var(--border-subtle)]
                        transition-colors duration-300 hover:bg-[var(--bg-subtle)]
                        reveal ${visible ? 'is-visible' : ''}`}
            style={{ transitionDelay: visible ? `${i * 60}ms` : '0ms' }}
          >
            <div className="flex sm:hidden items-center gap-4 px-5 py-4">
              <span
                className="text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-300 shrink-0"
                style={{ fontFamily: 'var(--heading)', fontWeight: 400, fontSize: '1.5rem' }}
              >
                {number}
              </span>
              <span className="flex-1 text-sm font-medium text-[var(--text-h)]">{cat.label}</span>
              <CategoryArrow />
            </div>

            <div className="hidden sm:flex flex-col justify-between gap-10 md:gap-14 p-6 md:p-7 h-full">
              <span
                className="text-[var(--border)] group-hover:text-[var(--accent)] transition-colors duration-300"
                style={{ fontFamily: 'var(--heading)', fontWeight: 400, fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}
              >
                {number}
              </span>
              <span className="flex items-end justify-between gap-2">
                <span className="text-[0.95rem] font-medium text-[var(--text-h)] leading-snug">
                  {cat.label}
                </span>
                <CategoryArrow />
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  </section>
);

export default HomeCategories;