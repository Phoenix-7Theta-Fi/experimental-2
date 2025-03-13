'use client';

import React, { useState, useCallback } from 'react';
import ReactECharts from 'echarts-for-react';
import { BiomarkerData, BiomarkerCategory } from '@/lib/types/health';
import { getLineChartOptions, getStackedBarOptions, generateCategorySummary, getStatusColor } from '@/lib/utils/chart-helpers';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/solid';
import { BiomarkerInsights } from './BiomarkerInsights';

interface BiomarkersSectionProps {
  data: BiomarkerData[];
  patientId: number;  // Added this prop
}

interface MetricState {
  [category: string]: string | undefined;
}

const LoadingSpinner = () => (
  <div className="absolute inset-0 bg-slate-800/50 z-10 flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
  </div>
);

const NoDataMessage = () => (
  <div className="flex flex-col items-center justify-center p-8 text-slate-400">
    <span className="text-lg">No data available for this time range</span>
    <span className="text-sm mt-2">Try selecting a different time range</span>
  </div>
);

const defaultCategories: BiomarkerCategory[] = ['glucose', 'lipids', 'thyroid'];
const timeRanges = [
  { label: '1W', days: 7 },
  { label: '1M', days: 30 },
  { label: '3M', days: 90 },
  { label: '6M', days: 180 },
  { label: '1Y', days: 365 },
  { label: 'All', days: Infinity }
];

// Previous component implementations (LoadingSpinner, NoDataMessage, TrendIndicator)...

const BiomarkersSection: React.FC<BiomarkersSectionProps> = ({ data, patientId }) => {
  const [selectedCategories, setSelectedCategories] = useState<BiomarkerCategory[]>(defaultCategories);
  const [selectedMetric, setSelectedMetric] = useState<MetricState>({});
  const [timeRange, setTimeRange] = useState(timeRanges[1]); // Default to 1 month
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter data based on selected time range
  const filteredData = React.useMemo(() => {
    if (!data?.length) return [];
    
    if (timeRange.days === Infinity) {
      return data;
    }
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeRange.days);
    
    return data.filter(d => new Date(d.date) >= cutoffDate);
  }, [data, timeRange.days]);

  const sortedData = React.useMemo(() => 
    [...filteredData].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ), [filteredData]);

  const summaries = React.useMemo(() => 
    selectedCategories.map(category => generateCategorySummary(sortedData, category)),
    [selectedCategories, sortedData]
  );

  const handleMetricSelect = useCallback((category: BiomarkerCategory, metric: string) => {
    setIsLoading(true);
    setSelectedMetric(prev => ({
      ...prev,
      [category]: prev[category] === metric ? undefined : metric
    }));
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  if (!data?.length) {
    return (
      <div className="bg-[#334155] rounded-lg p-8 text-center">
        <h3 className="text-xl font-semibold text-slate-200 mb-4">No Biomarker Data Available</h3>
        <p className="text-slate-400">No biomarker data has been recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-2">
        {/* Category Selector */}
        <div className="flex items-center gap-4 overflow-x-auto">
          <h3 className="text-lg font-bold text-slate-100 whitespace-nowrap">Biomarker Analysis</h3>
          <div className="flex gap-2">
            {(['glucose', 'lipids', 'thyroid', 'vitamins', 'inflammation', 'liver', 'kidney'] as BiomarkerCategory[]).map(
              category => (
                <button
                  key={category}
                  onClick={() => {
                    if (selectedCategories.includes(category)) {
                      setSelectedCategories(selectedCategories.filter(c => c !== category));
                    } else {
                      setSelectedCategories([...selectedCategories, category]);
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize transition-colors whitespace-nowrap ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 bg-slate-700/50 p-1 rounded-lg">
          {timeRanges.map(range => (
            <button
              key={range.label}
              onClick={() => {
                setIsLoading(true);
                setTimeRange(range);
                setTimeout(() => setIsLoading(false), 300);
              }}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                timeRange.days === range.days
                  ? 'bg-blue-500 text-white'
                  : 'text-slate-300 hover:bg-slate-600'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Charts Section */}
        <div className="xl:col-span-3">
          {!sortedData.length ? (
            <NoDataMessage />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {summaries.map(summary => (
                <div
                  key={summary.category}
                  className="bg-[#334155] rounded-lg shadow-lg shadow-black/20 border border-[#475569] overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-[#475569]">
                    <h4 className="text-lg font-semibold text-slate-100 capitalize">
                      {summary.category}
                    </h4>
                  </div>

                  {/* Charts Section */}
                  <div className="p-4 space-y-4">
                    {/* Metrics Summary */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {summary.metrics.map(metric => (
                        <button
                          key={metric.name}
                          onClick={() => handleMetricSelect(summary.category, metric.name)}
                          className={`text-left transition-colors ${
                            selectedMetric[summary.category] === metric.name
                              ? 'bg-slate-600'
                              : 'bg-slate-700/50'
                          } p-3 rounded hover:bg-slate-600 relative overflow-hidden group`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 capitalize">{metric.name}</span>
                            <span className="font-mono" style={{ color: getStatusColor(metric.value, metric.target.min, metric.target.max) }}>
                              {metric.value} {metric.unit}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 mt-1">
                            Target: {metric.target.min} - {metric.target.max} {metric.unit}
                          </div>
                          {/* Progress bar background */}
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-600/50" />
                          {/* Progress bar fill */}
                          <div 
                            className="absolute bottom-0 left-0 h-1 bg-current transition-all"
                            style={{
                              width: `${Math.min(100, (metric.value / metric.target.max) * 100)}%`,
                              color: getStatusColor(metric.value, metric.target.min, metric.target.max)
                            }}
                          />
                        </button>
                      ))}
                    </div>

                    {/* Charts with loading states */}
                    <div className="relative">
                      {isLoading && <LoadingSpinner />}
                      {/* Trends Chart */}
                      <div className="h-64">
                        <ReactECharts 
                          option={getLineChartOptions(
                            sortedData,
                            summary.category,
                            selectedMetric[summary.category] || summary.metrics[0]?.name || '',
                            true
                          )}
                          style={{ height: '100%' }}
                          theme="dark"
                        />
                      </div>

                      {/* Stacked Bar Chart */}
                      <div className="h-48">
                        <ReactECharts
                          option={getStackedBarOptions(
                            sortedData,
                            summary.category,
                            summary.metrics.map(m => m.name)
                          )}
                          style={{ height: '100%' }}
                          theme="dark"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insights Section */}
        <div className="xl:col-span-1">
          <BiomarkerInsights patientId={patientId} />
        </div>
      </div>
    </div>
  );
};

export default BiomarkersSection;
