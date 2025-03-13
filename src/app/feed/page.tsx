import db from '@/lib/db';
import { getTweets } from '@/lib/db/tweets';
import { cookies } from 'next/headers';
import TweetList from './tweet-list';
import { Navbar } from '@/components/navbar';

export default async function FeedPage() {
  const cookieStore = await cookies();
  const userId = Number(cookieStore.get('user_id')?.value);
  if (!userId) {
    return <div>Please log in to view the feed</div>;
  }

  try {
    // Get user info from database
    const user = db.prepare('SELECT email, role FROM users WHERE id = ?')
      .get(userId) as { email: string; role: 'patient' | 'practitioner' };

    let tweets = getTweets(userId);

    return (
      <>
        <Navbar userEmail={user.email} userRole={user.role} />
        <div className="p-4 mt-16">
        <TweetList initialTweets={tweets} />
        </div>
      </>
    );
  } catch (error) {
    // If database is not initialized, display a friendly message
    if (error instanceof Error && error.message.includes('Database not initialized')) {
      return <div>The database is being initialized. Please refresh in a moment.</div>;
    }
    throw error;
  }
}
