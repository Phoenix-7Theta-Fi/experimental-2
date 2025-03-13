import { NextResponse } from 'next/server';
import { seedProducts } from '@/lib/db/products';

export async function GET() {
  try {
    seedProducts();
    return NextResponse.json({ message: 'Products seeded successfully' });
  } catch (error) {
    console.error('Error seeding products:', error);
    return NextResponse.json(
      { error: 'Failed to seed products' },
      { status: 500 }
    );
  }
}
