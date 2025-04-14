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
    recovery_score: data.recovery_score
  } as YogaData;
};

export const getYogaMetricsForDateRange = (userId: number, startDate: string, endDate: string) => {
  const db = getDB();
  return db.prepare(`
    SELECT date, recovery_score
    FROM yoga_metrics 
    WHERE user_id = ? 
      AND date >= ? 
      AND date <= ?
    ORDER BY date ASC
  `).all(userId, startDate, endDate) as { date: string; recovery_score: number; }[];
};

export const seedYoga = () => {
  const db = getDB();
  const users = db.prepare('SELECT id FROM users').all();
  const today = new Date().toISOString().split('T')[0];

  users.forEach(user => {
    const existingData = getUserYogaData(user.id);
    if (!existingData) {
      db.prepare(`
        INSERT INTO yoga_metrics (
          user_id, date, spine_flexibility, hip_flexibility, 
          shoulder_flexibility, balance_score, overall_flexibility,
          recovery_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id, today,
        65 + Math.floor(Math.random() * 25), // spine_flexibility
        70 + Math.floor(Math.random() * 20), // hip_flexibility
        75 + Math.floor(Math.random() * 15), // shoulder_flexibility
        60 + Math.floor(Math.random() * 30), // balance_score
        70 + Math.floor(Math.random() * 20), // overall_flexibility
        65 + Math.floor(Math.random() * 35)  // recovery_score
      );
    }
  });

  console.log('Yoga metrics seeded successfully');
};
