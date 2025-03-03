import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import db from '@/lib/db';
import { CartItems } from '@/components/shop/cart-items';

export default async function CartPage() {
  const userId = await getUserSession();
  if (!userId) {
    redirect('/auth/login');
  }

  // Get user info from database
  const user = db.prepare('SELECT email, role FROM users WHERE id = ?')
    .get(userId) as { email: string; role: 'patient' | 'practitioner' };

  return (
    <>
      <Navbar userEmail={user.email} userRole={user.role} />
      <main className="min-h-screen pt-20 pb-12 px-4">
        <CartItems />
      </main>
    </>
  );
}
