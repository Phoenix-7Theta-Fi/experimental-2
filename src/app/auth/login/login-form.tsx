'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'practitioner'>('patient');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Authentication failed');
      }

      router.push(role === 'patient' ? '/patient' : '/practitioner');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-[#94A3B8]">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md bg-[#334155] border-transparent focus:border-[#F97316] focus:ring-[#F97316] text-white"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-[#94A3B8]">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md bg-[#334155] border-transparent focus:border-[#F97316] focus:ring-[#F97316] text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#94A3B8]">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as 'patient' | 'practitioner')}
          className="mt-1 block w-full rounded-md bg-[#334155] border-transparent focus:border-[#F97316] focus:ring-[#F97316] text-white"
        >
          <option value="patient">Patient</option>
          <option value="practitioner">Practitioner</option>
        </select>
      </div>

      {error && (
        <div className="text-red-500 text-sm text-center">{error}</div>
      )}

      <button
        type="submit"
        className="w-full py-2 px-4 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-md transition-colors"
      >
        Login
      </button>

      <p className="text-center text-[#94A3B8] text-sm">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-[#F97316] hover:underline">
          Sign Up
        </Link>
      </p>
    </form>
  );
}
