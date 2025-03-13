import { getDB } from './index';
import { Product, CartItem } from '@/lib/types';

export const getAllProducts = (): Product[] => {
  const db = getDB();
  try {
    const products = db.prepare(`
      SELECT *
      FROM products
      ORDER BY name ASC
    `).all() as Product[];
    
    return products;
  } catch (error) {
    console.error('Error fetching all products:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getProductsByCategory = (category: 'Herbs' | 'Supplements'): Product[] => {
  const db = getDB();
  try {
    const products = db.prepare(`
      SELECT *
      FROM products
      WHERE category = ?
      ORDER BY name ASC
    `).all(category) as Product[];
    
    return products;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw new Error('Failed to fetch products');
  }
};

export const getCartItems = (userId: number): CartItem[] => {
  const db = getDB();
  try {
    const cartItems = db.prepare(`
      SELECT 
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        ci.created_at,
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        p.price as product_price,
        p.category as product_category,
        p.image_url as product_image_url,
        p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `).all(userId) as Array<{
      id: number;
      user_id: number;
      product_id: number;
      quantity: number;
      created_at: string;
      product_name: string;
      product_description: string;
      product_price: number;
      product_category: 'Herbs' | 'Supplements';
      product_image_url: string;
      product_stock: number;
    }>;

    // Transform the flat results into nested CartItem objects
    return cartItems.map(item => ({
      id: item.id,
      user_id: item.user_id,
      product_id: item.product_id,
      quantity: item.quantity,
      created_at: item.created_at,
      product: {
        id: item.product_id,
        name: item.product_name,
        description: item.product_description,
        price: item.product_price,
        category: item.product_category,
        image_url: item.product_image_url,
        stock: item.product_stock
      }
    }));
  } catch (error) {
    console.error('Error fetching cart items:', error);
    throw new Error('Failed to fetch cart items');
  }
};

export const updateCartItemQuantity = (cartItemId: number, newQuantity: number): CartItem => {
  const db = getDB();
  try {
    db.exec('BEGIN TRANSACTION');

    // Get current cart item to calculate stock change
    const currentItem = db.prepare(`
      SELECT quantity, product_id 
      FROM cart_items 
      WHERE id = ?
    `).get(cartItemId) as { quantity: number; product_id: number } | undefined;

    if (!currentItem) {
      throw new Error('Cart item not found');
    }

    // Calculate stock change
    const quantityDiff = newQuantity - currentItem.quantity;
    
    // Check if enough stock available
    const product = db.prepare(`
      SELECT stock 
      FROM products 
      WHERE id = ?
    `).get(currentItem.product_id) as { stock: number } | undefined;

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock < quantityDiff) {
      throw new Error('Not enough stock');
    }

    // Update cart item quantity
    db.prepare(`
      UPDATE cart_items 
      SET quantity = ? 
      WHERE id = ?
    `).run(newQuantity, cartItemId);

    // Update product stock
    db.prepare(`
      UPDATE products 
      SET stock = stock - ? 
      WHERE id = ?
    `).run(quantityDiff, currentItem.product_id);

    db.exec('COMMIT');

    // Return updated cart item with product details
    const updatedItem = db.prepare(`
      SELECT 
        ci.id,
        ci.user_id,
        ci.product_id,
        ci.quantity,
        ci.created_at,
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        p.price as product_price,
        p.category as product_category,
        p.image_url as product_image_url,
        p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = ?
    `).get(cartItemId) as any;

    return {
      id: updatedItem.id,
      user_id: updatedItem.user_id,
      product_id: updatedItem.product_id,
      quantity: updatedItem.quantity,
      created_at: updatedItem.created_at,
      product: {
        id: updatedItem.product_id,
        name: updatedItem.product_name,
        description: updatedItem.product_description,
        price: updatedItem.product_price,
        category: updatedItem.product_category,
        image_url: updatedItem.product_image_url,
        stock: updatedItem.product_stock
      }
    };
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('Error updating cart item:', error);
    throw error;
  }
};

export const removeFromCart = (cartItemId: number): void => {
  const db = getDB();
  try {
    db.exec('BEGIN TRANSACTION');

    // Get current cart item to restore stock
    const currentItem = db.prepare(`
      SELECT quantity, product_id 
      FROM cart_items 
      WHERE id = ?
    `).get(cartItemId) as { quantity: number; product_id: number } | undefined;

    if (!currentItem) {
      throw new Error('Cart item not found');
    }

    // Restore product stock
    db.prepare(`
      UPDATE products 
      SET stock = stock + ? 
      WHERE id = ?
    `).run(currentItem.quantity, currentItem.product_id);

    // Remove cart item
    db.prepare('DELETE FROM cart_items WHERE id = ?').run(cartItemId);

    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('Error removing cart item:', error);
    throw error;
  }
};

export const addToCart = (userId: number, productId: number) => {
  const db = getDB();
  try {
    db.exec('BEGIN TRANSACTION');

    // Check if product exists and has stock
    const product = db.prepare(
      'SELECT id, stock FROM products WHERE id = ?'
    ).get(productId) as Product | undefined;

    if (!product) {
      throw new Error('Product not found');
    }

    if (product.stock <= 0) {
      throw new Error('Product out of stock');
    }

    // Check if item already in cart
    const existingItem = db.prepare(`
      SELECT quantity 
      FROM cart_items 
      WHERE user_id = ? AND product_id = ?
    `).get(userId, productId) as { quantity: number } | undefined;

    if (existingItem) {
      // Update quantity if already in cart
      db.prepare(`
        UPDATE cart_items 
        SET quantity = quantity + 1
        WHERE user_id = ? AND product_id = ?
      `).run(userId, productId);
    } else {
      // Add new item to cart
      db.prepare(`
        INSERT INTO cart_items (user_id, product_id, quantity)
        VALUES (?, ?, 1)
      `).run(userId, productId);
    }

    // Decrease product stock
    db.prepare(`
      UPDATE products
      SET stock = stock - 1
      WHERE id = ?
    `).run(productId);

    db.exec('COMMIT');

    // Return updated cart item
    const cartItems = db.prepare(`
      SELECT 
        ci.*,
        p.id as product_id,
        p.name as product_name,
        p.description as product_description,
        p.price as product_price,
        p.category as product_category,
        p.image_url as product_image_url,
        p.stock as product_stock
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ? AND ci.product_id = ?
    `).get(userId, productId) as any;

    return {
      ...cartItems,
      product: {
        id: cartItems.product_id,
        name: cartItems.product_name,
        description: cartItems.product_description,
        price: cartItems.product_price,
        category: cartItems.product_category,
        image_url: cartItems.product_image_url,
        stock: cartItems.product_stock
      }
    };
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const clearCart = (userId: number) => {
  const db = getDB();
  try {
    db.exec('BEGIN TRANSACTION');

    // Get current cart items to restore stock
    const cartItems = db.prepare(`
      SELECT product_id, quantity
      FROM cart_items
      WHERE user_id = ?
    `).all(userId) as { product_id: number; quantity: number }[];

    // Restore stock for each item
    cartItems.forEach(item => {
      db.prepare(`
        UPDATE products
        SET stock = stock + ?
        WHERE id = ?
      `).run(item.quantity, item.product_id);
    });

    // Clear cart
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

    db.exec('COMMIT');
  } catch (error) {
    db.exec('ROLLBACK');
    console.error('Error clearing cart:', error);
    throw new Error('Failed to clear cart');
  }
};

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
