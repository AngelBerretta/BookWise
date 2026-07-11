import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AppRouter from './router/AppRouter';

/**
 * Raíz de la aplicación.
 * Envuelve AppRouter con los contextos globales en el orden correcto:
 * AuthProvider primero (CartProvider y WishlistProvider dependen de él).
 */
const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <AppRouter />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
