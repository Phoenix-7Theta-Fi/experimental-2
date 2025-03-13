'use client';

import { Product } from '@/lib/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number) => Promise<void>;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      await onAddToCart(product.id);
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="bg-[#334155] rounded-lg shadow-lg shadow-black/20 overflow-hidden border border-[#475569]">
      <div className="relative h-48">
        <Image
          src={product.image_url}
          alt={product.name}
          width={400}
          height={300}
          className="object-cover w-full h-full"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          priority
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-[#F8FAFC]">{product.name}</h3>
        <p className="text-[#94A3B8] mb-2 text-sm line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-[#F8FAFC]">₹{product.price}</span>
          <span className="text-sm text-[#94A3B8]">{product.category}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowDetails(true)}
            className="flex-1 bg-[#1E293B] text-[#F8FAFC] py-2 px-4 rounded hover:bg-[#0F172A] transition-colors"
          >
            Know More
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="flex-1 bg-[#F97316] text-white py-2 px-4 rounded hover:bg-[#EA580C] transition-colors disabled:opacity-50"
          >
            {isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>

      {showDetails && typeof window !== 'undefined' && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDetails(false)}
        >
          <div 
            className="bg-[#1E293B] rounded-lg p-6 max-w-lg w-full border border-[#475569]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-[#F8FAFC]">{product.name}</h2>
            <p className="text-[#94A3B8] mb-4">{product.description}</p>
            <div className="flex justify-between items-center mb-4">
              <span className="text-2xl font-bold text-[#F8FAFC]">₹{product.price}</span>
              <span className="text-[#94A3B8]">{product.category}</span>
            </div>
            <button
              onClick={() => setShowDetails(false)}
              className="w-full bg-[#0F172A] text-[#F8FAFC] py-2 px-4 rounded hover:bg-[#1E293B] transition-colors"
            >
              Close
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
