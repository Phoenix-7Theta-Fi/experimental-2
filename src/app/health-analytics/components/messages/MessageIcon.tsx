'use client';

import { useState, useEffect } from 'react';
import { BsChatDots } from 'react-icons/bs';
import { getUnreadMessageCount } from '@/lib/db/messages';

interface MessageIconProps {
  currentUserId: number;
  userRole: 'patient' | 'practitioner';
  patientId: number;
  onClick: () => void;
}

export default function MessageIcon({ currentUserId, userRole, patientId, onClick }: MessageIconProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const response = await fetch(`/api/messages/${patientId}`);
      if (response.ok) {
        const messages = await response.json();
        const count = messages.filter((msg: any) => {
          if (userRole === 'practitioner') {
            return msg.patient_id === patientId && !msg.read_at;
          } else {
            return msg.practitioner_id === patientId && !msg.read_at;
          }
        }).length;
        setUnreadCount(count);
      }
    };

    fetchUnreadCount();
  }, [patientId, userRole]);

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center justify-center p-2 rounded-full hover:bg-slate-700 transition-colors relative"
      title="Messages"
    >
      <BsChatDots className="w-5 h-5 text-[#F8FAFC]" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </button>
  );
}
