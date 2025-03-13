'use client';

import { FormEvent, useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  autoFocus?: boolean;
}

export default function MessageInput({ onSendMessage, isLoading, autoFocus }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setError(null);

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError('Message cannot be empty');
      return;
    }

    if (isLoading) {
      return;
    }

    try {
      onSendMessage(trimmedMessage);
      setMessage('');
      inputRef.current?.focus();
    } catch (error) {
      setError('Failed to send message');
      console.error('Error sending message:', error);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      onClick={(e) => e.stopPropagation()}
      className="relative w-full"
    >
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError(null);
            }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            disabled={isLoading}
            className={`w-full px-4 py-2 bg-slate-800 text-slate-100 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-orange-500 
              placeholder:text-slate-500
              ${error ? 'border-red-500' : 'border-transparent'}
              transition-all duration-200`}
          />
          {error && (
            <p className="absolute -bottom-6 left-0 text-xs text-red-500">
              {error}
            </p>
          )}
        </div>
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={`shrink-0 px-4 py-2 rounded-lg bg-orange-600 text-white 
            transition-colors duration-200 ${
              !message.trim() || isLoading
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-orange-700 active:bg-orange-800'
            }`}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </form>
  );
}
