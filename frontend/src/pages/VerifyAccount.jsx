import { useEffect, useState, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { verifyAccount } from '../services/authService';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const VerifyAccount = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState(() => (token ? 'loading' : 'missing'));
  const [message, setMessage] = useState('');
  const calledRef = useRef(false);

  useEffect(() => {
    if (!token || calledRef.current) return;
    calledRef.current = true;

    const verify = async () => {
      try {
        const data = await verifyAccount(token);
        setMessage(data?.message || '¡Tu cuenta fue verificada exitosamente!');
        setStatus('success');
      } catch (err) {
        const errMsg =
          err?.response?.data?.message ||
          err?.response?.data?.error  ||
          err?.message                ||
          'No pudimos verificar tu cuenta. El link puede haber expirado.';
        setMessage(errMsg);
        setStatus('error');
      }
    };

    verify();
  }, [token]);

  /* ── Estados UI ── */

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
        <div className="text-center">
          <Spinner size="lg" className="text-[var(--accent)] mx-auto" />
          <p className="mt-4 text-[var(--text)]">Verificando tu cuenta…</p>
        </div>
      </main>
    );
  }

  if (status === 'success') {
    return (
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
  }

  /* error | missing */
  const isError = status === 'error';

  return (
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
};

export default VerifyAccount;