"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface CartItem {
  uniqueId: string;     // 👈 Identificador único por cada mueble agregado
  id: string | undefined;
  name: string;
  quantity: number;
  color?: string;
  size?: string;
  notes?: string;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "uniqueId">) => void;
  removeItem: (uniqueId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<CartItem, "uniqueId">) => {
    setItems((prev) => [
      ...prev,
      { ...item, uniqueId: crypto.randomUUID() }, // 👈 Cada ítem es único
    ]);
  };

  const removeItem = (uniqueId: string) => {
    setItems((prev) => prev.filter((i) => i.uniqueId !== uniqueId));
  };

  const clearCart = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
