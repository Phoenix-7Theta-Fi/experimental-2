'use client';

import { FormEvent, useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-[#2D3B55]">
      <div className="flex space-x-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1 p-2 bg-[#1E293B] border border-[#2D3B55] rounded-lg text-[#F8FAFC] placeholder-[#64748B] focus:outline-none focus:border-[#3B82F6]"
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`px-4 py-2 rounded-lg bg-[#3B82F6] text-white ${
            (!message.trim() || isLoading)
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:bg-[#2563EB] transition-colors'
          }`}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
}
