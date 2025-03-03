import { getDB } from './index';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'Herbs' | 'Supplements';
  image_url: string;
  stock: number;
}

export const seedProducts = () => {
  const db = getDB();
  const products = [
    {
      name: 'Ashwagandha Root',
      description: 'Organic ashwagandha root powder for stress relief and immune support.',
      price: 2499, // $24.99
      category: 'Herbs',
      image_url: '/products/ashwagandha.jpg',
      stock: 100
    },
    {
      name: 'Turmeric Complex',
      description: 'High-potency turmeric with black pepper for enhanced absorption.',
      price: 1999, // $19.99
      category: 'Supplements',
      image_url: '/products/turmeric.jpg',
      stock: 100
    },
    {
      name: 'Holy Basil (Tulsi)',
      description: 'Traditional adaptogenic herb for stress management and vitality.',
      price: 1799, // $17.99
      category: 'Herbs',
      image_url: '/products/tulsi.jpg',
      stock: 100
    },
    {
      name: 'Triphala Blend',
      description: 'Classic Ayurvedic formula for digestive health.',
      price: 2199, // $21.99
      category: 'Herbs',
      image_url: '/products/triphala.jpg',
      stock: 100
    },
    {
      name: 'Vitamin D3 + K2',
      description: 'Synergistic combination for optimal calcium absorption.',
      price: 2899, // $28.99
      category: 'Supplements',
      image_url: '/products/vitamind.jpg',
      stock: 100
    },
    {
      name: 'Boswellia Extract',
      description: 'Standardized extract for joint and inflammatory support.',
      price: 3199, // $31.99
      category: 'Supplements',
      image_url: '/products/boswellia.jpg',
      stock: 100
    }
  ] as const;

  const existingProducts = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
  
  if (existingProducts.count === 0) {
    const stmt = db.prepare(`
      INSERT INTO products (name, description, price, category, image_url, stock)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    products.forEach(product => {
      stmt.run(
        product.name,
        product.description,
        product.price,
        product.category,
        product.image_url,
        product.stock
      );
    });
  }

  console.log('Products seeded successfully');
};
