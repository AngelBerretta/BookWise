const AuthSideQuote = () => (
  <div className="mt-16 pl-6" style={{ borderLeft: '2px solid rgba(238,189,142,0.50)' }}>
    <p
      className="font-headline italic text-lg md:text-xl leading-relaxed"
      style={{ color: 'var(--bw-on-primary)' }}
    >
      "Una habitación sin libros es como un cuerpo sin alma."
    </p>
    <p
      className="font-label text-sm mt-2 tracking-widest uppercase"
      style={{ color: 'var(--bw-primary-fixed)' }}
    >
      — Marco Tulio Cicerón
    </p>
  </div>
);

export default AuthSideQuote;