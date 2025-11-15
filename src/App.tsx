import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { CartProvider } from './contexts/CartContext';
import { ProductProvider } from './contexts/ProductContext';
import { SearchProvider } from './contexts/SearchContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CartProvider>
          <SearchProvider>
            <RouterProvider router={router} />
          </SearchProvider>
        </CartProvider>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;
