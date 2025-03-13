import { getDB } from './index';
import { NutritionData } from '../types/health';

export const getUserNutritionData = (userId: number) => {
  const db = getDB();
  const data = db.prepare(`
    SELECT * FROM nutrition 
    WHERE user_id = ? 
    ORDER BY date DESC 
    LIMIT 1
  `).get(userId) as any;

  if (!data) return null;

  return {
    id: data.id,
    user_id: data.user_id,
    date: data.date,
    protein: data.protein,
    carbs: data.carbs,
    fats: data.fats,
    fiber: data.fiber,
    vitamin_a: data.vitamin_a,
    vitamin_b12: data.vitamin_b12,
    vitamin_c: data.vitamin_c,
    vitamin_d: data.vitamin_d,
    iron: data.iron,
    calcium: data.calcium,
    zinc: data.zinc
  } as NutritionData;
};

export const seedNutrition = (specificUsers?: number[]) => {
  const db = getDB();
  const users = specificUsers 
    ? specificUsers.map(id => ({ id }))
    : (db.prepare("SELECT id FROM users WHERE role = 'patient'").all() as { id: number }[]);
  const today = new Date().toISOString().split('T')[0];

  users.forEach(user => {
    const existingData = getUserNutritionData(user.id);
    if (!existingData) {
      db.prepare(`
        INSERT INTO nutrition (
          user_id, date, protein, carbs, fats, fiber,
          vitamin_a, vitamin_b12, vitamin_c, vitamin_d,
          iron, calcium, zinc
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        user.id, today,
        70 + Math.floor(Math.random() * 30),  // protein (g)
        200 + Math.floor(Math.random() * 100), // carbs (g)
        50 + Math.floor(Math.random() * 30),   // fats (g)
        25 + Math.floor(Math.random() * 15),   // fiber (g)
        800 + Math.floor(Math.random() * 200), // vitamin_a (mcg)
        2 + Math.random() * 2,                 // vitamin_b12 (mcg)
        75 + Math.floor(Math.random() * 45),   // vitamin_c (mg)
        15 + Math.floor(Math.random() * 10),   // vitamin_d (mcg)
        10 + Math.floor(Math.random() * 8),    // iron (mg)
        800 + Math.floor(Math.random() * 400), // calcium (mg)
        8 + Math.floor(Math.random() * 7)      // zinc (mg)
      );
    }
  });

  console.log('Nutrition data seeded successfully');
};
