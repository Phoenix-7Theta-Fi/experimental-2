import { getDB } from './index';
import { MentalHealthData } from '../types/health';

interface MoodEntry {
  date: string;
  mood: string;
  intensity: number;
  trigger?: string;
  note?: string;
}

export const getUserMoodJourney = (userId: number, limit: number = 30): MoodEntry[] => {
  const db = getDB();
  const entries = db.prepare(`
    SELECT date, mood, intensity, trigger, note
    FROM mood_entries 
    WHERE user_id = ? 
    ORDER BY date DESC
    LIMIT ?
  `).all(userId, limit) as MoodEntry[];

  return entries;
};

export const recordMoodEntry = (
  userId: number,
  entry: Omit<MoodEntry, 'id'>
) => {
  const db = getDB();
  const stmt = db.prepare(`
    INSERT INTO mood_entries (
      user_id, date, mood, intensity, trigger, note
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    userId,
    entry.date,
    entry.mood,
    entry.intensity,
    entry.trigger || null,
    entry.note || null
  );

  return result.lastInsertRowid;
};

export const getUserMentalHealthData = (userId: number) => {
  const db = getDB();
  const data = db.prepare(`
    SELECT * FROM mental_health 
    WHERE user_id = ? 
    ORDER BY date DESC 
    LIMIT 1
  `).get(userId) as any;

  if (!data) return null;

  // Get the recent mood journey
  const moodJourney = getUserMoodJourney(userId, 7); // Last 7 days by default

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
      intensity: data.mood_intensity,
      journey: moodJourney  // Add this new field
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

      // Add mood entries for the last 7 days
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        recordMoodEntry(user.id, {
          date: dateStr,
          mood: moodCategories[Math.floor(Math.random() * moodCategories.length)],
          intensity: 1 + Math.floor(Math.random() * 9),
          trigger: Math.random() > 0.5 ? 'Random daily event' : undefined,
          note: Math.random() > 0.7 ? 'Sample mood note' : undefined
        });
      }
    }
  });

  console.log('Mental health data and mood entries seeded successfully');
};
