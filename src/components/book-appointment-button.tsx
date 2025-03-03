'use client';

import { useState } from 'react';
import BookAppointmentModal from './book-appointment-modal';

interface BookAppointmentButtonProps {
  practitionerId: number;
}

export default function BookAppointmentButton({ practitionerId }: BookAppointmentButtonProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-lg transition-colors"
      >
        Book Appointment
      </button>

      {showModal && (
        <BookAppointmentModal
          practitionerId={practitionerId}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            // Could add a toast notification here
          }}
        />
      )}
    </>
  );
}
