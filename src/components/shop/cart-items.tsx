'use client';

import { CartItem } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

export function CartItems() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch('/api/cart');
      if (!res.ok) throw new Error('Failed to fetch cart');
      
      const data = await res.json();
      setCartItems(data.cartItems);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load cart');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!res.ok) throw new Error('Failed to update quantity');
      fetchCart();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (itemId: number) => {
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to remove item');
      fetchCart();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to clear cart');
      fetchCart();
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to clear cart');
    }
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.product!.price * item.quantity,
    0
  );

  if (isLoading) {
    return (
      <div className="text-[#F8FAFC]">Loading...</div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400">{error}</div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-[#94A3B8] text-center">Your cart is empty</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#F8FAFC]">Your Cart</h1>
        <button
          onClick={clearCart}
          className="text-red-400 hover:text-red-500 transition-colors"
        >
          Clear Cart
        </button>
      </div>

      <div className="space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-[#334155] p-4 rounded-lg shadow-lg shadow-black/20 border border-[#475569] flex items-center gap-4"
          >
            <div className="flex-1">
              <h3 className="font-semibold text-[#F8FAFC]">{item.product!.name}</h3>
              <p className="text-[#94A3B8] text-sm">{item.product!.category}</p>
              <p className="text-[#F97316] font-semibold mt-1">
                ₹{item.product!.price}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-8 h-8 flex items-center justify-center bg-[#1E293B] text-[#F8FAFC] rounded hover:bg-[#0F172A] transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center text-[#F8FAFC]">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-8 h-8 flex items-center justify-center bg-[#1E293B] text-[#F8FAFC] rounded hover:bg-[#0F172A] transition-colors"
              >
                +
              </button>
            </div>

            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-500 transition-colors p-2"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-[#1E293B] p-4 rounded-lg border border-[#475569]">
        <div className="flex justify-between items-center text-lg font-semibold text-[#F8FAFC]">
          <span>Total:</span>
          <span>₹{totalAmount}</span>
        </div>
      </div>
    </div>
  );
}
