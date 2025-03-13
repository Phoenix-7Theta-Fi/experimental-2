import { cva } from 'class-variance-authority';
import type { HealthInsight } from '@/lib/types/insights';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, MinusIcon } from '@heroicons/react/24/solid';
import { twMerge } from 'tailwind-merge';

const insightStatusStyles = cva(
  "px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5", 
  {
    variants: {
      status: {
        improving: "bg-emerald-500/10 text-emerald-500",
        declining: "bg-red-500/10 text-red-500",
        stable: "bg-blue-500/10 text-blue-500"
      },
      priority: {
        high: "ring-1 ring-red-500/20",
        medium: "ring-1 ring-yellow-500/20",
        low: "ring-1 ring-emerald-500/20"
      }
    }
  }
);

interface InsightCardProps {
  insight: HealthInsight;
  className?: string;
}

export function InsightCard({ insight, className }: InsightCardProps) {
  const { insight_data: data } = insight;
  
  const StatusIcon = {
    improving: ArrowTrendingUpIcon,
    declining: ArrowTrendingDownIcon,
    stable: MinusIcon
  }[data.status];

  return (
    <div className={`bg-[#1E293B] rounded-lg p-6 ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#F8FAFC]">
          {data.title}
        </h3>
        <span className={insightStatusStyles({ 
          status: data.status,
          priority: data.priority
        })}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span className="capitalize">{data.status}</span>
        </span>
      </div>

      {data.metrics.length > 0 && (
        <div className="grid grid-cols-3 gap-6 mb-6">
          {data.metrics.map((metric, i) => (
            <div key={i} className="bg-[#0F172A] rounded-lg p-3">
              <div className="text-sm font-medium text-[#94A3B8]">
                {metric.name}
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-xl font-semibold text-[#F8FAFC]">
                  {metric.current}
                </span>
                <span className="text-sm text-[#94A3B8]">
                  {metric.unit}
                </span>
              </div>
              {metric.previous !== null && (
                <div className="mt-2 text-sm">
                  <span className={
                    parseFloat(metric.change) > 0
                      ? "text-emerald-500"
                      : parseFloat(metric.change) < 0
                      ? "text-red-500"
                      : "text-blue-500"
                  }>
                    {metric.change}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="text-[#F8FAFC] text-base leading-relaxed mb-6">
        {data.analysis}
      </div>

      {data.recommendations.length > 0 && (
        <div className="border-t border-[#334155] pt-4">
          <h4 className="text-sm font-medium text-[#F8FAFC] mb-3">
            Recommendations
          </h4>
          <ul className="text-base text-[#94A3B8] space-y-3">
            {data.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start">
                <span className="text-[#F97316] mr-2">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
