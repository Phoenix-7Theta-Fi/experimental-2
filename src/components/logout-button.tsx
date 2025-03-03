'use client';

import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Logout failed');
      }

      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-[#334155] hover:bg-[#475569] text-[#F8FAFC] rounded-md transition-colors"
    >
      Logout
    </button>
  );
}
