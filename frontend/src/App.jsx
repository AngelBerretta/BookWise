import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import AppRouter from './router/AppRouter';

/**
 * Raíz de la aplicación.
 * Envuelve AppRouter con los contextos globales en el orden correcto:
 * AuthProvider primero (CartProvider y WishlistProvider dependen de él).
 * ToastProvider afuera de todo: cualquier contexto (incluso Auth) podría
 * necesitar mostrar un toast en el futuro (ej. sesión expirada).
 */
const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRouter />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
