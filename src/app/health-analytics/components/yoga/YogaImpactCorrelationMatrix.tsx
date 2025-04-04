'use client';

import ReactECharts from 'echarts-for-react';
import { EChartsOption } from 'echarts'; // Import the type
import type { TooltipComponentFormatterCallbackParams } from 'echarts'; // Import tooltip param type
import { format, subWeeks, startOfWeek } from 'date-fns';

const WEEKS_TO_SHOW = 26; // Approx 6 months

// Generate dates for the last N weeks
const generateWeeklyDates = (weeks: number) => {
  const dates = [];
  const today = new Date();
  for (let i = weeks - 1; i >= 0; i--) {
    const targetDate = subWeeks(today, i);
    const weekStart = startOfWeek(targetDate, { weekStartsOn: 1 }); // Monday
    // Format as "Week of MMM dd"
    dates.push(`W/o ${format(weekStart, 'MMM dd')}`);
  }
  return dates;
};

// Generate mock data for N weeks
const generateMockData = (weeks: number) => {
  const data = {
    dates: generateWeeklyDates(weeks),
    yogaPractice: { hatha: [] as number[], vinyasa: [] as number[], yin: [] as number[] },
    impactMetrics: {
      physicalTherapy: [] as number[],
      rangeOfMotion: [] as number[],
      sleepQuality: [] as number[],
      stressLevels: [] as number[],
      inflammation: [] as number[],
    },
    milestones: [] as { date: string; event: string; value: number }[],
  };

  let ptTrend = 60;
  let romTrend = 55;
  let sleepTrend = 65;
  let stressTrend = 80;
  let inflammationTrend = 75;

  for (let i = 0; i < weeks; i++) {
    // Yoga practice (random walk with upward trend)
    data.yogaPractice.hatha.push(Math.max(0, 30 + i * 1.5 + (Math.random() - 0.4) * 15));
    data.yogaPractice.vinyasa.push(Math.max(0, 20 + i * 1.2 + (Math.random() - 0.4) * 15));
    data.yogaPractice.yin.push(Math.max(0, 15 + i * 1.0 + (Math.random() - 0.4) * 15));

    // Impact metrics (simulating correlation)
    const weeklyYogaTotal = data.yogaPractice.hatha[i] + data.yogaPractice.vinyasa[i] + data.yogaPractice.yin[i];

    ptTrend += (weeklyYogaTotal / 50) * 0.8 + (Math.random() - 0.5) * 3;
    data.impactMetrics.physicalTherapy.push(Math.min(100, Math.max(0, ptTrend)));

    romTrend += (weeklyYogaTotal / 50) * 0.75 + (Math.random() - 0.5) * 3;
    data.impactMetrics.rangeOfMotion.push(Math.min(100, Math.max(0, romTrend)));

    sleepTrend += (weeklyYogaTotal / 60) * 0.7 + (Math.random() - 0.5) * 2;
    data.impactMetrics.sleepQuality.push(Math.min(100, Math.max(0, sleepTrend)));

    stressTrend -= (weeklyYogaTotal / 50) * 0.8 + (Math.random() - 0.5) * 3; // Negative correlation
    data.impactMetrics.stressLevels.push(Math.min(100, Math.max(0, stressTrend)));

    inflammationTrend -= (weeklyYogaTotal / 50) * 0.7 + (Math.random() - 0.5) * 3; // Negative correlation
    data.impactMetrics.inflammation.push(Math.min(100, Math.max(0, inflammationTrend)));
  }

   // Add some mock milestones relative to the generated dates
   if (weeks > 8) {
    data.milestones.push({ date: data.dates[weeks - 9], event: 'Held Crow Pose 5s', value: data.impactMetrics.rangeOfMotion[weeks - 9] });
   }
   if (weeks > 16) {
     data.milestones.push({ date: data.dates[weeks - 17], event: 'Consistent AM Practice', value: data.impactMetrics.sleepQuality[weeks - 17] });
   }
   if (weeks > 24) {
     data.milestones.push({ date: data.dates[weeks - 2], event: 'Reduced Back Pain', value: data.impactMetrics.physicalTherapy[weeks - 2] });
   }

  return data;
};

