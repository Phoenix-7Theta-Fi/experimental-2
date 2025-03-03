'use client';

interface AppointmentActionsProps {
  appointmentId: number;
  onStatusUpdate: (status: 'confirmed' | 'cancelled') => Promise<void>;
}

export default function AppointmentActions({
  appointmentId,
  onStatusUpdate
}: AppointmentActionsProps) {
  const handleStatusChange = async (status: 'confirmed' | 'cancelled') => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      await onStatusUpdate(status);
    } catch (error) {
      console.error('Error updating appointment status:', error);
      // Could add a toast notification here
    }
  };

  return (
    <div className="space-x-2">
      <button
        className="px-4 py-1 bg-[#042F2E] text-[#2DD4BF] rounded hover:bg-[#134E4A] transition-colors"
        onClick={() => handleStatusChange('confirmed')}
      >
        Confirm
      </button>
      <button
        className="px-4 py-1 bg-[#4C0519] text-[#F43F5E] rounded hover:bg-[#881337] transition-colors"
        onClick={() => handleStatusChange('cancelled')}
      >
        Cancel
      </button>
    </div>
  );
}
