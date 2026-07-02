import { Link } from 'react-router-dom';

const FOOTER_LINKS = {
  Tienda: [
    { to: '/products',                    label: 'Catálogo completo' },
    { to: '/products?query=ficcion',      label: 'Ficción' },
    { to: '/products?query=no-ficcion',   label: 'No Ficción' },
    { to: '/products?query=ebooks',       label: 'E-books' },
  ],
  Explorar: [
    { to: '/blog',  label: 'Diario del curador' },
    { to: '/cart',  label: 'Mi carrito' },
  ],
  Cuenta: [
    { to: '/login',    label: 'Iniciar sesión' },
    { to: '/register', label: 'Registrarse' },
  ],
};

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto" role="contentinfo">
      {/* Cuerpo */}
      <div
        className="py-16"
        style={{ background: '#041627', color: '#fbf9f4' }}
      >
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12 pb-12"
            style={{ borderBottom: '1px solid rgba(251,249,244,0.12)' }}
          >
            {/* Marca */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
              <span
                className="text-xl font-medium tracking-tighter"
                style={{ fontFamily: 'var(--heading)', color: '#fbf9f4' }}
              >
                BookWise
              </span>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(251,249,244,0.6)' }}>
                Curando las mejores experiencias literarias para el lector exigente.
              </p>
            </div>

            {/* Links */}
            {Object.entries(FOOTER_LINKS).map(([section, links]) => (
              <div key={section} className="flex flex-col gap-3">
                <h3
                  className="text-xs font-semibold uppercase tracking-widest"
                  style={{ color: 'rgba(251,249,244,0.4)' }}
                >
                  {section}
                </h3>
                <ul className="flex flex-col gap-2.5" role="list">
                  {links.map(({ to, label }) => (
                    <li key={to}>
                      <Link
                        to={to}
                        className="text-sm transition-opacity hover:opacity-100"
                        style={{ color: 'rgba(251,249,244,0.6)', opacity: 0.8 }}
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: 'rgba(251,249,244,0.4)' }}>
              © {year} BookWise. Todos los derechos reservados.
            </p>
            <p className="text-xs" style={{ color: 'rgba(251,249,244,0.4)' }}>
              Hecho con ♥ y muchos libros
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;