const MOCK_DATA = generateMockData(WEEKS_TO_SHOW);

// NOTE: Correlation coefficients are removed as requested by user feedback.
// const CORRELATIONS = { ... };

export default function YogaImpactCorrelationMatrix() {
  // Cast the options object to EChartsOption
  const option: EChartsOption = {
    title: {
      text: 'Weekly Yoga Impact & Health Correlation',
      subtext: `Last ${WEEKS_TO_SHOW} Weeks Analysis`,
      left: 'center',
      top: 5,
      textStyle: {
        color: '#F8FAFC',
      },
      subtextStyle: {
        color: '#94A3B8',
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', crossStyle: { color: '#999' } },
      backgroundColor: 'rgba(30, 41, 59, 0.9)', // slate-800 with opacity
      borderColor: '#475569', // slate-600
      borderWidth: 1,
      textStyle: { color: '#F1F5F9' }, // slate-100
      formatter: (params: TooltipComponentFormatterCallbackParams) => {
        // Ensure params is an array before proceeding
        if (!Array.isArray(params)) {
          // Handle non-array case if necessary, maybe return a default string
          // For single point tooltips (like scatter), params might be an object
          // This example focuses on axis trigger which usually gives an array
          return '';
        }
        // Use params[0].name for category axis label, provide fallback
        const date = params[0].name ?? 'Unknown Week';
        let tooltip = `<div class="text-sm font-semibold mb-1">${date}</div>`;
        let totalYoga = 0;
        params.forEach(param => {
          // Ensure value is a number before calling toFixed
          const value = typeof param.value === 'number' ? param.value : (typeof param.value === 'string' ? parseFloat(param.value) : 0);
          // Safely handle potentially undefined seriesName
          const seriesName = param.seriesName ?? '';
          const color = param.color;

          // Check seriesName before using includes
          if (seriesName && ['Hatha', 'Vinyasa', 'Yin'].includes(seriesName)) {
            totalYoga += value;
            tooltip += `
              <div class="flex items-center justify-between mt-1 text-xs">
                <span><span class="inline-block w-2 h-2 rounded-full mr-2" style="background-color:${color};"></span>${seriesName}</span>
                <span class="font-medium ml-4">${value.toFixed(0)} min</span>
              </div>`;
          } else if (seriesName !== 'Milestones' && param.value !== undefined && param.value !== null) {
             tooltip += `
              <div class="flex items-center justify-between mt-1 text-xs">
                <span><span class="inline-block w-2 h-2 rounded-full mr-2" style="background-color:${color};"></span>${seriesName}</span>
                <span class="font-medium ml-4">${value.toFixed(1)}</span>
              </div>`;
          }
        });
         tooltip += `
              <div class="flex items-center justify-between mt-2 pt-1 border-t border-slate-600 text-xs">
                <span class="font-semibold">Total Yoga</span>
                <span class="font-semibold ml-4">${totalYoga.toFixed(0)} min</span>
              </div>`;
        return tooltip;
      },
    },
    legend: {
      data: [
        'Hatha', 'Vinyasa', 'Yin',
        'Physical Therapy', 'Range of Motion',
        'Sleep Quality', 'Stress Levels', 'Inflammation', 'Milestones'
      ],
      top: 50, // Adjusted top position
      textStyle: { color: '#94A3B8' }, // slate-400
      inactiveColor: '#475569', // slate-600
      itemGap: 15,
      type: 'scroll', // Enable scrollable legend if too many items
    },
    grid: {
      left: '2%',
      right: '3%',
      bottom: '10%', // Increased bottom margin for labels/zoom
      top: '20%', // Adjusted top margin for legend
      containLabel: true,
    },
    xAxis: {
      type: 'category', // Explicitly ensure this is the literal type 'category'
      boundaryGap: true,
      data: MOCK_DATA.dates,
      axisLabel: {
        color: '#94A3B8', // slate-400
        interval: 3, // Show label every 4 weeks to prevent overlap
        rotate: 30, // Rotate labels slightly
        fontSize: 10, // Smaller font size for labels
      },
      axisTick: { alignWithLabel: true },
      axisLine: { lineStyle: { color: '#475569' } }, // slate-600
    },
    yAxis: [
      {
        type: 'value',
        name: 'Yoga Minutes',
        nameTextStyle: { color: '#94A3B8', padding: [0, 0, 0, 35], fontSize: 11 },
        position: 'left',
        axisLabel: { color: '#94A3B8', formatter: '{value}', fontSize: 10 },
        axisLine: { show: true, lineStyle: { color: '#475569' } },
        splitLine: { lineStyle: { color: '#334155', type: 'dashed' } }, // slate-700 dashed
      },
      {
        type: 'value',
        name: 'Impact Score (0-100)',
        nameTextStyle: { color: '#94A3B8', padding: [0, 35, 0, 0], fontSize: 11 },
        position: 'right',
        min: 0,
        max: 100,
        axisLabel: { color: '#94A3B8', formatter: '{value}', fontSize: 10 },
        axisLine: { show: true, lineStyle: { color: '#475569' } },
        splitLine: { show: false }, // Hide split lines for the right axis
      },
    ],
    dataZoom: [ // Add data zoom for better navigation with many weeks
        {
            type: 'inside',
            start: 50, // Start showing the latter half
            end: 100,
            minValueSpan: 10, // Minimum 10 weeks visible
        },
        {
            type: 'slider', // Use slider type for visual control
            start: 50,
            end: 100,
            minValueSpan: 10,
            height: 25, // Slider height
            bottom: '3%', // Position slider at the bottom
            borderColor: '#475569',
            backgroundColor: '#1E293B', // Background of the slider area
            dataBackground: { // Style for the data preview area
                lineStyle: { color: '#475569', width: 0.5 },
                areaStyle: { color: 'rgba(71, 85, 105, 0.3)' }
            },
            selectedDataBackground: { // Style for the selected data preview area
                 lineStyle: { color: '#7DD3FC' }, // Light blue
                 areaStyle: { color: 'rgba(125, 211, 252, 0.3)' }
            },
            fillerColor: 'rgba(148, 163, 184, 0.2)', // Color of the selection rectangle
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#CBD5E1', // Handle color
                borderColor: '#94A3B8',
                borderWidth: 1,
                shadowBlur: 2,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowOffsetX: 1,
                shadowOffsetY: 1
            },
            moveHandleIcon: 'M8.2,13.6V3.9H6.3v9.7H3.1v14.9h3.3v9.7h1.8v-9.7h3.1V13.6H8.2z M9.7,24.4H4.8v-1.4h4.9V24.4z M9.7,19.1H4.8v-1.4h4.9V19.1z',
            moveHandleSize: 7,
            labelFormatter: '', // Hide text labels on slider handles
            textStyle: { color: '#94A3B8' }
        }
    ],
    series: [
      // Yoga Bars - Pass raw numbers
      {
        name: 'Hatha', type: 'bar', stack: 'Yoga Practice', emphasis: { focus: 'series' },
        data: MOCK_DATA.yogaPractice.hatha, itemStyle: { color: '#38BDF8', borderRadius: [2, 2, 0, 0] }, // sky-400, slight top radius
        barMaxWidth: 25,
      },
      {
        name: 'Vinyasa', type: 'bar', stack: 'Yoga Practice', emphasis: { focus: 'series' },
        data: MOCK_DATA.yogaPractice.vinyasa, itemStyle: { color: '#34D399', borderRadius: [2, 2, 0, 0] }, // emerald-400
        barMaxWidth: 25,
      },
      {
        name: 'Yin', type: 'bar', stack: 'Yoga Practice', emphasis: { focus: 'series' },
        data: MOCK_DATA.yogaPractice.yin, itemStyle: { color: '#A78BFA', borderRadius: [2, 2, 0, 0] }, // violet-400
        barMaxWidth: 25,
      },
      // Impact Lines - Pass raw numbers
      {
        name: 'Physical Therapy', type: 'line', yAxisIndex: 1, smooth: 0.3, // Slightly less smooth
        data: MOCK_DATA.impactMetrics.physicalTherapy,
        lineStyle: { width: 2 }, itemStyle: { color: '#F472B6' }, // pink-400
        symbol: 'circle', symbolSize: 4, showSymbol: false, // Hide symbols by default
        emphasis: { focus: 'series', lineStyle: { width: 3 }, scale: true }, // Emphasize on hover
      },
      {
        name: 'Range of Motion', type: 'line', yAxisIndex: 1, smooth: 0.3,
        data: MOCK_DATA.impactMetrics.rangeOfMotion,
        lineStyle: { width: 2 }, itemStyle: { color: '#FBBF24' }, // amber-400
        symbol: 'circle', symbolSize: 4, showSymbol: false,
        emphasis: { focus: 'series', lineStyle: { width: 3 }, scale: true },
      },
      {
        name: 'Sleep Quality', type: 'line', yAxisIndex: 1, smooth: 0.3,
        data: MOCK_DATA.impactMetrics.sleepQuality,
        lineStyle: { width: 2 }, itemStyle: { color: '#2DD4BF' }, // teal-400
        symbol: 'circle', symbolSize: 4, showSymbol: false,
        emphasis: { focus: 'series', lineStyle: { width: 3 }, scale: true },
      },
      {
        name: 'Stress Levels', type: 'line', yAxisIndex: 1, smooth: 0.3,
        data: MOCK_DATA.impactMetrics.stressLevels,
        lineStyle: { width: 2 }, itemStyle: { color: '#FB7185' }, // rose-400
        symbol: 'circle', symbolSize: 4, showSymbol: false,
        emphasis: { focus: 'series', lineStyle: { width: 3 }, scale: true },
      },
      {
        name: 'Inflammation', type: 'line', yAxisIndex: 1, smooth: 0.3,
        data: MOCK_DATA.impactMetrics.inflammation,
        lineStyle: { width: 2 }, itemStyle: { color: '#F97316' }, // orange-500
        symbol: 'circle', symbolSize: 4, showSymbol: false,
        emphasis: { focus: 'series', lineStyle: { width: 3 }, scale: true },
      },
      // Milestones
      {
        name: 'Milestones', type: 'scatter', yAxisIndex: 1,
        data: MOCK_DATA.milestones.map(m => ({
          value: [m.date, m.value], // Ensure value is passed correctly
          itemStyle: { color: '#4ADE80', borderColor: '#16A34A', borderWidth: 1.5, shadowColor: 'rgba(0, 0, 0, 0.5)', shadowBlur: 5 }, // green-400, green-600 border + shadow
          symbol: 'diamond', symbolSize: 12,
          label: {
            show: false, // Hide label by default, show on hover
            position: 'top', formatter: m.event,
            color: '#E2E8F0', // slate-200
            backgroundColor: 'rgba(15, 23, 42, 0.8)', // slate-900 with opacity
            padding: [4, 8], borderRadius: 4,
            distance: 10, // Distance from the point
            fontSize: 11,
          },
          emphasis: {
             label: { show: true }, // Show label on hover
             scale: 1.3, // Make diamond slightly larger on hover
          },
          tooltip: { // Custom tooltip for milestones - params here is usually a single object
            formatter: (params: any) => { // Keep 'any' here for simplicity or use specific scatter tooltip type if needed
              // Type guard for scatter plot tooltip which passes a single param object
              if (typeof params === 'object' && params !== null && !Array.isArray(params) && params.data) {
                 const data = params.data as { value: [string, number], name: string }; // Scatter points might use 'name' for the event
                 const eventName = params.name || (params.data as any).name || 'Milestone'; // Fallback name
                 const score = data.value[1];
                 const dateLabel = data.value[0]; // The date string from the value array
                 return `<div class="text-sm font-semibold">${eventName}</div><div class="text-xs text-slate-400">${dateLabel}</div><div class="text-xs">Score: ${score.toFixed(1)}</div>`;
              }
              return ''; // Fallback for unexpected format
            }
          }
        })),
        z: 10 // Ensure milestones are drawn on top
      },
    ],
  };

  return (
    // Adjusted container styles
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-xl p-4 sm:p-6 border border-slate-700/50">
      <ReactECharts
        option={option}
        style={{ height: '550px' }} // Increased height slightly
        theme="dark" // Using default dark theme adjustments
        notMerge={true}
        lazyUpdate={true}
      />
      {/* Correlation section removed as requested */}
    </div>
  );
}
