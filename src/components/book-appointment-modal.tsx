import { useState } from 'react';
import { TimeSlot } from '@/lib/types';
import { format } from 'date-fns';
import clsx from 'clsx';

interface BookAppointmentModalProps {
  practitionerId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BookAppointmentModal({
  practitionerId,
  onClose,
  onSuccess
}: BookAppointmentModalProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch available time slots when date changes
  const handleDateChange = async (selectedDate: Date) => {
    if (!selectedDate) {
      setTimeSlots([]);
      return;
    }

    setDate(selectedDate);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(
        `/api/appointments?practitionerId=${practitionerId}&date=${formattedDate}`
      );
      if (!response.ok) throw new Error('Failed to fetch time slots');
      const slots = await response.json();
      setTimeSlots(slots);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setError('Failed to load available time slots');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !selectedSlot) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practitionerId,
          date: format(date, 'yyyy-MM-dd'),
          timeSlot: selectedSlot
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to book appointment');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(error instanceof Error ? error.message : 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Filter out past dates
  const minDate = new Date();
  minDate.setHours(0, 0, 0, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[#1E293B] rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">Book Appointment</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#94A3B8] mb-2">Select Date</label>
            <input
              type="date"
              min={format(minDate, 'yyyy-MM-dd')}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              className="w-full p-2 rounded bg-[#334155] text-[#F8FAFC] border border-[#475569]"
            />
          </div>

          {timeSlots.length > 0 && (
            <div className="mb-4">
              <label className="block text-[#94A3B8] mb-2">Select Time</label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map(slot => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    onClick={() => setSelectedSlot(slot.time)}
                    className={clsx(
                      'p-2 rounded text-center transition-colors',
                      {
                        'bg-[#3B82F6] text-white': selectedSlot === slot.time,
                        'bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]': selectedSlot !== slot.time && slot.available,
                        'bg-[#1E293B] text-[#64748B] cursor-not-allowed': !slot.available
                      }
                    )}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-[#EF4444] mb-4">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-[#334155] text-[#F8FAFC] hover:bg-[#475569] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!date || !selectedSlot || loading}
              className={clsx(
                'px-4 py-2 rounded text-white transition-colors',
                {
                  'bg-[#3B82F6]/50 cursor-not-allowed': !date || !selectedSlot || loading,
                  'bg-[#3B82F6] hover:bg-[#2563EB]': date && selectedSlot && !loading
                }
              )}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
