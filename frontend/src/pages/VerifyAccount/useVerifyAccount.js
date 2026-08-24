import { useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { verifyAccount } from '../../services/authService';

/**
 * Extrae el token de la URL, dispara la verificación una sola vez
 * y expone el estado resultante (loading | success | error | missing).
 */
const useVerifyAccount = () => {
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

  return { status, message };
};

export default useVerifyAccount;