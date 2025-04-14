import { getDB } from './index';
import { MedicationCorrelationData, MedicationImpactMetrics } from '../types/health';

export const calculateMedicationImpactMetrics = async (
  userId: number,
  startDate: string,
  endDate: string
): Promise<MedicationCorrelationData[]> => {
  const db = getDB();

  // Get all relevant metrics for the date range
  const metrics = db.prepare(`
    SELECT 
      m.date,
      CASE WHEN ma.taken IS NOT NULL THEN ma.taken ELSE 0 END as medication_taken,
      mh.sleep_quality as sleep_score,
      mh.wellbeing_score as mental_score,
      w.power_index as workout_score,
      y.recovery_score
    FROM medications m
    LEFT JOIN medication_adherence ma ON m.id = ma.medication_id 
      AND m.user_id = ma.user_id 
      AND ma.date BETWEEN ? AND ?
    LEFT JOIN mental_health mh ON m.user_id = mh.user_id 
      AND mh.date BETWEEN ? AND ?
    LEFT JOIN workouts w ON m.user_id = w.user_id 
      AND w.date BETWEEN ? AND ?
    LEFT JOIN yoga_metrics y ON m.user_id = y.user_id 
      AND y.date BETWEEN ? AND ?
    WHERE m.user_id = ?
    AND m.date BETWEEN ? AND ?
    ORDER BY m.date ASC
  `).all(
    startDate, endDate,
    startDate, endDate,
    startDate, endDate,
    startDate, endDate,
    userId,
    startDate, endDate
  ) as any[];

  return metrics.map(metric => ({
    date: metric.date,
    medicationAdherence: Boolean(metric.medication_taken),
    metrics: {
      sleepScore: metric.sleep_score || 0,
      mentalScore: metric.mental_score || 0,
      workoutScore: metric.workout_score || 0,
      recoveryScore: metric.recovery_score || 0
    }
  }));
};