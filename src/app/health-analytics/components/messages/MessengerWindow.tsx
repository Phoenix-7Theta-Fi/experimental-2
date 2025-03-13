'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/lib/db/messages';
import { BsChevronDown, BsChevronUp } from 'react-icons/bs';
import MessageInput from './MessageInput';

interface MessengerWindowProps {
  patientId: number;
  patientName: string;
  practitionerId: number;
  currentUserId: number;
  userRole: 'patient' | 'practitioner';
  isMinimized: boolean;
  onMinimize: () => void;
}

export default function MessengerWindow({
  patientId,
  patientName,
  practitionerId,
  currentUserId,
  userRole,
  isMinimized,
  onMinimize
}: MessengerWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const [shouldFocus, setShouldFocus] = useState(false);

  useEffect(() => {
    if (!isMinimized) {
      setShouldFocus(true);
    }
  }, [isMinimized]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
          messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [patientId]);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isSending) return;

    setIsSending(true);
    try {
      console.log('Sending message:', content);
        const response = await fetch(`/api/messages/${patientId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content,
          userRole,
          practitionerId 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const newMessage = await response.json();
      console.log('Message sent:', newMessage);
      
      setMessages(prev => [...prev, newMessage]);
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShouldFocus(true);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const windowClasses = isMinimized ? 'h-12' : 'h-[500px]';

  return (
    <div className={`fixed bottom-4 right-4 w-96 bg-[#1E293B] rounded-lg shadow-xl transition-all duration-300 overflow-hidden flex flex-col z-50 ${windowClasses}`}>
      <div 
        className="p-4 border-b border-slate-700 flex justify-between items-center cursor-pointer shrink-0 select-none"
        onClick={onMinimize}
      >
        <h3 className="font-semibold text-[#F8FAFC]">
          {userRole === 'patient' ? `Dr. ${patientName}` : patientName}
        </h3>
        {isMinimized ? (
          <BsChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <BsChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </div>

      {!isMinimized && (
        <div className="flex flex-col flex-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0 messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === currentUserId
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.sender_id === currentUserId
                      ? 'bg-[#3B82F6] text-white'
                      : 'bg-slate-700 text-slate-100'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-75 mt-1">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>

          <div className="shrink-0 border-t border-[#2D3B55] p-4" onClick={(e) => {
            e.stopPropagation();
          }}>
            <MessageInput 
              onSendMessage={handleSendMessage} 
              isLoading={isSending}
              autoFocus={shouldFocus}
            />
          </div>
        </div>
      )}
    </div>
  );
}
