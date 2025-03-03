import { logDatabaseStats } from '@/lib/db';
import { RedirectType, redirect } from 'next/navigation';

export default function Home() {
  // For development environment, show database stats on home page
  if (process.env.NODE_ENV === 'development') {
    try {
      logDatabaseStats();
    } catch (error) {
      console.error('Error getting database stats:', error);
    }
  }

  // Redirect to login page
  redirect('/auth/login', RedirectType.replace);
}
