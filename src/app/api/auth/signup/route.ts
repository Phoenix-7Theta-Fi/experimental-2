import { NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { createUser, hashPassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password and role are required' },
        { status: 400 }
      );
    }

    if (!['patient', 'practitioner'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' },
        { status: 400 }
      );
    }

    const db = getDB();
    const existingUser = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email);

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const userId = await createUser(email, hashedPassword, role);

    return NextResponse.json({
      id: userId,
      email,
      role,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'An error occurred during signup' },
      { status: 500 }
    );
  }
}
