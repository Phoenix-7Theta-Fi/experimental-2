'use client';

import React, { useRef, useEffect, useState } from 'react';
import type { MoodEntry } from '@/lib/types/health';

// Keep the original mock data as fallback
const MOCK_MOOD_JOURNEY: MoodEntry[] = [
  { date: '2024-01-01', mood: 'calm', intensity: 7, trigger: 'Morning meditation', note: 'Started the year positive' },
  { date: '2024-01-02', mood: 'excited', intensity: 8, trigger: 'New project kickoff' },
  { date: '2024-01-03', mood: 'stressed', intensity: 3, trigger: 'Deadline pressure', note: 'Multiple tasks due' },
  { date: '2024-01-04', mood: 'happy', intensity: 9, trigger: 'Achievement', note: 'Completed milestone' },
  { date: '2024-01-05', mood: 'anxious', intensity: 4, trigger: 'Upcoming presentation' },
];

const MOOD_EMOJIS: Record<MoodEntry['mood'], string> = {
  happy: '😊', excited: '🤗', calm: '😌', neutral: '😐', sad: '😢', anxious: '😰', stressed: '😫'
};

const MOOD_COLORS: Record<MoodEntry['mood'], string> = {
  happy: '#10B981', excited: '#F59E0B', calm: '#60A5FA', neutral: '#94A3B8',
  sad: '#6B7280', anxious: '#F97316', stressed: '#EF4444'
};
// --- End Existing Data ---


// --- Reference Code Adaptations ---

// Direct emoji mapping for Y-axis based on intensity levels
const intensityLevelEmojis: Record<number, string> = {
  10: "🤩", // Top
  8: "😊",
  6: "😌",
  4: "😐",
  2: "😟", // Bottom
};

// Helper to get day number from date string
const getDayOfMonth = (dateString: string): string => {
  // Added check for invalid date
  const date = new Date(dateString);
  return !isNaN(date.getTime()) ? date.getDate().toString() : '';
};

// Helper to generate SVG path data (from reference, adapted for date)
function generateSvgPath(
  entries: MoodEntry[],
  xScale: (date: number) => number,
  yScale: (intensity: number) => number,
  closePath: boolean = false
): string {
  if (!entries?.length) return '';
  const points = entries.map(entry => ({
    x: xScale(new Date(entry.date).getTime()),
    y: yScale(entry.intensity)
  }));

  // Filter out invalid points before generating path
  const validPoints = points.filter(p => !isNaN(p.x) && !isNaN(p.y));
  if (!validPoints.length) {
      console.warn("No valid points to generate SVG path.");
      return '';
  }

  if (validPoints.length === 1) {
    return `M ${validPoints[0].x} ${validPoints[0].y}`;
  }

  let path = `M ${validPoints[0].x} ${validPoints[0].y}`;
  for (let i = 0; i < validPoints.length - 1; i++) {
    // Basic line segments - could be enhanced with curves (e.g., Catmull-Rom) later
    path += ` L ${validPoints[i+1].x} ${validPoints[i+1].y}`;
  }

  if (closePath && validPoints.length > 1) {
    // Use the actual chart bottom, derived from yScale(1) or similar min intensity
    const chartBottomY = yScale(1); // Assuming intensity 1 is the minimum possible Y
    path += ` L ${validPoints[validPoints.length - 1].x} ${chartBottomY}`;
    path += ` L ${validPoints[0].x} ${chartBottomY}`;
    path += ` Z`;
  }

  return path;
}

// Helper to generate gradient stops (implementing logic from reference)
function getGradientStops(entries: MoodEntry[]): { offset: string; color: string }[] {
  if (!entries || entries.length === 0) return [];
  if (entries.length === 1) return [{ offset: '0%', color: MOOD_COLORS[entries[0].mood] }];

  // Filter out entries that might cause issues before mapping
  const validEntries = entries.filter(entry => entry && entry.mood && MOOD_COLORS[entry.mood]);
  if (validEntries.length <= 1) {
      return validEntries.length === 1 ? [{ offset: '0%', color: MOOD_COLORS[validEntries[0].mood] }] : [];
  }


  return validEntries.map((entry, index) => ({
    offset: `${(index / (validEntries.length - 1)) * 100}%`,
    color: MOOD_COLORS[entry.mood],
  }));
}

