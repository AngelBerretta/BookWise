import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ToastProvider } from './context/ToastContext';
import { CheckoutProvider } from './context/CheckoutContext';
import AppRouter from './router/AppRouter';

/**
 * Raíz de la aplicación.
 * Envuelve AppRouter con los contextos globales en el orden correcto:
 * AuthProvider primero (CartProvider, CheckoutProvider y WishlistProvider
 * dependen de él). CheckoutProvider depende además de CartProvider (usa el
 * id del carrito para crear el pedido), así que va anidado dentro suyo.
 * ToastProvider afuera de todo: cualquier contexto (incluso Auth) podría
 * necesitar mostrar un toast en el futuro (ej. sesión expirada).
 */
const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <CheckoutProvider>
            <WishlistProvider>
              <AppRouter />
            </WishlistProvider>
          </CheckoutProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
