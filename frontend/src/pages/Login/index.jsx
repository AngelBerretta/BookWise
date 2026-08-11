import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoginForm from '../../components/auth/LoginForm';
import AuthSidePanel from '../../components/auth/AuthSidePanel';
import AuthPageLayout from '../../components/auth/AuthPageLayout';
import AuthBrandHeader from '../../components/auth/AuthBrandHeader';
import AuthTabs from '../../components/auth/AuthTabs';
import DemoAccountsPanel from './DemoAccountsPanel';

const Login = () => {
  const { isAuthenticated, loading, user, login } = useAuth();
  const navigate = useNavigate();
  const [demoLoading, setDemoLoading] = useState(null); // 'user' | 'admin' | null

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(user?.role === 'admin' ? '/admin' : '/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate, user]);

  const handleLoginSuccess = (user) => {
    navigate(user?.role === 'admin' ? '/admin' : '/products', { replace: true });
  };

  const handleDemoLogin = async (kind) => {
    setDemoLoading(kind);
    try {
      const credentials = kind === 'admin'
        ? { email: 'admin-demo@bookwise.com', password: 'Demo1234!' }
        : { email: 'demo@bookwise.com', password: 'Demo1234!' };
      const result = await login(credentials);
      handleLoginSuccess(result?.user);
    } catch {
      setDemoLoading(null);
    }
  };

  if (loading) return null;

  return (
    <AuthPageLayout sidePanel={<AuthSidePanel />}>
      <AuthBrandHeader
        title="Bienvenido de nuevo a la biblioteca."
        subtitle="Ingresá tus credenciales para acceder a tus colecciones curadas y hallazgos únicos."
      />
      <AuthTabs active="login" />
      <DemoAccountsPanel demoLoading={demoLoading} onDemoLogin={handleDemoLogin} />
      <LoginForm onSuccess={handleLoginSuccess} />
    </AuthPageLayout>
  );
};

export default Login;