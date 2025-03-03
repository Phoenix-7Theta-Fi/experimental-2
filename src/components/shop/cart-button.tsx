'use client';

import { CartItem } from '@/lib/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CartButton() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const res = await fetch('/api/cart');
        if (!res.ok) return;
        
        const data = await res.json();
        const items = data.cartItems as CartItem[];
        setItemCount(items.reduce((sum, item) => sum + item.quantity, 0));
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };

    fetchCartItems();
    
    // Refresh cart count every 30 seconds
    const interval = setInterval(fetchCartItems, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Link href="/cart" className="relative group">
      <div className="text-[#94A3B8] hover:text-[#F97316] transition-colors flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#F97316] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </div>
    </Link>
  );
}
