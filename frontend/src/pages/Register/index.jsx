import { useState } from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import AuthSidePanel from '../../components/auth/AuthSidePanel';
import AuthPageLayout from '../../components/auth/AuthPageLayout';
import AuthBrandHeader from '../../components/auth/AuthBrandHeader';
import AuthTabs from '../../components/auth/AuthTabs';
import RegisterSuccessPanel from './RegisterSuccessPanel';

const sidePanelProps = {
  headline: (
    <>
      Empezá tu propia{' '}
      <em style={{ color: 'var(--bw-tertiary-fixed-dim)' }}>colección</em>{' '}
      hoy.
    </>
  ),
  subtitle: 'Creá tu cuenta gratis y accedé a un catálogo curado, reseñas editoriales y guardá tus próximas lecturas en un solo lugar.',
  badge: 'Unite a la comunidad',
};

const Register = () => {
  const [registered, setRegistered] = useState(false);

  if (registered) {
    return (
      <AuthPageLayout
        innerClassName="flex flex-col items-center gap-6 text-center"
        sidePanel={<AuthSidePanel />}
      >
        <RegisterSuccessPanel onBack={() => setRegistered(false)} />
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout
      innerClassName="flex flex-col gap-[clamp(0.5rem,1.8dvh,1rem)]"
      sidePanel={<AuthSidePanel {...sidePanelProps} />}
    >
      <AuthBrandHeader
        title="Sumate a la biblioteca."
        subtitle="Creá tu cuenta y empezá a descubrir colecciones únicas."
      />
      <AuthTabs active="register" />
      <RegisterForm onSuccess={() => setRegistered(true)} />
    </AuthPageLayout>
  );
};

export default Register;