import { getDB } from './index';
import { MedicationData } from '../types/health';

export const getMedicationTracking = (userId: number) => {
  const db = getDB();
  const medications = db.prepare(`
    SELECT m.id, m.user_id, mc.type, mc.name, m.dosage, m.frequency, m.timing, m.with_food,
           GROUP_CONCAT(
             json_object(
               'date', ma.date,
               'taken', ma.taken
             )
           ) as adherence_data
    FROM medications m
    JOIN medication_catalog mc ON m.catalog_id = mc.id
    LEFT JOIN medication_adherence ma ON m.id = ma.medication_id AND m.user_id = ma.user_id
    WHERE m.user_id = ?
    GROUP BY m.id
  `).all(userId) as (Omit<MedicationData, 'adherence'> & { adherence_data: string | null })[];

  if (!medications.length) return null;

  const transformedMeds = medications.map(med => ({
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

  // Structure the data according to MedicationTracking interface
  const medicationTracking = {
    medications: transformedMeds,
    adherence: transformedMeds.reduce((acc, med) => {
      if (med.adherence) {
        acc[med.id] = med.adherence;
      }
      return acc;
    }, {} as Record<number, { date: string; taken: boolean; }[]>)
  };

  return medicationTracking;
};

export const seedMedicationCatalog = () => {
  const db = getDB();
  const catalog = [
    {
      type: 'ayurvedic',
      name: 'Ashwagandha',
      typical_dosage: '500mg',
      description: 'An ancient medicinal herb with multiple health benefits.',
      usage_guidelines: 'Take twice daily for stress relief and immunity boost.'
    },
    {
      type: 'ayurvedic',
      name: 'Triphala',
      typical_dosage: '1000mg',
      description: 'Traditional Ayurvedic formula for digestive health.',
      usage_guidelines: 'Take before bedtime for digestive support.'
    },
    {
      type: 'ayurvedic',
      name: 'Brahmi',
      typical_dosage: '350mg',
      description: 'Supports cognitive function and mental clarity.',
      usage_guidelines: 'Take with warm water for enhanced memory and focus.'
    },
    {
      type: 'ayurvedic',
      name: 'Shatavari',
      typical_dosage: '500mg',
      description: 'Supports hormonal balance and reproductive health.',
      usage_guidelines: 'Take daily for hormonal and reproductive support.'
    },
    {
      type: 'modern',
      name: 'Metformin',
      typical_dosage: '500mg',
      description: 'Medication for blood sugar control.',
      usage_guidelines: 'Take with meals as prescribed for blood sugar management.'
    },
    {
      type: 'modern',
      name: 'Rosuvastatin',
      typical_dosage: '10mg',
      description: 'Statin medication for cholesterol management.',
      usage_guidelines: 'Take in the evening for cholesterol control.'
    },
    {
      type: 'modern',
      name: 'CoQ10',
      typical_dosage: '100mg',
      description: 'Supports heart health and energy production.',
      usage_guidelines: 'Take with fatty foods for better absorption.'
    },
    {
      type: 'modern',
      name: 'Vitamin D3',
      typical_dosage: '2000IU',
      description: 'Essential for bone health and immunity.',
      usage_guidelines: 'Take with fatty meals for optimal absorption.'
    },
    {
      type: 'supplement',
      name: 'Omega-3',
      typical_dosage: '1000mg',
      description: 'Essential fatty acids for heart and brain health.',
      usage_guidelines: 'Take with meals to prevent fishy aftertaste.'
    },
    {
      type: 'supplement',
      name: 'Magnesium',
      typical_dosage: '400mg',
      description: 'Essential mineral for muscle and nerve function.',
      usage_guidelines: 'Take before bedtime for better sleep.'
    },
    {
      type: 'supplement',
      name: 'Zinc',
      typical_dosage: '15mg',
      description: 'Supports immune system and wound healing.',
      usage_guidelines: 'Take with food to prevent stomach upset.'
    },
    {
      type: 'supplement',
      name: 'B-Complex',
      typical_dosage: '100mg',
      description: 'Blend of essential B vitamins for energy.',
      usage_guidelines: 'Take in the morning for energy support.'
    }
  ];

  catalog.forEach(med => {
    try {
      db.prepare(`
        INSERT INTO medication_catalog (
          type, name, typical_dosage, description, usage_guidelines
        ) VALUES (?, ?, ?, ?, ?)
      `).run(
        med.type,
        med.name,
        med.typical_dosage,
        med.description,
        med.usage_guidelines
      );
    } catch (error) {
      // Ignore unique constraint violations (medication already exists)
      if (!String(error).includes('UNIQUE constraint failed')) {
        throw error;
      }
    }
  });

  console.log('Medication catalog seeded successfully');
};

export const seedMedicationData = (specificUsers?: number[]) => {
  const db = getDB();
  const users = specificUsers 
    ? specificUsers.map(id => ({ id }))
    : (db.prepare("SELECT id FROM users WHERE role = 'patient'").all() as { id: number }[]);

  // Ensure catalog exists
  seedMedicationCatalog();

  interface CatalogMed {
    id: number;
    type: 'ayurvedic' | 'modern' | 'supplement';
    name: string;
    typical_dosage: string;
    description: string;
    usage_guidelines: string;
  }

  // Get all medications from catalog
  const catalogMeds = db.prepare('SELECT * FROM medication_catalog').all() as CatalogMed[];
  const today = new Date();
  
  const timings = ['morning', 'afternoon', 'evening', 'night'] as const;
  const frequencies = ['daily', 'twice daily', 'as needed'] as const;
  
  users.forEach(user => {
    const existingMeds = getMedicationTracking(user.id);
    if (!existingMeds) {
      // Randomly select 7-12 medications for each user
      const selectedMeds = [...catalogMeds]
        .sort(() => Math.random() - 0.5)
        .slice(0, 7 + Math.floor(Math.random() * 6));

      // Add medications
      selectedMeds.forEach(med => {
        const result = db.prepare(`
          INSERT INTO medications (
            user_id, catalog_id, dosage, frequency, timing, with_food
          ) VALUES (?, ?, ?, ?, ?, ?)
        `).run(
          user.id,
          med.id,
          med.typical_dosage,
          frequencies[Math.floor(Math.random() * frequencies.length)],
          timings[Math.floor(Math.random() * timings.length)],
          Math.random() > 0.5 ? 1 : 0
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
