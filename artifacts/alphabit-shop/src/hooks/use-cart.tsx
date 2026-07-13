import React, { createContext, useContext, useEffect, useState } from 'react';

export interface CartItem {
  product_id: string;
  quantity: number;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cartCount: number;
  cartSubtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('alphabit_cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('alphabit_cart', JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = (newItem: CartItem) => {
    setItems(current => {
      const existing = current.find(item => item.product_id === newItem.product_id);
      if (existing) {
        return current.map(item => 
          item.product_id === newItem.product_id
            ? { ...item, quantity: Math.min(item.quantity + newItem.quantity, item.stock) }
            : item
        );
      }
      return [...current, newItem];
    });
    setIsCartOpen(true);
  };

  const removeItem = (productId: string) => {
    setItems(current => current.filter(item => item.product_id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(current => 
      current.map(item => 
        item.product_id === productId 
          ? { ...item, quantity: Math.min(quantity, item.stock) } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
      cartCount,
      cartSubtotal
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
