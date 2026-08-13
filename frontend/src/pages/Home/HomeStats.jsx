const HomeStats = ({ sectionRef, visible, stats }) => (
  <section
    ref={sectionRef}
    className={`py-14 sm:py-16 reveal ${visible ? 'is-visible' : ''}`}
    style={{ background: 'var(--bg-subtle)' }}
  >
    <div className="container grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
      {stats.map((s, i) => (
        <div
          key={s.label}
          className={`flex flex-col items-center text-center gap-1 reveal ${visible ? 'is-visible' : ''}`}
          style={{ transitionDelay: visible ? `${i * 90}ms` : '0ms' }}
        >
          <span
            className="text-[var(--text-h)]"
            style={{ fontFamily: 'var(--heading)', fontWeight: 500, fontSize: 'clamp(2rem, 5vw, 2.75rem)' }}
          >
            {s.value === null
              ? <span className="inline-block h-9 w-14 rounded-md bg-[var(--bg-container)] animate-pulse align-middle" />
              : s.value}
          </span>
          <span className="text-sm text-[var(--text)]">{s.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default HomeStats;