'use client';

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface CartItem {
  lineId: string;
  menuItemId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  variantName?: string;
  addOnNames?: string[];
  specialInstructions?: string;
  isVeg: boolean;
}

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  subtotal: number;
  taxAmount: number;
  deliveryFee: number;
  discountAmount: number;
  grandTotal: number;
  orderType: 'DELIVERY' | 'PICKUP';
  couponCode: string;
  isSheetOpen: boolean;
  openSheet: () => void;
  closeSheet: () => void;
  setOrderType: (type: 'DELIVERY' | 'PICKUP') => void;
  applyCoupon: (code: string) => boolean;
  addItem: (item: Omit<CartItem, 'lineId'>) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  clearCart: () => void;
}

const STORAGE_KEY = 'saanjh_cart_v1';

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [couponCode, setCouponCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Hydrate persisted cart across sessions (PRD 8.2)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.orderType === 'DELIVERY' || parsed.orderType === 'PICKUP') {
          setOrderType(parsed.orderType);
        }
      }
    } catch {
      // Ignore storage access errors
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, orderType }));
    } catch {
      // Ignore storage write errors
    }
  }, [items, orderType]);

  const addItem = useCallback((incoming: Omit<CartItem, 'lineId'>) => {
    const lineId = [
      incoming.menuItemId,
      incoming.variantName ?? 'std',
      (incoming.addOnNames ?? []).join('+'),
    ].join('::');

    setItems((prev) => {
      const existing = prev.find((i) => i.lineId === lineId);
      if (existing) {
        return prev.map((i) =>
          i.lineId === lineId ? { ...i, quantity: i.quantity + incoming.quantity } : i
        );
      }
      return [...prev, { ...incoming, lineId }];
    });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.lineId !== lineId);
      }
      return prev.map((i) => (i.lineId === lineId ? { ...i, quantity } : i));
    });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setCouponCode('');
    setDiscountPercent(0);
  }, []);

  const applyCoupon = useCallback((code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (normalized === 'SAANJH15') {
      setCouponCode(normalized);
      setDiscountPercent(15);
      return true;
    }
    if (normalized === 'HAPPYHOUR') {
      setCouponCode(normalized);
      setDiscountPercent(20);
      return true;
    }
    return false;
  }, []);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const discountAmount = Math.round((subtotal * discountPercent) / 100);
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Math.round(taxableAmount * 0.05); // 5% GST default
  const deliveryFee = orderType === 'DELIVERY' && subtotal > 0 ? 50 : 0;
  const grandTotal = taxableAmount + taxAmount + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        subtotal,
        taxAmount,
        deliveryFee,
        discountAmount,
        grandTotal,
        orderType,
        couponCode,
        isSheetOpen,
        openSheet: () => setIsSheetOpen(true),
        closeSheet: () => setIsSheetOpen(false),
        setOrderType,
        applyCoupon,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
