'use client';

import Link from 'next/link';
import { LogoutButton } from './logout-button';
import { CartButton } from './shop/cart-button';

interface NavbarProps {
  userEmail: string;
  userRole: 'patient' | 'practitioner';
}

export function Navbar({ userEmail, userRole }: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#1E293B] border-b border-[#334155] px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href={userRole === 'patient' ? '/patient' : '/practitioner'}
            className="text-[#F8FAFC] text-xl font-bold hover:text-[#F97316] transition-colors"
          >
            Tangerine Health
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/feed"
              className="text-[#94A3B8] hover:text-[#F97316] transition-colors"
            >
              Feed
            </Link>
            <Link
              href="/appointments"
              className="text-[#94A3B8] hover:text-[#F97316] transition-colors"
            >
              Appointments
            </Link>
            <Link
              href="/shop"
              className="text-[#94A3B8] hover:text-[#F97316] transition-colors"
            >
              Shop
            </Link>
            {userRole === 'patient' && (
              <Link
                href="/health-analytics"
                className="text-[#94A3B8] hover:text-[#F97316] transition-colors"
              >
                Health Analytics
              </Link>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <CartButton />
          <div className="text-[#94A3B8]">
            <span className="mr-2">{userEmail}</span>
            <span className="text-[#F97316] capitalize">({userRole})</span>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
