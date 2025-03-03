'use client';

interface HeartRateAnimationProps {
  currentRate: number;
  maxRate: number;
  restingRate: number;
}

export default function HeartRateAnimation({ currentRate, maxRate, restingRate }: HeartRateAnimationProps) {
  // Calculate zone based on heart rate
  const getZoneColor = () => {
    const percentage = ((currentRate - restingRate) / (maxRate - restingRate)) * 100;
    if (percentage < 60) return '#3B82F6'; // Rest Zone - Blue
    if (percentage < 70) return '#10B981'; // Fat Burn - Green
    if (percentage < 80) return '#F97316'; // Cardio - Orange
    if (percentage < 90) return '#EF4444'; // Peak - Red
    return '#8B5CF6'; // Max - Purple
  };

  // Calculate animation duration based on heart rate (faster rate = faster animation)
  const animationDuration = 60 / currentRate; // seconds for one beat

  return (
    <div className="relative">
      {/* Heart Icon with Animation */}
      <div 
        className="w-24 h-24 relative mx-auto"
        style={{
          animation: `heartbeat ${animationDuration}s ease-in-out infinite`,
        }}
      >
        <svg 
          viewBox="0 0 32 32" 
          className="w-full h-full"
          fill={getZoneColor()} 
          stroke="currentColor" 
          strokeWidth="1"
        >
          <path d="M16 28.8c-.3 0-.5-.1-.7-.3l-11.3-11.3c-2.5-2.5-2.5-6.6 0-9.1 1.2-1.2 2.8-1.9 4.5-1.9 1.7 0 3.3.7 4.5 1.9l3 3 3-3c2.5-2.5 6.6-2.5 9.1 0 1.2 1.2 1.9 2.8 1.9 4.5s-.7 3.3-1.9 4.5l-11.3 11.3c-.2.2-.4.3-.7.3zm-7.5-20.5c-1.2 0-2.3.5-3.2 1.3-1.8 1.8-1.8 4.6 0 6.4l10.7 10.7 10.7-10.7c.9-.9 1.3-2 1.3-3.2s-.5-2.3-1.3-3.2c-1.8-1.8-4.6-1.8-6.4 0l-3.7 3.7c-.4.4-1 .4-1.4 0l-3.7-3.7c-.9-.8-2-1.3-3.2-1.3z"/>
        </svg>
      </div>

      {/* Current Heart Rate Display */}
      <div className="text-center mt-2">
        <span className="text-3xl font-bold" style={{ color: getZoneColor() }}>
          {currentRate}
        </span>
        <span className="text-[#94A3B8] ml-1">bpm</span>
      </div>

      {/* Zone Indicator */}
      <div className="text-center mt-1 text-sm text-[#94A3B8]">
        {(() => {
          const percentage = ((currentRate - restingRate) / (maxRate - restingRate)) * 100;
          if (percentage < 60) return 'Rest Zone';
          if (percentage < 70) return 'Fat Burn';
          if (percentage < 80) return 'Cardio';
          if (percentage < 90) return 'Peak';
          return 'Maximum';
        })()}
      </div>

      <style jsx>{`
        @keyframes heartbeat {
          0% {
            transform: scale(1);
          }
          15% {
            transform: scale(1.25);
          }
          30% {
            transform: scale(1);
          }
          45% {
            transform: scale(1.15);
          }
          60% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
