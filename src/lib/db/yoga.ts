import { getDB } from './index';
import { YogaData } from '../types/health';

export const getUserYogaData = (userId: number) => {
  const db = getDB();
  const data = db.prepare(`
    SELECT * FROM yoga_metrics 
    WHERE user_id = ? 
    ORDER BY date DESC 
    LIMIT 1
  `).get(userId) as any;

  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    flexibility: {
      spine: data.spine_flexibility,
      hips: data.hip_flexibility,
      shoulders: data.shoulder_flexibility,
      balance: data.balance_score,
      overall: data.overall_flexibility,
    },
    practice: {
      weeklyCompletion: data.weekly_completion,
      streak: data.streak,
      duration: data.duration,
    },
    poses: {
      beginner: { completed: data.beginner_completed, total: data.beginner_total },
      intermediate: { completed: data.intermediate_completed, total: data.intermediate_total },
      advanced: { completed: data.advanced_completed, total: data.advanced_total },
    },
  } as YogaData;
};

export const seedYoga = (specificUsers?: number[]) => {
  const db = getDB();
  const users = specificUsers 
    ? specificUsers.map(id => ({ id }))
    : (db.prepare("SELECT id FROM users WHERE role = 'patient'").all() as { id: number }[]);
  const today = new Date().toISOString().split('T')[0];

  users.forEach(user => {
    const existingData = getUserYogaData(user.id);
    if (!existingData) {
      db.prepare(`
        INSERT INTO yoga_metrics (
          user_id, date, spine_flexibility, hip_flexibility, shoulder_flexibility,
          balance_score, overall_flexibility, weekly_completion, streak,
          duration, beginner_completed, beginner_total,
          intermediate_completed, intermediate_total, advanced_completed,
          advanced_total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id, today,
        65 + Math.floor(Math.random() * 25), // spine_flexibility
        70 + Math.floor(Math.random() * 20), // hip_flexibility
        75 + Math.floor(Math.random() * 15), // shoulder_flexibility
        60 + Math.floor(Math.random() * 30), // balance_score
        70 + Math.floor(Math.random() * 20), // overall_flexibility
        60 + Math.floor(Math.random() * 40), // weekly_completion
        Math.floor(Math.random() * 14), // streak
        30 + Math.floor(Math.random() * 30), // duration
        8 + Math.floor(Math.random() * 4), 12, // beginner_completed, total
        4 + Math.floor(Math.random() * 4), 8,  // intermediate_completed, total
        Math.floor(Math.random() * 3), 5       // advanced_completed, total
      );
    }
  });

  console.log('Yoga metrics seeded successfully');
};
