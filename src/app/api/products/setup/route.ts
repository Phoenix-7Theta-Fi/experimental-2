import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { seedProducts } from '@/lib/db/products';

export async function GET() {
  try {
    getDB(); // Ensures database and tables exist
    seedProducts();
    
    return NextResponse.json({
      message: 'Products initialized successfully',
      success: true
    });
  } catch (error) {
    console.error('Error initializing products:', error);
    return NextResponse.json(
      { error: 'Failed to initialize products' },
      { status: 500 }
    );
  }
}
