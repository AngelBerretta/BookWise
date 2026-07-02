import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

/**
 * Página 404 — ruta no encontrada.
 */
const NotFound = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center gap-6 max-w-md">

        {/* Número 404 decorativo */}
        <div className="relative select-none" aria-hidden="true">
          <span
            className="text-[10rem] font-black leading-none tracking-tighter"
            style={{
              color: 'transparent',
              WebkitTextStroke: '2px var(--border)',
            }}
          >
            404
          </span>
          {/* Ícono libro superpuesto */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-[var(--accent-bg)] border border-[var(--accent-border)]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-10 h-10 text-[var(--accent)]"
              >
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                <line x1="12" y1="7" x2="12" y2="13" />
                <line x1="9" y1="10" x2="15" y2="10" />
              </svg>
            </div>
          </div>
        </div>

        {/* Texto */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-[var(--text-h)]">
            Página no encontrada
          </h1>
          <p className="text-[var(--text)] leading-relaxed">
            La página que buscás no existe o fue movida.
            <br />
            Quizás encontrás algo interesante en el inicio.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" size="lg">
              Volver al inicio
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary" size="lg">
              Ver libros
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;