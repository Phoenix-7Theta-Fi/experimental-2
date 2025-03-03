'use client';

import { Tweet } from '@/lib/types';
import TweetCard from './tweet-card';

type TweetListProps = {
  initialTweets: (Tweet & {
    username: string;
    name: string;
    role: string;
    avatar_url: string;
  })[];
};

export default function TweetList({ initialTweets }: TweetListProps) {
  const handleLike = async (tweetId: number) => {
    try {
      const response = await fetch(`/api/tweets/${tweetId}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      const data = await response.json();
      return data.liked;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  return (
    <div className="space-y-4">
      {initialTweets.map((tweet) => (
        <TweetCard
          key={tweet.id}
          tweet={tweet}
          onLike={handleLike}
        />
      ))}
    </div>
  );
}
