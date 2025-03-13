'use client';

import { format, addDays, isSameDay } from 'date-fns';
import { useState } from 'react';

interface WeekNavigatorProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export default function WeekNavigator({ selectedDate, onDateSelect }: WeekNavigatorProps) {
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  
  // Generate array of dates centered around selected date (-3 to +3)
  const dates = Array.from({ length: 7 }, (_, i) => addDays(selectedDate, i - 3));

  const handleDateChange = (newDate: Date, newDirection: 'left' | 'right') => {
    setDirection(newDirection);
    onDateSelect(newDate);
    // Reset direction after animation
    setTimeout(() => setDirection(null), 200);
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-6 select-none">
      <div key={format(selectedDate, 'MMMM yyyy')} className="relative text-sm text-gray-400 font-medium">
        <div className="animate-fadeIn">
          {format(selectedDate, 'MMMM yyyy')}
        </div>
      </div>
      <div className="relative flex items-center gap-4">
        <button
          onClick={() => handleDateChange(addDays(selectedDate, -1), 'right')}
          className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 
                     transition-all duration-200 hover:scale-110 active:scale-95 transform"
          aria-label="Previous day"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div className="inline-flex rounded-lg bg-gray-800/50 p-1 shadow-lg overflow-hidden">
          <div className={`
            flex transition-transform duration-200
            ${direction === 'left' ? 'animate-slideLeftIn' : ''}
            ${direction === 'right' ? 'animate-slideRightIn' : ''}
          `}>
            {dates.map((date: Date) => {
              const isSelected = isSameDay(date, selectedDate);
              const isToday = isSameDay(date, new Date());
              
              return (
                <button
                  key={date.toISOString()}
                  onClick={() => onDateSelect(date)}
                  className={`
                    flex flex-col items-center justify-center px-3 py-2 min-w-[60px]
                    rounded-md transition-all duration-300 transform
                    ${isSelected ? 'bg-primary text-white scale-105' : 'text-gray-400 hover:bg-gray-700/50'}
                    ${isToday ? 'ring-2 ring-primary/50' : ''}
                    hover:scale-105 active:scale-95
                  `}
                >
                  <span className="text-xs font-medium">
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-lg font-semibold">
                    {format(date, 'd')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={() => handleDateChange(addDays(selectedDate, 1), 'left')}
          className="p-2 rounded-lg hover:bg-gray-700/50 text-gray-400 
                     transition-all duration-200 hover:scale-110 active:scale-95 transform"
          aria-label="Next day"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        <button
          onClick={() => onDateSelect(new Date())}
          className="ml-4 px-4 py-1.5 text-sm text-gray-400 hover:text-primary 
                     hover:bg-gray-800/50 rounded-md transition-all duration-200
                     border border-gray-700/50 backdrop-blur-sm transform
                     hover:scale-105 active:scale-95"
        >
          Today
        </button>
      </div>
    </div>
  );
}
