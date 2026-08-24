import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const VerifyAccountSuccess = ({ message }) => (
  <main className="min-h-screen flex items-center justify-center px-4 bg-[var(--bg)]">
    <div className="w-full max-w-md text-center">

      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900">
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-8 w-8 text-emerald-600 dark:text-emerald-400"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      <h1 className="text-2xl font-semibold text-[var(--text-h)]">
        ¡Cuenta verificada!
      </h1>
      <p className="mt-3 text-[var(--text)]">{message}</p>

      <div className="mt-8">
        <Link to="/login">
          <Button variant="primary" size="lg" className="w-full">
            Ir al inicio de sesión
          </Button>
        </Link>
      </div>

    </div>
  </main>
);

export default VerifyAccountSuccess;