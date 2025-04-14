'use client';

import React, { useState } from 'react';
// Added ChartBarIcon to the existing solid import
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, ChartBarIcon } from '@heroicons/react/24/solid'; 
import { XMarkIcon } from '@heroicons/react/24/outline';
import CircularGauge from '../CircularGauge';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BiomarkerCardProps {
  category: string;
  name: string;
  value: number;
  unit: string;
  target: {
    min: number;    // Medical reference range minimum
    max: number;    // Medical reference range maximum
    goal: number;   // Patient's target value
  };
  trend?: {
    direction: 'up' | 'down' | 'stable';
    percentage: number;
  };
  // Add historical data prop
  historicalData?: {
    date: string;
    value: number;
  }[];
}

const BiomarkerCard: React.FC<BiomarkerCardProps> = ({
  category,
  name,
  value,
  unit,
  target,
  trend,
  historicalData = [] // Default to empty array
}) => {
  const [showTrendPopover, setShowTrendPopover] = useState(false);

  // Calculate progress towards goal
  const calculateProgress = () => {
    const range = target.max - target.min;
    const currentProgress = ((value - target.min) / range) * 100;
    const goalProgress = ((target.goal - target.min) / range) * 100;
    return {
      current: Math.min(100, Math.max(0, currentProgress)),
      goal: Math.min(100, Math.max(0, goalProgress))
    };
  };

  const progress = calculateProgress();
  
  // Determine status color (using Tailwind color values)
  const getStatusColor = (value: number, min: number, max: number) => {
    // Using hex values corresponding to Tailwind's 500 range for consistency
    if (value < min || value > max) return '#ef4444'; // red-500
    const middle = (max + min) / 2;
    const maxDistance = (max - min) / 2;
    const distance = Math.abs(value - middle);
    const percentage = distance / maxDistance;
    // Using green-500 and amber-500
    return percentage < 0.25 ? '#22c55e' : '#f59e0b'; 
  };

  const statusColor = getStatusColor(value, target.min, target.max);

  // Calculate distance to goal
  const distanceToGoal = Math.abs(value - target.goal);
  const percentageToGoal = Math.round((value / target.goal) * 100);

  // Prepare chart data
  const chartData = {
    labels: historicalData.map(d => new Date(d.date).toLocaleDateString()),
    datasets: [
      {
        label: name,
        data: historicalData.map(d => d.value),
        borderColor: statusColor, // Use dynamic status color
        backgroundColor: statusColor + '33', // Slightly more visible background fill
        tension: 0.4,
        fill: true,
        pointBackgroundColor: statusColor, // Make points match line color
        pointBorderColor: '#fff', // White border for points
        pointHoverRadius: 6,
        pointHoverBackgroundColor: statusColor,
      },
      {
        label: 'Upper Range', // More specific label
        data: historicalData.map(() => target.max),
        borderColor: 'rgb(100 116 139)', // slate-500
        borderDash: [5, 5], // Use borderDash instead of borderDashed
        pointRadius: 0,
        fill: false,
      },
      {
        label: 'Lower Range', // More specific label
        data: historicalData.map(() => target.min),
        borderColor: 'rgb(100 116 139)', // slate-500
        borderDash: [5, 5], // Use borderDash instead of borderDashed
        pointRadius: 0,
        fill: false, // Fill between min/max might be too noisy, keep as lines
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Show legend for clarity
        position: 'top' as const,
        labels: {
          color: 'rgb(148 163 184)', // slate-400
          boxWidth: 12,
          padding: 15,
        }
      },
      tooltip: {
        backgroundColor: 'rgb(30 41 59)', // slate-800
        borderColor: 'rgb(71 85 105)', // slate-600
        borderWidth: 1,
        titleColor: 'rgb(248 250 252)', // slate-100
        bodyColor: 'rgb(248 250 252)', // slate-100
        padding: 10,
        cornerRadius: 4,
        boxPadding: 4,
      }
    },
    scales: {
      y: {
        beginAtZero: false, // Don't always start at zero
        grid: {
          color: 'rgb(71 85 105 / 0.5)', // slate-600 with opacity
          drawBorder: false,
        },
        ticks: {
          color: 'rgb(148 163 184)', // slate-400
          padding: 10,
        }
      },
      x: {
        grid: {
          display: false, // Keep X grid lines hidden
        },
        ticks: {
          color: 'rgb(148 163 184)', // slate-400
          maxRotation: 0, // Prevent rotation if possible
          minRotation: 0,
          padding: 10,
        }
      }
    },
    maintainAspectRatio: false,
  };

  // Custom value display for the circular gauge
  const CustomGaugeValue = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      {/* Use Tailwind classes for text colors */}
      <span className="text-slate-400 text-xs mb-0.5">{name}</span>
      <span className="text-xl font-bold" style={{ color: statusColor }}>
        {value}
      </span>
      <span className="text-slate-400 text-xs">{unit}</span>
    </div>
  );

  return (
    <div className="relative group"> {/* Added group for potential group-hover */}
      {/* Main Card */}
      <div
        className="bg-slate-800 rounded-xl shadow-lg shadow-black/30 border border-slate-700 p-5 cursor-pointer transition-all duration-200 hover:bg-slate-700/80 hover:shadow-xl" // Adjusted padding, bg, border, shadow, added hover
        onClick={() => setShowTrendPopover(true)}
        role="button" // Added role for accessibility
        aria-haspopup="dialog" // Indicate it opens a dialog
        aria-expanded={showTrendPopover}
        aria-label={`View details for ${name}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-3"> {/* Adjusted margin */}
          <span className="text-xs font-medium text-blue-400 bg-blue-900/50 px-2.5 py-1 rounded-full"> {/* Adjusted styling */}
            {category}
          </span>
          {trend && (
            <div className={`flex items-center gap-1 text-xs ${ // Adjusted size and gap
              trend.direction === 'up' ? 'text-red-400' :
              trend.direction === 'down' ? 'text-green-400' : 'text-slate-400'
            }`}>
              {trend.direction === 'up' ? <ArrowUpIcon className="w-3.5 h-3.5" /> : // Adjusted size
               trend.direction === 'down' ? <ArrowDownIcon className="w-3.5 h-3.5" /> : // Adjusted size
               <MinusIcon className="w-3.5 h-3.5" />} {/* Adjusted size */}
              <span className="font-medium">{trend.percentage}%</span> {/* Adjusted font weight */}
            </div>
          )}
        </div>

        {/* Circular Gauge */}
        <div className="flex justify-center my-5"> {/* Adjusted margin */}
          <CircularGauge
            value={progress.current}
            minValue={0} // Keep min/max for gauge scale
            maxValue={100} // Keep min/max for gauge scale
            color={statusColor}
            label="" // Label handled by CustomGaugeValue
            unit="" // Unit handled by CustomGaugeValue
            size={130} // Slightly smaller gauge
            thickness={10} // Slightly thicker gauge line
            showValue={false} // Use custom value display
            customValue={<CustomGaugeValue />}
          />
        </div>

        {/* Target and Range Info */}
        <div className="grid grid-cols-2 gap-3 mb-4"> {/* Reduced gap */}
          {/* Target Box */}
          <div className="text-center p-3 bg-slate-700/60 rounded-lg border border-slate-600/50"> {/* Adjusted bg, padding, added border */}
            <span className="text-xs text-slate-400 block mb-0.5">Target</span> {/* Adjusted size, margin */}
            <div className="text-base font-semibold text-blue-400"> {/* Adjusted size */}
              {target.goal} <span className="text-xs text-slate-400">{unit}</span>
            </div>
          </div>
          {/* Range Box */}
          <div className="text-center p-3 bg-slate-700/60 rounded-lg border border-slate-600/50"> {/* Adjusted bg, padding, added border */}
            <span className="text-xs text-slate-400 block mb-0.5">Ref. Range</span> {/* Adjusted size, margin, text */}
            <div className="text-sm text-slate-300"> {/* Adjusted size */}
              {target.min} - {target.max} {/* Added space */}
            </div>
          </div>
        </div>

        {/* Goal Progress Summary (Optional - might be redundant with gauge) */}
        {/* Consider removing this section if the gauge provides enough info */}
        <div className="p-3 bg-slate-700/60 rounded-lg border border-slate-600/50 text-xs"> {/* Adjusted styling */}
          <div className="flex justify-between items-center mb-1">
            <span className="text-slate-300">Distance to Target</span>
            <span className="font-medium" style={{ color: statusColor }}>
              {distanceToGoal.toFixed(1)} {unit} {value > target.goal ? 'Above' : 'Below'}
            </span>
          </div>
           <div className="w-full bg-slate-600 rounded-full h-1.5 dark:bg-slate-700">
             <div className="h-1.5 rounded-full" style={{ width: `${percentageToGoal}%`, backgroundColor: statusColor }}></div>
           </div>
        </div>

        {/* Click hint */}
         <div className="text-center text-xs text-slate-500 mt-3 opacity-70 group-hover:opacity-100 transition-opacity duration-200">
           Click to view trend
           <ChartBarIcon className="w-3 h-3 inline-block ml-1" />
         </div>
      </div>

      {/* Trend Popover Modal */}
      {showTrendPopover && (
        // Use a more semantic backdrop
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
          onClick={() => setShowTrendPopover(false)}
          role="dialog" // Added role
          aria-modal="true" // Indicate it's a modal
          aria-labelledby="popover-title" // Link title for accessibility
        >
          {/* Modal Content */}
          <div
            className="bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl border border-slate-700 overflow-hidden" // Adjusted styling
            onClick={e => e.stopPropagation()} // Prevent closing when clicking inside
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-700">
              <h3 id="popover-title" className="text-lg font-semibold text-slate-100"> {/* Use Tailwind text color */}
                {name} Trend
              </h3>
              <button
                onClick={() => setShowTrendPopover(false)}
                className="text-slate-400 hover:text-slate-100 transition-colors rounded-full p-1 hover:bg-slate-700" // Improved button styling
                aria-label="Close trend details" // Accessibility label
              >
                <XMarkIcon className="w-5 h-5" /> {/* Adjusted size */}
              </button>
            </div>

            {/* Chart Area */}
            <div className="p-4 md:p-6 h-[350px]"> {/* Added padding, increased height */}
              <Line data={chartData} options={chartOptions} />
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-3 gap-3 text-center p-4 bg-slate-900/50 border-t border-slate-700"> {/* Adjusted styling */}
              <div className="p-2 bg-slate-700/50 rounded-lg">
                <div className="text-xs text-slate-400">Average</div> {/* Use Tailwind text color */}
                <div className="text-slate-100 font-semibold text-sm"> {/* Use Tailwind text color */}
                  {(historicalData.reduce((acc, curr) => acc + curr.value, 0) / historicalData.length).toFixed(1)} {unit}
                </div>
              </div>
              <div className="p-2 bg-slate-700/50 rounded-lg">
                <div className="text-xs text-slate-400">Lowest</div> {/* Use Tailwind text color */}
                <div className="text-slate-100 font-semibold text-sm"> {/* Use Tailwind text color */}
                  {Math.min(...historicalData.map(d => d.value))} {unit}
                </div>
              </div>
              <div className="p-2 bg-slate-700/50 rounded-lg">
                <div className="text-xs text-slate-400">Highest</div> {/* Use Tailwind text color */}
                <div className="text-slate-100 font-semibold text-sm"> {/* Use Tailwind text color */}
                  {Math.max(...historicalData.map(d => d.value))} {unit}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiomarkerCard;
