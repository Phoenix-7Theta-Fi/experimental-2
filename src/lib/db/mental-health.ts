import { getDB } from './index';
import { MentalHealthData } from '../types/health';

export const getUserMentalHealthData = (userId: number) => {
  const db = getDB();
  const data = db.prepare(`
    SELECT * FROM mental_health 
    WHERE user_id = ? 
    ORDER BY date DESC 
    LIMIT 1
  `).get(userId) as any;

  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    meditation: {
      minutes: data.meditation_minutes,
      streak: data.meditation_streak,
      goal: data.meditation_goal,
      progress: data.meditation_progress
    },
    sleep: {
      hours: data.sleep_hours,
      quality: data.sleep_quality,
      deep: data.deep_sleep,
      light: data.light_sleep,
      rem: data.rem_sleep,
      consistency: data.sleep_consistency
    },
    mood: {
      category: data.mood_category,
      intensity: data.mood_intensity
    },
    wellbeing: {
      stressLevel: data.stress_level,
      recoveryScore: data.recovery_score,
      overallScore: data.wellbeing_score
    }
  } as MentalHealthData;
};

export const seedMentalHealthData = (specificUsers?: number[]) => {
  const db = getDB();
  const users = specificUsers 
    ? specificUsers.map(id => ({ id }))
    : (db.prepare("SELECT id FROM users WHERE role = 'patient'").all() as { id: number }[]);
  const today = new Date().toISOString().split('T')[0];
  const moodCategories = ['happy', 'calm', 'anxious', 'stressed', 'neutral'];

  users.forEach(user => {
    const existingData = getUserMentalHealthData(user.id);
    if (!existingData) {
      db.prepare(`
        INSERT INTO mental_health (
          user_id, date,
          meditation_minutes, meditation_streak, meditation_goal, meditation_progress,
          sleep_hours, sleep_quality, deep_sleep, light_sleep, rem_sleep, sleep_consistency,
          mood_category, mood_intensity, stress_level, recovery_score, wellbeing_score
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id, today,
        15 + Math.floor(Math.random() * 45),   // meditation_minutes
        Math.floor(Math.random() * 30),        // meditation_streak
        30,                                    // meditation_goal
        Math.random() * 100,                   // meditation_progress
        6 + Math.random() * 3,                 // sleep_hours
        60 + Math.floor(Math.random() * 40),   // sleep_quality
        25 + Math.floor(Math.random() * 15),   // deep_sleep (%)
        45 + Math.floor(Math.random() * 15),   // light_sleep (%)
        20 + Math.floor(Math.random() * 10),   // rem_sleep (%)
        70 + Math.floor(Math.random() * 30),   // sleep_consistency
        moodCategories[Math.floor(Math.random() * moodCategories.length)], // mood_category
        1 + Math.floor(Math.random() * 9),     // mood_intensity (1-10)
        1 + Math.floor(Math.random() * 9),     // stress_level (1-10)
        60 + Math.floor(Math.random() * 40),   // recovery_score
        65 + Math.floor(Math.random() * 35)    // wellbeing_score
      );
    }
  });

  console.log('Mental health data seeded successfully');
};
