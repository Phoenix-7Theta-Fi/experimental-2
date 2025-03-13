import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import db from '@/lib/db';
import ChatContainer from './components/ChatContainer';

export default async function ChatPage() {
  const userId = await getUserSession();
  
  if (!userId) {
    redirect('/auth/login');
  }

  const user = db.prepare('SELECT email, role FROM users WHERE id = ?')
    .get(userId) as { email: string; role: 'patient' | 'practitioner' } | undefined;

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <>
      <Navbar userEmail={user.email} userRole={user.role} />
      <div className="min-h-screen bg-[#0F172A] pt-24 px-4">
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-3xl font-bold text-[#F8FAFC] mb-2">
            Medical Assistant Chat
          </h1>
          <p className="text-[#94A3B8]">
            Ask our AI assistant any health-related questions you may have.
          </p>
        </div>
        <ChatContainer />
      </div>
    </>
  );
}
