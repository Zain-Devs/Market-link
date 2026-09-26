import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types';

export interface FlyingArrow {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
}

export interface CartToast {
  id: number;
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, event?: React.MouseEvent) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalAmount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isCartBouncing: boolean;
  flyingArrows: FlyingArrow[];
  activeToast: CartToast | null;
  dismissToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'marketlink_cart_v1';

// Subtle organic synth chime on basket addition using Web Audio API
function playOrganicBasketChime() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    // Harmonic bell pair (E5 -> B5)
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(659.25, now); // E5
    osc1.frequency.exponentialRampToValueAtTime(987.77, now + 0.12); // B5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(1318.5, now); // E6 overtone

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.32);
    osc2.stop(now + 0.32);
  } catch {
    // Audio optional if blocked by browser policy
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCartBouncing, setIsCartBouncing] = useState(false);
  const [flyingArrows, setFlyingArrows] = useState<FlyingArrow[]>([]);
  const [activeToast, setActiveToast] = useState<CartToast | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart:', e);
    }
  }, [items]);

  const dismissToast = () => setActiveToast(null);

  const addToCart = (product: Product, quantity = 1, event?: React.MouseEvent) => {
    if (product.is_sold_out || product.stock_quantity <= 0) return;

    // Play pleasant confirmation audio
    playOrganicBasketChime();

    // Trigger toast notification
    const toastId = Date.now();
    setActiveToast({
      id: toastId,
      product,
      quantity
    });

    // Auto dismiss toast after 3.8s
    setTimeout(() => {
      setActiveToast(current => (current?.id === toastId ? null : current));
    }, 3800);

    // Trigger Dynamic Flying Arrow animation towards the Cart Icon
    if (event) {
      const startX = event.clientX;
      const startY = event.clientY;

      const cartBtn = document.getElementById('navbar-cart-btn');
      let targetX = window.innerWidth - 60;
      let targetY = 32;

      if (cartBtn) {
        const rect = cartBtn.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
      }

      const arrowId = Date.now();
      const newArrow: FlyingArrow = {
        id: arrowId,
        startX,
        startY,
        targetX,
        targetY,
        productName: product.name,
        productImage: product.image_url,
        productPrice: product.price,
        quantity
      };

      setFlyingArrows(prev => [...prev, newArrow]);

      // Remove arrow after flight and trigger cart bounce + shockwave
      setTimeout(() => {
        setFlyingArrows(prev => prev.filter(a => a.id !== arrowId));
        setIsCartBouncing(true);
        setTimeout(() => setIsCartBouncing(false), 900);
      }, 720);
    } else {
      setIsCartBouncing(true);
      setTimeout(() => setIsCartBouncing(false), 900);
    }

    setItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        const newQty = Math.min(product.stock_quantity, existing.quantity + quantity);
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock_quantity, quantity) }];
    });
  };

  const removeFromCart = (productId: number) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const max = item.product.stock_quantity;
          return { ...item, quantity: Math.min(max, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = Number(
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0).toFixed(2)
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
        isCartOpen,
        setIsCartOpen,
        isCartBouncing,
        flyingArrows,
        activeToast,
        dismissToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

