import { getDB } from './index';
import type { HealthInsight, InsightCreateData, HealthSection } from '../types/insights';

export const createInsight = (data: InsightCreateData): HealthInsight => {
  const db = getDB();
  const stmt = db.prepare(`
    INSERT INTO health_insights (
      patient_id,
      section,
      insight_data,
      created_at
    ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const result = stmt.run(
    data.patient_id,
    data.section,
    JSON.stringify(data.insight_data)
  );

  return {
    id: Number(result.lastInsertRowid),
    ...data,
    created_at: new Date().toISOString()
  };
};

export const createBulkInsights = (insights: InsightCreateData[]): number => {
  const db = getDB();
  const stmt = db.prepare(`
    INSERT INTO health_insights (
      patient_id,
      section,
      insight_data,
      created_at
    ) VALUES (?, ?, ?, CURRENT_TIMESTAMP)
  `);

  const insertMany = db.transaction((items: InsightCreateData[]) => {
    let count = 0;
    for (const item of items) {
      stmt.run(
        item.patient_id,
        item.section,
        JSON.stringify(item.insight_data)
      );
      count++;
    }
    return count;
  });

  return insertMany(insights);
};

export const getPatientInsights = (
  patient_id: number,
  section?: HealthSection
): HealthInsight[] => {
  const db = getDB();
  
  const query = section
    ? `
      SELECT * FROM health_insights 
      WHERE patient_id = ? AND section = ?
      ORDER BY created_at DESC
      LIMIT 10
    `
    : `
      SELECT * FROM health_insights 
      WHERE patient_id = ?
      ORDER BY created_at DESC
      LIMIT 50
    `;

  const stmt = db.prepare(query);
  const results = section
    ? stmt.all(patient_id, section)
    : stmt.all(patient_id);

  return (results as any[]).map(row => ({
    ...row,
    insight_data: JSON.parse(row.insight_data)
  }));
};

export const getLatestInsights = (
  patient_id: number,
  section: HealthSection
): HealthInsight[] => {
  const db = getDB();
  const stmt = db.prepare(`
    SELECT * FROM health_insights 
    WHERE patient_id = ? AND section = ?
    ORDER BY created_at DESC
    LIMIT 1
  `);

  const result = stmt.get(patient_id, section) as any;
  
  if (!result) return [];

  return [{
    ...result,
    insight_data: JSON.parse(result.insight_data)
  }];
};

export const deleteOldInsights = (maxAgeHours: number = 24): number => {
  const db = getDB();
  const stmt = db.prepare(`
    DELETE FROM health_insights 
    WHERE created_at < datetime('now', '-' || ? || ' hours')
  `);

  const result = stmt.run(maxAgeHours);
  return result.changes;
};

export const deletePatientInsights = (patient_id: number): number => {
  const db = getDB();
  const stmt = db.prepare('DELETE FROM health_insights WHERE patient_id = ?');
  const result = stmt.run(patient_id);
  return result.changes;
};

export const clearAllInsights = (): void => {
  const db = getDB();
  const result = db.prepare('DELETE FROM health_insights').run();
  console.log(`Cleared ${result.changes} existing insights`);
};
