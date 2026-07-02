import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRouter from './router/AppRouter';

/**
 * Raíz de la aplicación.
 * Envuelve AppRouter con los contextos globales en el orden correcto:
 * AuthProvider primero (CartProvider depende de él).
 */
const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <AppRouter />
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
