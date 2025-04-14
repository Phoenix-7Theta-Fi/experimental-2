import { getDB } from './index';
import { WorkoutData } from '../types/health';

export const getUserWorkoutData = (userId: number) => {
  const db = getDB();
  const data = db.prepare(`
    SELECT * FROM workouts 
    WHERE user_id = ? 
    ORDER BY date DESC 
    LIMIT 1
  `).get(userId) as any;

  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    power_index: data.power_index,
    bench_press: data.bench_press,
    squat: data.squat,
    deadlift: data.deadlift,
    muscle_balance: data.muscle_balance,
    vo2_max: data.vo2_max,
    endurance: data.endurance,
    pace: data.pace
  } as WorkoutData;
};

export const seedWorkouts = () => {
  const db = getDB();
  const users = db.prepare('SELECT id FROM users').all();
  const today = new Date().toISOString().split('T')[0];

  users.forEach(user => {
    const existingData = getUserWorkoutData(user.id);
    if (!existingData) {
      db.prepare(`
        INSERT INTO workouts (
          user_id, date, power_index, bench_press, squat, deadlift,
          muscle_balance, vo2_max, endurance, pace
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id, today,
        75 + Math.floor(Math.random() * 25),   // power_index
        80 + Math.floor(Math.random() * 40),   // bench_press (kg)
        100 + Math.floor(Math.random() * 60),  // squat (kg)
        120 + Math.floor(Math.random() * 80),  // deadlift (kg)
        70 + Math.floor(Math.random() * 30),   // muscle_balance
        35 + Math.floor(Math.random() * 15),   // vo2_max (ml/kg/min)
        85 + Math.floor(Math.random() * 15),   // endurance
        5 + Math.random() * 3                  // pace (min/km)
      );
    }
  });
};
