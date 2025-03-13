'use client';

import { useState, useRef, useEffect } from 'react';
import MessageList, { Message } from './MessageList';
import ChatInput from './ChatInput';

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Add AI response
      const aiMessage: Message = {
        role: 'assistant',
        content: data.message
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] w-full mx-auto rounded-lg bg-[#0F172A] border border-[#2D3B55]">
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
