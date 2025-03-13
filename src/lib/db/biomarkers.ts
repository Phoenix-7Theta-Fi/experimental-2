import { getDB } from './index';
import { 
  BiomarkerData, 
  BiomarkerCategory, 
  BIOMARKER_RANGES 
} from '../types/health';

export const getUserBiomarkerData = (userId: number): BiomarkerData[] | null => {
  const db = getDB();
  const data = db.prepare(`
    SELECT * FROM biomarkers 
    WHERE user_id = ? 
    ORDER BY date DESC 
    LIMIT 5
  `).all(userId) as any[];

  if (!data.length) return null;

  return data.map(record => ({
    id: record.id,
    user_id: record.user_id,
    date: record.date,
    glucose: {
      fasting: record.fasting_glucose,
      postPrandial: record.post_prandial_glucose,
      hba1c: record.hba1c
    },
    lipids: {
      totalCholesterol: record.total_cholesterol,
      hdl: record.hdl,
      ldl: record.ldl,
      triglycerides: record.triglycerides
    },
    thyroid: {
      tsh: record.tsh,
      t3: record.t3,
      t4: record.t4
    },
    vitamins: {
      d: record.vitamin_d,
      b12: record.vitamin_b12
    },
    inflammation: {
      crp: record.crp,
      esr: record.esr
    },
    liver: {
      alt: record.alt,
      ast: record.ast,
      albumin: record.albumin
    },
    kidney: {
      creatinine: record.creatinine,
      urea: record.urea,
      uricAcid: record.uric_acid
    }
  })) as BiomarkerData[];
};

type BiomarkerMapping = {
  [Category in BiomarkerCategory]: {
    [Metric: string]: {
      dbColumn: string;
      range: { min: number; max: number };
    };
  };
};

// Define the mapping between biomarker categories, metrics, and database columns
const BIOMARKER_MAPPING: BiomarkerMapping = {
  glucose: {
    fasting: { dbColumn: 'fasting_glucose', range: BIOMARKER_RANGES.glucose.fasting },
    postPrandial: { dbColumn: 'post_prandial_glucose', range: BIOMARKER_RANGES.glucose.postPrandial },
    hba1c: { dbColumn: 'hba1c', range: BIOMARKER_RANGES.glucose.hba1c }
  },
  lipids: {
    totalCholesterol: { dbColumn: 'total_cholesterol', range: BIOMARKER_RANGES.lipids.totalCholesterol },
    hdl: { dbColumn: 'hdl', range: BIOMARKER_RANGES.lipids.hdl },
    ldl: { dbColumn: 'ldl', range: BIOMARKER_RANGES.lipids.ldl },
    triglycerides: { dbColumn: 'triglycerides', range: BIOMARKER_RANGES.lipids.triglycerides }
  },
  thyroid: {
    tsh: { dbColumn: 'tsh', range: BIOMARKER_RANGES.thyroid.tsh },
    t3: { dbColumn: 't3', range: BIOMARKER_RANGES.thyroid.t3 },
    t4: { dbColumn: 't4', range: BIOMARKER_RANGES.thyroid.t4 }
  },
  vitamins: {
    d: { dbColumn: 'vitamin_d', range: BIOMARKER_RANGES.vitamins.d },
    b12: { dbColumn: 'vitamin_b12', range: BIOMARKER_RANGES.vitamins.b12 }
  },
  inflammation: {
    crp: { dbColumn: 'crp', range: BIOMARKER_RANGES.inflammation.crp },
    esr: { dbColumn: 'esr', range: BIOMARKER_RANGES.inflammation.esr }
  },
  liver: {
    alt: { dbColumn: 'alt', range: BIOMARKER_RANGES.liver.alt },
    ast: { dbColumn: 'ast', range: BIOMARKER_RANGES.liver.ast },
    albumin: { dbColumn: 'albumin', range: BIOMARKER_RANGES.liver.albumin }
  },
  kidney: {
    creatinine: { dbColumn: 'creatinine', range: BIOMARKER_RANGES.kidney.creatinine },
    urea: { dbColumn: 'urea', range: BIOMARKER_RANGES.kidney.urea },
    uricAcid: { dbColumn: 'uric_acid', range: BIOMARKER_RANGES.kidney.uricAcid }
  }
};

export const seedBiomarkerData = (specificUsers?: number[]) => {
  const db = getDB();
  const users = specificUsers 
    ? specificUsers.map(id => ({ id }))
    : (db.prepare("SELECT id FROM users WHERE role = 'patient'").all() as { id: number }[]);
  const today = new Date();

  users.forEach(user => {
    const existingData = getUserBiomarkerData(user.id);
    if (!existingData) {
      // Generate random value within range with possibility of null (10%)
      const generateValue = (min: number, max: number): number => 
        Number((min + Math.random() * (max - min)).toFixed(2));

      // Generate data for the last 5 dates
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i * 30); // Monthly readings
        const recordDate = date.toISOString().split('T')[0];

        const columns = ['user_id', 'date'];
        const values: (string | number)[] = [user.id, recordDate];
        const placeholders = ['?', '?'];

        // Add all biomarker columns and values
        Object.values(BIOMARKER_MAPPING).forEach(categoryMetrics => {
          Object.values(categoryMetrics).forEach(metric => {
            columns.push(metric.dbColumn);
            // 10% chance of null value
            const value = Math.random() < 0.1 ? null : generateValue(metric.range.min, metric.range.max);
            values.push(value as number);
            placeholders.push('?');
          });
        });

        const query = `
          INSERT INTO biomarkers (${columns.join(', ')})
          VALUES (${placeholders.join(', ')})
        `;

        db.prepare(query).run(...values);
      }
    }
  });

  console.log('Biomarker data seeded successfully');
};
