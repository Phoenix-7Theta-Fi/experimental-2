import { cookies } from 'next/headers';
import { hash, compare } from 'bcryptjs';
import { getDB, withDB } from '../db';

interface User {
  id: number;
  email: string;
  password: string;
  role: 'patient' | 'practitioner';
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function createUser(email: string, password: string, role: 'patient' | 'practitioner'): User {
  return withDB(() => {
    const db = getDB();
    const hashedPassword = db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?) RETURNING id, email, role')
      .get(email, password, role) as User;
    return hashedPassword;
  });
}

export function getUserByEmail(email: string): User | undefined {
  return withDB(() => {
    const db = getDB();
    return db.prepare('SELECT id, email, password, role FROM users WHERE email = ?')
      .get(email) as User | undefined;
  });
}

export async function setUserSession(userId: number) {
  (await cookies()).set('user_id', userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function getUserSession(): Promise<number | null> {
  const userId = (await cookies()).get('user_id')?.value;
  return userId ? parseInt(userId) : null;
}

export async function clearUserSession() {
  (await cookies()).delete('user_id');
}
