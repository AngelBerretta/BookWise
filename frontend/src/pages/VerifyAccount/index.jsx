import useVerifyAccount from './useVerifyAccount';
import VerifyAccountLoading from './VerifyAccountLoading';
import VerifyAccountSuccess from './VerifyAccountSuccess';
import VerifyAccountError from './VerifyAccountError';

/**
 * Página de verificación de cuenta — toma el token de la URL,
 * dispara la verificación y renderiza el estado correspondiente.
 */
const VerifyAccount = () => {
  const { status, message } = useVerifyAccount();

  if (status === 'loading') return <VerifyAccountLoading />;
  if (status === 'success') return <VerifyAccountSuccess message={message} />;

  return <VerifyAccountError isError={status === 'error'} message={message} />;
};

export default VerifyAccount;