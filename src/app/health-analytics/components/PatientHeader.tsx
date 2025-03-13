'use client';

import { useState } from 'react';
import Link from 'next/link';
import MessageIcon from './messages/MessageIcon';
import MessengerWindow from './messages/MessengerWindow';

interface PatientHeaderProps {
  patientName: string;
  patientId: number;
  practitionerId?: number; // Optional since practitioners don't need this
  currentUserId: number;
  userRole: 'patient' | 'practitioner';
}

export default function PatientHeader({
  patientName,
  patientId,
  currentUserId,
  userRole,
  practitionerId
}: PatientHeaderProps) {
  const [isMessengerMinimized, setIsMessengerMinimized] = useState(true);
  const [showMessenger, setShowMessenger] = useState(false);

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex-1">
        <Link
          href="/patients"
          className="text-[#94A3B8] hover:text-[#F97316] transition-colors inline-flex items-center"
        >
          ← Back to Patients
        </Link>
        <div className="flex items-center gap-3 mt-4">
          <h1 className="text-3xl font-bold text-[#F8FAFC]">
            {patientName}'s Health Analytics
          </h1>
          <MessageIcon 
            currentUserId={currentUserId}
            userRole={userRole}
            patientId={userRole === 'patient' ? currentUserId : patientId}
            onClick={() => {
              setShowMessenger(true);
              setIsMessengerMinimized(false);
            }}
          />
        </div>
      </div>

      {showMessenger && (
        <MessengerWindow
          patientId={userRole === 'patient' ? currentUserId : patientId}
          practitionerId={userRole === 'patient' ? practitionerId! : currentUserId}
          patientName={patientName}
          currentUserId={currentUserId}
          userRole={userRole}
          isMinimized={isMessengerMinimized}
          onMinimize={() => setIsMessengerMinimized(!isMessengerMinimized)}
        />
      )}
    </div>
  );
}
