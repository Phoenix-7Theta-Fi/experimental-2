import { getDB } from './index';
import { Tweet } from './users';

export const getTweets = (currentUserId: number) => {
  const db = getDB();
  return db.prepare(`
    SELECT 
      t.*, u.username, u.name, u.role, u.avatar_url,
      COUNT(DISTINCT l.id) as likes_count,
      EXISTS(SELECT 1 FROM likes WHERE tweet_id = t.id AND user_id = ?) as liked_by_user
    FROM tweets t
    JOIN users u ON t.user_id = u.id
    LEFT JOIN likes l ON t.id = l.tweet_id
    GROUP BY t.id
    ORDER BY t.created_at DESC
  `).all(currentUserId) as (Tweet & { username: string; name: string; role: string; avatar_url: string })[];
};

export const createTweet = (userId: number, content: string, tag: string) => {
  const db = getDB();
  return db.prepare('INSERT INTO tweets (user_id, content, tag) VALUES (?, ?, ?) RETURNING *')
    .get(userId, content, tag) as Tweet;
};

export const toggleLike = (tweetId: number, userId: number) => {
  const db = getDB();
  const existingLike = db.prepare('SELECT id FROM likes WHERE tweet_id = ? AND user_id = ?')
    .get(tweetId, userId) as { id: number } | undefined;

  if (existingLike) {
    db.prepare('DELETE FROM likes WHERE id = ?').run(existingLike.id);
    return false;
  } else {
    db.prepare('INSERT INTO likes (tweet_id, user_id) VALUES (?, ?)').run(tweetId, userId);
    return true;
  }
};

export const seedTweets = () => {
  const db = getDB();
  const tweets = [
    { content: 'Just published a new study on the benefits of meditation for anxiety management. Check it out! #MentalHealth', tag: 'MentalHealth' },
    { content: 'Remember to stay hydrated during your workouts! Aim for at least 8 glasses of water daily. #Wellness', tag: 'Wellness' },
    { content: 'Had a great session focusing on mindful eating habits today. Small changes lead to big results! #Nutrition', tag: 'Nutrition' },
    { content: 'Starting a new workout routine? Begin gradually and listen to your body. #Fitness', tag: 'Fitness' },
    { content: 'Proud to share my recovery journey. Every step counts! #MentalHealth', tag: 'MentalHealth' },
    { content: 'New healthy recipe alert: Quinoa Buddha bowl with roasted veggies! #Nutrition', tag: 'Nutrition' },
    { content: 'Mental health tip: Take 5 minutes each day for deep breathing exercises. #Wellness', tag: 'Wellness' },
    { content: 'Just completed my first 5K! Thanks for all the support. #Fitness', tag: 'Fitness' },
    { content: "Reminder: Self-care isn't selfish, it's necessary. #MentalHealth", tag: 'MentalHealth' },
    { content: "Sharing my meal prep secrets in today's session. Eating healthy can be easy! #Nutrition", tag: 'Nutrition' }
  ] as const;

  const userIds = db.prepare('SELECT id FROM users').all() as { id: number }[];
  const existingTweets = db.prepare('SELECT COUNT(*) as count FROM tweets').get() as { count: number };

  if (existingTweets.count === 0) {
    tweets.forEach((tweet, index) => {
      const userId = userIds[index % userIds.length].id;
      const result = db.prepare('INSERT INTO tweets (user_id, content, tag) VALUES (?, ?, ?)')
        .run(userId, tweet.content, tweet.tag);
      const tweetId = result.lastInsertRowid as number;

      // Add some random likes
      const numberOfLikes = Math.floor(Math.random() * 6) + 3; // 3-8 likes per tweet
      const likeUserIds = userIds.map(u => u.id).sort(() => 0.5 - Math.random()).slice(0, numberOfLikes);
      likeUserIds.forEach(likeUserId => {
        db.prepare('INSERT OR IGNORE INTO likes (tweet_id, user_id) VALUES (?, ?)')
          .run(tweetId, likeUserId);
      });
    });
  }

  console.log('Tweets and likes seeded successfully');
};
