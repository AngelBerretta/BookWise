import Spinner from '../../components/ui/Spinner';

const VerifyAccountLoading = () => (
  <main className="min-h-screen flex items-center justify-center bg-[var(--bg)]">
    <div className="text-center">
      <Spinner size="lg" className="text-[var(--accent)] mx-auto" />
      <p className="mt-4 text-[var(--text)]">Verificando tu cuenta…</p>
    </div>
  </main>
);

export default VerifyAccountLoading;