interface MoodJourneyMapProps {
  data?: MoodEntry[]; // Real data from database
  className?: string;
}

// Extended mock data for testing
const EXTENDED_MOCK_DATA: MoodEntry[] = [
  ...MOCK_MOOD_JOURNEY,
  { date: '2024-01-06', mood: 'neutral', intensity: 5, note: 'Quiet day' },
  { date: '2024-01-07', mood: 'sad', intensity: 2, trigger: 'Bad news' },
  { date: '2024-01-08', mood: 'calm', intensity: 6 },
];


export default function MoodJourneyMap({ 
  data = EXTENDED_MOCK_DATA, // Use mock data as fallback
  className = '' 
}: MoodJourneyMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Add this to determine if we're using mock data
  const isUsingMockData = !data || data === EXTENDED_MOCK_DATA;

  const PADDING = { top: 20, right: 20, bottom: 40, left: 50 };
  const CHART_HEIGHT = 200; // Adjusted height
  const Y_AXIS_WIDTH = PADDING.left;
  const X_AXIS_HEIGHT = PADDING.bottom;

  // Sort data by date, ensure data is always an array
  const sortedData = React.useMemo(() =>
    [...(data || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [data]
  );

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: Math.max(width - PADDING.left - PADDING.right, 100), // Ensure min width
          height: CHART_HEIGHT // Use fixed height
        });
      }
    };

    // Initial call
    updateDimensions();

    // Use ResizeObserver for more robust container resizing detection
    let observer: ResizeObserver | null = null;
    if (containerRef.current) {
        observer = new ResizeObserver(updateDimensions);
        observer.observe(containerRef.current);
    }


    // Fallback for window resize if ResizeObserver isn't supported or fails
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
      if (observer && containerRef.current) {
          observer.unobserve(containerRef.current);
      }
       if (observer) {
           observer.disconnect();
       }
    };
  }, [PADDING.left, PADDING.right]); // Rerun if padding changes

  // --- Scales ---
  const dates = sortedData.map(d => new Date(d.date).getTime()).filter(t => !isNaN(t)); // Filter out invalid dates
  const minDate = dates.length > 0 ? Math.min(...dates) : Date.now();
  const maxDate = dates.length > 0 ? Math.max(...dates) : Date.now();
  // Handle case with single data point or same dates
  const dateRange = (maxDate > minDate) ? (maxDate - minDate) : 1;

  const xScale = (date: number): number => {
     if (isNaN(date)) return NaN; // Handle invalid date input
     if (sortedData.length === 1) return dimensions.width / 2; // Center single point
     if (dateRange === 1) return dimensions.width / 2; // Also center if min/max are same
     // Clamp date to the calculated range before scaling
     const clampedDate = Math.max(minDate, Math.min(maxDate, date));
     return ((clampedDate - minDate) / dateRange) * dimensions.width;
  };

  const yScale = (intensity: number): number => {
    if (isNaN(intensity)) return NaN; // Handle invalid intensity
    const clampedIntensity = Math.max(1, Math.min(10, intensity));
    // Ensure dimensions.height is not 0 to avoid NaN/Infinity
    return dimensions.height > 0 ? dimensions.height - ((clampedIntensity - 1) / 9) * dimensions.height : 0;
  };
  // --- End Scales ---

  const gradientStops = getGradientStops(sortedData);
  const linePath = generateSvgPath(sortedData, xScale, yScale);
  const fillPath = generateSvgPath(sortedData, xScale, yScale, true);

  const handleMouseMove = (event: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !sortedData || sortedData.length < 1 || dimensions.width <= 0) {
        setHoveredIndex(null);
        return;
    }

    const svgRect = svgRef.current.getBoundingClientRect();
    const svgX = event.clientX - svgRect.left - PADDING.left;

    let closestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < sortedData.length; i++) {
        const pointX = xScale(new Date(sortedData[i].date).getTime());
        if (isNaN(pointX)) continue;

        const distance = Math.abs(svgX - pointX);
        if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
        }
    }

    const avgDist = sortedData.length > 1 ? dimensions.width / (sortedData.length - 1) : dimensions.width;
    const threshold = isFinite(avgDist) && avgDist > 0 ? Math.max(10, avgDist / 2) : 20;

    if (closestIndex !== -1 && minDistance <= threshold) {
       setHoveredIndex(closestIndex);
    } else {
       setHoveredIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const hoveredEntry = hoveredIndex !== null && sortedData[hoveredIndex] ? sortedData[hoveredIndex] : null;

  // Render placeholder if width/height is 0 or data is loading/empty
   if (dimensions.width <= 0 || dimensions.height <= 0) {
       return (
           <div ref={containerRef} className={`relative ${className} bg-[#1E293B] border border-[#475569] rounded-lg p-4 overflow-hidden flex items-center justify-center`} style={{ height: CHART_HEIGHT + PADDING.top + PADDING.bottom }}>
               <div className="mb-2 absolute top-4 left-4">
                   <h3 className="text-[#F8FAFC] font-semibold text-base">Mood Journey</h3>
               </div>
               {/* Optional: Loading indicator */}
                <p className="text-[#94A3B8] text-sm">Loading chart...</p>
           </div>
       );
   }


  if (!sortedData?.length) {
    return (
      <div ref={containerRef} className={`flex items-center justify-center ${className} bg-[#1E293B] border border-[#475569] rounded-lg p-4`} style={{ height: CHART_HEIGHT + PADDING.top + PADDING.bottom }}>
        <p className="text-[#94A3B8]">No mood data available</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      // Corrected className syntax: removed extra closing brace `}`
      className={`relative ${className} bg-[#1E293B] border border-[#475569] rounded-lg p-4 overflow-hidden`}
    >
      <div className="mb-2">
        <div className="flex items-center gap-3">
          <h3 className="text-[#F8FAFC] font-semibold text-base">Mood Journey</h3>
          {isUsingMockData && (
            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Using Demo Data
            </span>
          )}
        </div>
      </div>

      <div className="relative" style={{ height: CHART_HEIGHT + PADDING.top + PADDING.bottom }}>
        <svg
          ref={svgRef}
          width={dimensions.width + PADDING.left + PADDING.right} // Full width including padding
          height={CHART_HEIGHT + PADDING.top + PADDING.bottom}
          className="overflow-visible" // Allow hover elements to overflow slightly
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <defs>
            {gradientStops.length > 0 && ( // Only render gradients if stops exist
                <>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        {gradientStops.map((stop, i) => (
                            <stop key={`line-stop-${i}`} offset={stop.offset} stopColor={stop.color} />
                        ))}
                    </linearGradient>
                    <linearGradient id="fillGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        {gradientStops.map((stop, i) => (
                            <stop key={`fill-stop-${i}`} offset={stop.offset} stopColor={stop.color} stopOpacity={0.25} />
                        ))}
                    </linearGradient>
                </>
            )}
          </defs>

          {/* Y-Axis Emojis */}
          <g transform={`translate(0, ${PADDING.top})`}>
            {Object.entries(intensityLevelEmojis).map(([level, emoji]) => {
              const intensity = parseInt(level, 10);
              const yPos = yScale(intensity);
              if (isNaN(yPos)) return null;
              return (
                <text
                  key={`y-emoji-${level}`}
                  x={PADDING.left - 25}
                  y={yPos}
                  dy="0.35em"
                  textAnchor="middle"
                  fontSize="18"
                  fill="#94A3B8"
                >
                  {emoji}
                </text>
              );
            })}
          </g>

          {/* Main Chart Area */}
          <g transform={`translate(${PADDING.left}, ${PADDING.top})`}>
            {/* X-Axis Grid Lines (Optional) */}
            {Object.keys(intensityLevelEmojis).map(level => {
               const yPosGrid = yScale(parseInt(level, 10));
               if (isNaN(yPosGrid)) return null;
               return (
                  <line
                    key={`grid-${level}`}
                    x1={0}
                    y1={yPosGrid}
                    x2={dimensions.width}
                    y2={yPosGrid}
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
               );
            })}

            {/* Fill Path */}
            {fillPath && gradientStops.length > 0 && ( // Check for stops before using gradient
              <path
                d={fillPath}
                fill="url(#fillGradient)"
                stroke="none"
              />
            )}

            {/* Line Path */}
            {linePath && gradientStops.length > 0 && ( // Check for stops before using gradient
              <path
                d={linePath}
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* X-Axis Labels (Day Numbers) */}
            {sortedData.map((entry, index) => {
              const showLabel = sortedData.length <= 31 || index % Math.ceil(sortedData.length / 15) === 0;
              if (!showLabel) return null;

              const x = xScale(new Date(entry.date).getTime());
              if (isNaN(x)) return null;

              return (
                <text
                  key={`x-label-${index}`}
                  x={x}
                  y={dimensions.height + X_AXIS_HEIGHT / 2}
                  dy="0.35em"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#94A3B8"
                >
                  {getDayOfMonth(entry.date)}
                </text>
              );
            })}

             {/* Hover Indicator Circle */}
             {hoveredEntry && hoveredIndex !== null &&
                !isNaN(xScale(new Date(hoveredEntry.date).getTime())) &&
                !isNaN(yScale(hoveredEntry.intensity)) && (
                <circle
                    cx={xScale(new Date(hoveredEntry.date).getTime())}
                    cy={yScale(hoveredEntry.intensity)}
                    r="6"
                    fill={MOOD_COLORS[hoveredEntry.mood]}
                    stroke="#F8FAFC"
                    strokeWidth="2"
                    style={{ pointerEvents: 'none' }}
                />
             )}
          </g>
        </svg>

        {/* Tooltip */}
        {hoveredEntry && hoveredIndex !== null &&
            !isNaN(xScale(new Date(hoveredEntry.date).getTime())) &&
            !isNaN(yScale(hoveredEntry.intensity)) && (
          <div
            className="absolute bg-[#293548]/90 backdrop-blur-sm border border-[#475569] rounded-md shadow-lg p-2.5 z-20 text-xs pointer-events-none" // Added pointer-events-none class
            style={{
              left: `${PADDING.left + xScale(new Date(hoveredEntry.date).getTime())}px`,
              top: `${PADDING.top + yScale(hoveredEntry.intensity)}px`,
              transform: 'translate(-50%, -130%)', // Position above the point
              minWidth: '160px', // Ensure tooltip has some width
              // pointerEvents: 'none', // Moved to className for Tailwind consistency
            }}
          >
            <div className="flex items-center gap-2 mb-1.5">
               <span style={{ fontSize: '16px' }}>{MOOD_EMOJIS[hoveredEntry.mood]}</span>
               <div className="font-semibold text-[#F1F5F9] capitalize">
                 {hoveredEntry.mood} ({hoveredEntry.intensity}/10)
               </div>
            </div>
             <div className="text-[11px] text-[#CBD5E1] mb-1.5">
                {new Date(hoveredEntry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
             </div>
            {hoveredEntry.trigger && (
              <div className="text-[11px] text-[#CBD5E1] mt-1 pt-1 border-t border-[#475569]/60">
                Trigger: {hoveredEntry.trigger}
              </div>
            )}
            {hoveredEntry.note && (
              <div className="text-[11px] text-[#CBD5E1] mt-1 italic">
                "{hoveredEntry.note}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
