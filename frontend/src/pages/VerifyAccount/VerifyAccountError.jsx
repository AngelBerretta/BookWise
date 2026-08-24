import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const VerifyAccountError = ({ isError, message }) => (
  <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
    <div className="w-full max-w-md text-center">

      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-red-600 dark:text-red-400"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-[var(--text-h)]">
        {isError ? 'Error al verificar' : 'Token no encontrado'}
      </h1>
      <p className="mt-3 text-[var(--text)]">
        {isError
          ? message
          : 'No hay ningún token en esta URL. Asegurate de usar el link que te enviamos por email.'}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        <Link to="/login">
          <Button variant="primary" size="lg" className="w-full">
            Ir al inicio de sesión
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="ghost" size="lg" className="w-full">
            Crear una cuenta nueva
          </Button>
        </Link>
      </div>

    </div>
  </main>
);

export default VerifyAccountError;