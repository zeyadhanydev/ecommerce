import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { CartItem, Product } from '../types';
import toast from 'react-hot-toast';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  totalPrice: number;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(JSON.parse(localStorage.getItem('cart')!) ?? []);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    updateLocalStorage();
  }, [cartItems])

  const updateLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    if (!product || !product.id) {
        toast.error("Cannot add an invalid product to cart.");
        return;
    }
    if (typeof quantityToAdd !== 'number' || quantityToAdd <= 0) {
        quantityToAdd = 1; // Default to 1 if quantity is invalid
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantityToAdd } : item
        );
      }
      return [...prevItems, { ...product, quantity: quantityToAdd }];
    });
    toast.success(`${product.title} added to cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      if (itemToRemove) {
        toast.error(`${itemToRemove.title} removed from cart.`);
      }
      return prevItems.filter(item => item.id !== productId)
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (typeof quantity !== 'number') return; // Prevent unexpected behavior
    
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  // Use a try-catch for total price calculation to handle potential float issues safely, though simple reduce is usually fine.
  const totalPrice = cartItems.reduce((total, item) => {
      // Basic check for valid price/quantity
      const price = typeof item.price === 'number' && item.price > 0 ? item.price : 0;
      const quantity = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 0;
      return total + price * quantity;
  }, 0);


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, totalPrice, isCartOpen, setIsCartOpen }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    // This is the essential error handling for Context Hook usage
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};