import React, { createContext, useContext, useState, useEffect } from 'react';

export const SHIPPING_COST = 90;

export const ALL_SIZES   = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;
export const ALL_COLOURS = ['Black', 'White', 'Beige', 'Navy', 'Olive', 'Camel', 'Charcoal', 'Burgundy'] as const;

export type Size   = typeof ALL_SIZES[number];
export type Colour = typeof ALL_COLOURS[number];

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  sizes?: string[];
  colours?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColour?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, size?: string, colour?: string) => void;
  removeFromCart: (id: string, size?: string, colour?: string) => void;
  updateQuantity: (id: string, delta: number, size?: string, colour?: string) => void;
  clearCart: () => void;
  subtotal: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Unique key per product+size+colour combination
const itemKey = (id: string, size?: string, colour?: string) =>
  `${id}__${size ?? ''}__${colour ?? ''}`;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('osirids_cart');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('osirids_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, size?: string, colour?: string) => {
    setCartItems(prev => {
      const key      = itemKey(product.id, size, colour);
      const existing = prev.find(i => itemKey(i.id, i.selectedSize, i.selectedColour) === key);
      if (existing) {
        return prev.map(i =>
          itemKey(i.id, i.selectedSize, i.selectedColour) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size, selectedColour: colour }];
    });
  };

  const removeFromCart = (id: string, size?: string, colour?: string) => {
    const key = itemKey(id, size, colour);
    setCartItems(prev => prev.filter(i => itemKey(i.id, i.selectedSize, i.selectedColour) !== key));
  };

  const updateQuantity = (id: string, delta: number, size?: string, colour?: string) => {
    const key = itemKey(id, size, colour);
    setCartItems(prev =>
      prev.map(i =>
        itemKey(i.id, i.selectedSize, i.selectedColour) === key
          ? { ...i, quantity: Math.max(1, i.quantity + delta) }
          : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const subtotal   = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};