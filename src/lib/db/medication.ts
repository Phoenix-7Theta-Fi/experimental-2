import { getDB } from './index';
import { MedicationData } from '../types/health';

export const getMedicationTracking = (userId: number) => {
  const db = getDB();
  const medications = db.prepare(`
    SELECT m.*, 
           GROUP_CONCAT(
             json_object(
               'date', ma.date,
               'taken', ma.taken
             )
           ) as adherence_data
    FROM medications m
    LEFT JOIN medication_adherence ma ON m.id = ma.medication_id AND m.user_id = ma.user_id
    WHERE m.user_id = ?
    GROUP BY m.id
  `).all(userId) as (Omit<MedicationData, 'adherence'> & { adherence_data: string | null })[];

  if (!medications.length) return null;

  return medications.map(med => ({
    id: med.id,
    user_id: med.user_id,
    type: med.type,
    name: med.name,
    dosage: med.dosage,
    frequency: med.frequency,
    timing: med.timing,
    with_food: Boolean(med.with_food),
    adherence: med.adherence_data
      ? JSON.parse(`[${med.adherence_data}]`).map((a: any) => ({
          date: a.date,
          taken: Boolean(a.taken)
        }))
      : undefined
  })) as MedicationData[];
};

export const seedMedicationData = () => {
  const db = getDB();
  const users = db.prepare("SELECT id FROM users WHERE role = 'patient'").all() as { id: number }[];
  const medications = [
    {
      type: 'ayurvedic',
      name: 'Ashwagandha',
      dosage: '500mg',
      frequency: 'twice daily',
      timing: 'morning',
      with_food: true
    },
    {
      type: 'modern',
      name: 'Vitamin D3',
      dosage: '2000 IU',
      frequency: 'daily',
      timing: 'morning',
      with_food: true
    },
    {
      type: 'supplement',
      name: 'Omega-3',
      dosage: '1000mg',
      frequency: 'daily',
      timing: 'evening',
      with_food: true
    },
    {
      type: 'ayurvedic',
      name: 'Triphala',
      dosage: '500mg',
      frequency: 'daily',
      timing: 'night',
      with_food: false
    }
  ] as const;

  const today = new Date();
  
  users.forEach(user => {
    const existingMeds = getMedicationTracking(user.id);
    if (!existingMeds) {
      // Add medications
      medications.forEach(med => {
        const result = db.prepare(`
          INSERT INTO medications (
            user_id, type, name, dosage, frequency, timing, with_food
          ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(
          user.id,
          med.type,
          med.name,
          med.dosage,
          med.frequency,
          med.timing,
          med.with_food ? 1 : 0
        );

        // Add adherence data for the last 7 days
        const medicationId = result.lastInsertRowid as number;
        for (let i = 0; i < 7; i++) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          db.prepare(`
            INSERT INTO medication_adherence (
              user_id, medication_id, date, taken
            ) VALUES (?, ?, ?, ?)
          `).run(
            user.id,
            medicationId,
            date.toISOString().split('T')[0],
            Math.random() > 0.2 ? 1 : 0 // 80% adherence rate
          );
        }
      });
    }
  });

  console.log('Medication data and adherence records seeded successfully');
};
