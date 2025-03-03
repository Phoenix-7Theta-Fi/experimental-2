import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import db from '@/lib/db';
import { Navbar } from '@/components/navbar';

export default async function PatientDashboard() {
  const userId = await getUserSession();
  
  if (!userId) {
    redirect('/auth/login');
  }

  const user = db.prepare('SELECT email FROM users WHERE id = ? AND role = ?')
    .get(userId, 'patient') as { email: string } | undefined;

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <>
      <Navbar userEmail={user.email} userRole="patient" />
      <div className="min-h-screen bg-[#0F172A] pt-24 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1E293B] rounded-xl p-8">
            <h1 className="text-3xl font-bold text-[#F8FAFC] mb-4">
              Welcome to Tangerine Health
            </h1>
            <p className="text-[#94A3B8]">
              Hello, {user.email}! You are logged in as a patient.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
