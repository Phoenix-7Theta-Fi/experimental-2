'use client';

import React, { useState } from 'react';
import { MedicationTracking } from '@/lib/types/health';
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';

interface AdherenceCalendarProps {
  adherenceData: MedicationTracking['adherence'];
}

const AdherenceCalendar: React.FC<AdherenceCalendarProps> = ({ adherenceData }) => {
  const [currentDate] = useState(new Date());
  
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getDayAdherence = (date: Date): number => {
    const dateStr = format(date, 'yyyy-MM-dd');
    let totalTaken = 0;
    let totalMedications = 0;

    Object.values(adherenceData).forEach(medicationAdherence => {
      const dayAdherence = medicationAdherence.find(a => a.date === dateStr);
      if (dayAdherence) {
        totalMedications++;
        if (dayAdherence.taken) totalTaken++;
      }
    });

    return totalMedications > 0 ? Math.round((totalTaken / totalMedications) * 100) : 0;
  };

  const getAdherenceColor = (percentage: number): string => {
    if (percentage >= 80) return 'bg-emerald-500/20 text-emerald-500';
    if (percentage >= 50) return 'bg-amber-500/20 text-amber-500';
    return 'bg-red-500/20 text-red-500';
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const renderCalendarDay = (day: Date) => {
    const adherenceRate = getDayAdherence(day);
    const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

    return (
      <div
        key={day.toString()}
        className={`
          h-16 p-2 rounded-lg
          ${getAdherenceColor(adherenceRate)}
          ${isToday ? 'ring-2 ring-blue-500' : ''}
          transition-all duration-200 hover:scale-105
          flex flex-col items-center justify-between
          cursor-pointer
        `}
      >
        <span className="text-sm font-medium">
          {format(day, 'd')}
        </span>
        <span className="text-xs font-bold">
          {adherenceRate}%
        </span>
      </div>
    );
  };

  const renderLegendItem = (color: string, textColor: string, label: string) => (
    <div className="flex items-center">
      <div className={`w-4 h-4 rounded-lg ${color} ${textColor}`} />
      <span className="text-sm text-slate-300 ml-2">{label}</span>
    </div>
  );

  return (
    <div className="bg-slate-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-slate-100 mb-6 text-center">
        Medication Adherence - {format(currentDate, 'MMMM yyyy')}
      </h3>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-slate-400 mb-2">
            {day}
          </div>
        ))}

        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-${index}`} className="h-16" />
        ))}

        {days.map((day) => renderCalendarDay(day))}
      </div>

      <div className="mt-6 flex items-center justify-center space-x-6">
        {renderLegendItem('bg-emerald-500/20', 'text-emerald-500', 'High (≥80%)')}
        {renderLegendItem('bg-amber-500/20', 'text-amber-500', 'Medium (≥50%)')}
        {renderLegendItem('bg-red-500/20', 'text-red-500', 'Low (<50%)')}
      </div>
    </div>
  );
};

export default AdherenceCalendar;
