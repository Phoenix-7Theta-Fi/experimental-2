import { notFound, redirect } from 'next/navigation';
import Image from 'next/image';
import { getUserByUsername, getUserTweets } from '@/lib/db/users';
import TweetCard from '@/app/feed/tweet-card';
import { getUserSession } from '@/lib/auth';
import db from '@/lib/db';
import { toggleLike } from '@/lib/db/tweets';
import BookAppointmentButton from '@/components/book-appointment-button';
import { Navbar } from '@/components/navbar';

export default async function ProfilePage({
  params
}: {
  params: { username: string }
}) {
  const userId = await getUserSession();
  if (!userId) {
    redirect('/auth/login');
  }

  const currentUser = db.prepare('SELECT id, email, role FROM users WHERE id = ?')
    .get(userId) as { id: number; email: string; role: 'patient' | 'practitioner' } | undefined;
  
  if (!currentUser) {
    redirect('/auth/login');
  }

  const user = getUserByUsername(params.username);
  if (!user) {
    notFound();
  }

  const tweets = getUserTweets(user.id, currentUser.id);

  return (
    <>
      <Navbar userEmail={currentUser.email} userRole={currentUser.role} />
      <main className="min-h-screen max-w-4xl mx-auto p-4 mt-20">
      <div className="bg-[#1E293B] p-6 rounded-lg shadow-lg border border-[#334155] mb-6">
        <div className="flex items-start space-x-4">
          <Image
            src={user.avatar_url}
            alt={user.name}
            width={80}
            height={80}
            className="rounded-full ring-2 ring-[#334155]"
          />
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold text-[#F8FAFC]">{user.name}</h1>
              {user.role === 'practitioner' && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 text-[#F97316]"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
            <p className="text-[#94A3B8]">@{user.username}</p>
            <p className="text-[#94A3B8] mt-2">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </p>
            {user.role === 'practitioner' && currentUser.id !== user.id && (
              <div className="mt-4">
                <BookAppointmentButton practitionerId={user.id} />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={{
              ...tweet,
              username: user.username,
              name: user.name,
              role: user.role,
              avatar_url: user.avatar_url
            }}
            onLike={async (tweetId: number) => {
              'use server';
              toggleLike(tweetId, currentUser.id);
              return true;
            }}
          />
        ))}
        {tweets.length === 0 && (
          <div className="text-center py-8 text-[#94A3B8]">
            No tweets yet
          </div>
        )}
      </div>
      </main>
    </>
  );
}
