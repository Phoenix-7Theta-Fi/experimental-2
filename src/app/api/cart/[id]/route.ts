import { NextRequest, NextResponse } from 'next/server';
import { updateCartItemQuantity, removeFromCart } from '@/lib/db/products';
import { getUserSession } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const { quantity } = await request.json();
    if (typeof quantity !== 'number' || quantity < 1) {
      return NextResponse.json(
        { error: 'Invalid quantity' },
        { status: 400 }
      );
    }

    try {
      const cartItem = updateCartItemQuantity(Number(params.id), quantity);
      return NextResponse.json({ cartItem });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Cart item not found') {
          return NextResponse.json(
            { error: 'Cart item not found' },
            { status: 404 }
          );
        }
        if (error.message === 'Not enough stock') {
          return NextResponse.json(
            { error: 'Not enough stock available' },
            { status: 400 }
          );
        }
        if (error.message === 'Product not found') {
          return NextResponse.json(
            { error: 'Product not found' },
            { status: 404 }
          );
        }
      }
      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserSession();
    if (!userId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    try {
      removeFromCart(Number(params.id));
      return NextResponse.json({ message: 'Item removed from cart' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Cart item not found') {
          return NextResponse.json(
            { error: 'Cart item not found' },
            { status: 404 }
          );
        }
      }
      throw error; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    );
  }
}
