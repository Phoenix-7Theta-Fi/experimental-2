'use client';

import { ProductCard } from './product-card';
import { Product } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

export function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<'Herbs' | 'Supplements' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const url = category ? `/api/products?category=${category}` : '/api/products';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch products');
        
        const data = await res.json();
        setProducts(data.products);
        setError(null);
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const handleAddToCart = useCallback(async (productId: number) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart');
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[#F8FAFC]">
          Ayurvedic Products
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`px-4 py-2 rounded transition-colors ${
              category === null
                ? 'bg-[#F97316] text-[#F8FAFC]'
                : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#0F172A]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setCategory('Herbs')}
            className={`px-4 py-2 rounded transition-colors ${
              category === 'Herbs'
                ? 'bg-[#F97316] text-[#F8FAFC]'
                : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#0F172A]'
            }`}
          >
            Herbs
          </button>
          <button
            onClick={() => setCategory('Supplements')}
            className={`px-4 py-2 rounded transition-colors ${
              category === 'Supplements'
                ? 'bg-[#F97316] text-[#F8FAFC]'
                : 'bg-[#1E293B] text-[#94A3B8] hover:bg-[#0F172A]'
            }`}
          >
            Supplements
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading products...</div>
      ) : error ? (
        <div className="text-red-400 text-center py-8">{error}</div>
      ) : products.length === 0 ? (
        <div className="text-[#94A3B8] text-center py-8">No products found</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
}
