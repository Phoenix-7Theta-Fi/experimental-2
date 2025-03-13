import { NextRequest, NextResponse } from 'next/server';
import { getCartItems, addToCart, clearCart } from '@/lib/db/products';
import { getUserSession } from '@/lib/auth';

export async function GET() {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const cartItems = getCartItems(userId);
    return NextResponse.json({ cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { productId } = await request.json();
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    try {
      const cartItem = addToCart(userId, productId);
      return NextResponse.json({ cartItem });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Product not found') {
          return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
          );
        }
        if (error.message === 'Product out of stock') {
          return NextResponse.json(
            { error: 'Product is out of stock' },
            { status: 400 }
          );
        }
      }
      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    clearCart(userId);
    return NextResponse.json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    );
  }
}
