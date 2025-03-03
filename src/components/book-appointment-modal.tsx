import { useState } from 'react';
import { TimeSlot } from '@/lib/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

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
  const handleDateChange = async (date: Date | null) => {
    if (!date) {
      setTimeSlots([]);
      return;
    }

    setDate(date);
    try {
      const formattedDate = date.toISOString().split('T')[0];
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
          date: date.toISOString().split('T')[0],
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
            <DatePicker
              selected={date}
              onChange={handleDateChange}
              minDate={minDate}
              dateFormat="MMMM d, yyyy"
              className="w-full p-2 rounded bg-[#334155] text-[#F8FAFC] border border-[#475569]"
              wrapperClassName="w-full"
              placeholderText="Select a date"
              filterDate={(date: Date) => date.getDay() !== 0 && date.getDay() !== 6} // Exclude weekends
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
                    className={`p-2 rounded text-center transition-colors ${
                      selectedSlot === slot.time
                        ? 'bg-[#3B82F6] text-white'
                        : slot.available
                        ? 'bg-[#334155] text-[#F8FAFC] hover:bg-[#475569]'
                        : 'bg-[#1E293B] text-[#64748B] cursor-not-allowed'
                    }`}
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
              className={`px-4 py-2 rounded ${
                !date || !selectedSlot || loading
                  ? 'bg-[#3B82F6]/50 cursor-not-allowed'
                  : 'bg-[#3B82F6] hover:bg-[#2563EB]'
              } text-white transition-colors`}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
