import { getDB } from './index';
import { BiomarkerData } from '../types/health';

export const getUserBiomarkerData = (userId: number) => {
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

export const seedBiomarkerData = () => {
  const db = getDB();
  const users = db.prepare("SELECT id FROM users WHERE role = 'patient'").all() as { id: number }[];
  const today = new Date();

  users.forEach(user => {
    const existingData = getUserBiomarkerData(user.id);
    if (!existingData) {
      // Helper function to generate random values within a range
      const randomValue = (min: number, max: number) => 
        Math.random() < 0.1 ? null : min + Math.random() * (max - min);

      // Generate data for the last 5 dates
      for (let i = 0; i < 5; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i * 30); // Monthly readings
        const recordDate = date.toISOString().split('T')[0];

        db.prepare(`
          INSERT INTO biomarkers (
            user_id, date,
            fasting_glucose, post_prandial_glucose, hba1c,
            total_cholesterol, hdl, ldl, triglycerides,
            tsh, t3, t4,
            vitamin_d, vitamin_b12,
            crp, esr,
            alt, ast, albumin,
            creatinine, urea, uric_acid
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          user.id, recordDate,
          randomValue(70, 110),     // fasting_glucose (mg/dL)
          randomValue(100, 140),    // post_prandial_glucose (mg/dL)
          randomValue(4.5, 6.5),    // hba1c (%)
          randomValue(150, 200),    // total_cholesterol (mg/dL)
          randomValue(40, 60),      // hdl (mg/dL)
          randomValue(90, 130),     // ldl (mg/dL)
          randomValue(50, 150),     // triglycerides (mg/dL)
          randomValue(0.4, 4.0),    // tsh (mIU/L)
          randomValue(80, 200),     // t3 (ng/dL)
          randomValue(5.0, 12.0),   // t4 (µg/dL)
          randomValue(20, 50),      // vitamin_d (ng/mL)
          randomValue(200, 900),    // vitamin_b12 (pg/mL)
          randomValue(0, 5),        // crp (mg/L)
          randomValue(0, 20),       // esr (mm/hr)
          randomValue(7, 56),       // alt (U/L)
          randomValue(10, 40),      // ast (U/L)
          randomValue(3.5, 5.0),    // albumin (g/dL)
          randomValue(0.6, 1.2),    // creatinine (mg/dL)
          randomValue(7, 20),       // urea (mg/dL)
          randomValue(2.4, 6.0)     // uric_acid (mg/dL)
        );
      }
    }
  });

  console.log('Biomarker data seeded successfully');
};
