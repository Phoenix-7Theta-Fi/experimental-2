'use client';

interface CircularGaugeProps {
  value: number;
  maxValue: number;
  minValue: number;
  color: string;
  label: string;
  unit: string;
  size?: number;
  thickness?: number;
  showValue?: boolean;
  customValue?: React.ReactNode;
}

export default function CircularGauge({
  value,
  maxValue,
  minValue,
  color,
  label,
  unit,
  size = 120,
  thickness = 8,
  showValue = true,
  customValue,
}: CircularGaugeProps) {
  const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg className="w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1E293B"
          strokeWidth={thickness}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-in-out"
        />
      </svg>

      {/* Label and value */}
      {customValue ? (
        customValue
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[#94A3B8] text-xs">
            {label}
          </span>
          {showValue && (
            <>
              <span className="text-lg font-bold" style={{ color }}>
                {value}
              </span>
              {unit && (
                <span className="text-[#94A3B8] text-xs">
                  {unit}
                </span>
              )}
            </>
          )}
        </div>
      )}

      {/* Progress ticks */}
      <div className="absolute inset-0">
        {[...Array(8)].map((_, i) => {
          const rotation = (i * 360) / 8;
          const isActive = (i / 8) * 100 <= percentage;
          return (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                backgroundColor: isActive ? color : '#1E293B',
                left: '50%',
                top: thickness / 2,
                transform: `translateX(-50%) rotate(${rotation}deg)`,
                transformOrigin: `50% ${size / 2 - thickness / 2}px`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
