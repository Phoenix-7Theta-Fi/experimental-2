'use client';

import { useEffect, useState } from 'react';
import { InsightCard } from './InsightCard';
import type { HealthInsight, HealthSection } from '@/lib/types/insights';

interface InsightsListProps {
  patientId: number;
  section: HealthSection;
  className?: string;
}

export function InsightsList({ patientId, section, className }: InsightsListProps) {
  const [insights, setInsights] = useState<HealthInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInsights() {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(
          `/api/health-analytics/insights?patientId=${patientId}&section=${section}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch insights');
        }
        
        const data = await response.json();
        setInsights(data);
        
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Failed to load insights');
      } finally {
        setLoading(false);
      }
    }

    fetchInsights();
  }, [patientId, section]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 rounded-lg h-48 w-full"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!insights.length) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No insights available for this section.</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="space-y-6">
        {insights.map((insight) => (
          <InsightCard 
            key={insight.id} 
            insight={insight}
          />
        ))}
      </div>
    </div>
  );
}
