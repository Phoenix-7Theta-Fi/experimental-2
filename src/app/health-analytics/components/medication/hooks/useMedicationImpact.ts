import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface MedicationImpactData {
  date: string;
  medications: {
    [key: string]: number;
  };
  metrics: {
    sleepScore: number;
    mentalScore: number;
    workoutScore: number;
    recoveryScore: number;
  };
}

interface UseMedicationImpactReturn {
  data: MedicationImpactData[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useMedicationImpact(medicationId?: string): UseMedicationImpactReturn {
  const [data, setData] = useState<MedicationImpactData[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const currentDate = new Date();
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');

      const queryParams = new URLSearchParams({
        startDate,
        endDate,
        ...(medicationId && { medicationId })
      });

      const response = await fetch(`/api/medications/impact?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch medication impact data');
      }

      const { data } = await response.json();

      // Transform API data to match component requirements
      const transformedData = data.impactMetrics.map((day: any) => ({
        date: day.date,
        medications: day.medications.reduce((acc: any, med: any) => {
          acc[med.name] = med.dosage;
          return acc;
        }, {}),
        metrics: {
          sleepScore: day.metrics.sleep_score,
          mentalScore: day.metrics.mental_score,
          workoutScore: day.metrics.workout_score,
          recoveryScore: day.metrics.recovery_score
        }
      }));

      setData(transformedData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [medicationId]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData
  };
}