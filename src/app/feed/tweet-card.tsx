'use client';

import { Tweet } from '@/lib/types';
import Tag from './tag';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type TweetCardProps = {
  tweet: Tweet & {
    username: string;
    name: string;
    role: string;
    avatar_url: string;
  };
  onLike: (tweetId: number) => Promise<boolean>;
};

export default function TweetCard({ tweet, onLike }: TweetCardProps) {
  const [likes, setLikes] = React.useState(tweet.likes_count || 0);
  const [isLiked, setIsLiked] = React.useState(tweet.liked_by_user || false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleLike = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const liked = await onLike(tweet.id);
      setIsLiked(liked);
      setLikes(prev => liked ? prev + 1 : prev - 1);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-[#1E293B] p-6 rounded-lg shadow-lg border border-[#334155]">
      <div className="flex items-start space-x-3">
        <Link href={`/profile/${tweet.username}`} className="flex-shrink-0 group">
          <Image
            src={tweet.avatar_url}
            alt={tweet.name}
            width={40}
            height={40}
            className="rounded-full ring-2 ring-[#334155] group-hover:ring-[#F97316] transition-colors"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <Link 
              href={`/profile/${tweet.username}`} 
              className="font-medium text-[#F8FAFC] hover:text-[#F97316] transition-colors"
            >
              {tweet.name}
            </Link>
            {tweet.role === 'practitioner' && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-[#F97316]"
              >
                <path
                  fillRule="evenodd"
                  d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            <Link 
              href={`/profile/${tweet.username}`}
              className="text-[#94A3B8] hover:text-[#F97316] transition-colors"
            >
              @{tweet.username}
            </Link>
          </div>
          <p className="mt-1 text-[#F8FAFC]">{tweet.content}</p>
          <div className="mt-2 flex items-center justify-between">
            <Tag tag={tweet.tag as 'MentalHealth' | 'Wellness' | 'Nutrition' | 'Fitness'} />
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                disabled={isLoading}
                className="flex items-center space-x-1 text-[#94A3B8] hover:text-[#F97316] transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isLiked ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  className={`w-5 h-5 ${isLiked ? 'text-[#F97316]' : ''}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
                <span>{likes}</span>
              </button>
              <span className="text-sm text-[#94A3B8]">
                {new Date(tweet.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
