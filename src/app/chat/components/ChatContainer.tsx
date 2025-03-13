'use client';

import { useState, useRef, useEffect } from 'react';
import MessageList, { Message, MessageContent } from './MessageList';
import ChatInput from './ChatInput';

export default function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const [sessionId, setSessionId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'default';
    const existingId = window.sessionStorage.getItem('assessmentSessionId');
    if (existingId) return existingId;
    
    const newId = Math.random().toString(36).substring(7);
    window.sessionStorage.setItem('assessmentSessionId', newId);
    return newId;
  });
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const decoder = new TextDecoder();

  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (container) {
    const isScrolledToBottom = 
        container.scrollHeight - container.scrollTop <= container.clientHeight + 150;
      setShouldAutoScroll(isScrolledToBottom);
    }
  };

  useEffect(() => {
    if (shouldAutoScroll && messageContainerRef.current) {
      const container = messageContainerRef.current;
      container.scrollTo({
        top: container.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, shouldAutoScroll]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: message
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setShouldAutoScroll(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      // Add initial AI message
      const aiMessageIndex = messages.length + 1;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: ''
      }]);

      // Check if response is JSON
      const contentType = response.headers.get('Content-Type');
      if (contentType?.includes('application/json')) {
        const jsonResponse = await response.json();
        console.log('Received response:', jsonResponse); // Debug log
        
        // Remove the empty initial message and add the response
        setMessages(prev => {
          const lastMessage: Message = {
            role: 'assistant' as const,
            content: jsonResponse.type === 'health_assessment' ? {
              type: 'health_assessment',
              step: jsonResponse.step,
              totalSteps: jsonResponse.totalSteps,
              question: jsonResponse.question,
              isComplete: jsonResponse.isComplete,
              report: jsonResponse.report
            } : jsonResponse
          };
          console.log('Formatted message:', lastMessage);
          return [...prev.slice(0, -1), lastMessage];
        });
        setShouldAutoScroll(true);
      } else {
        // Setup streaming for text responses
        const reader = response.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          // Handle streaming text responses
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim());
          
          for (const line of lines) {
            try {
              const parsed = JSON.parse(line);
              
              // Update messages based on the message type
              setMessages(prev => {
                const newMessages = [...prev];
                const currentMessage = newMessages[aiMessageIndex];
                
                if (currentMessage) {
                  // If this is the first content for this message, set it directly
                  if (!currentMessage.content) {
                    currentMessage.content = parsed;
                  } else if (typeof currentMessage.content === 'string') {
                    // If we already have a string content, append new text content
                    if (parsed.type === 'text') {
                      currentMessage.content += parsed.content;
                    } else {
                      // If we get a product recommendation after text, create a new message
                      newMessages.push({
                        role: 'assistant',
                        content: parsed
                      });
                    }
                  } else if (parsed.type === 'text') {
                    // If we have a non-string content and get text, create a new message
                    newMessages.push({
                      role: 'assistant',
                      content: parsed.content
                    });
                  }
                }
                return newMessages;
              });
            } catch (error) {
              console.error('Error parsing chunk:', error);
            }
          }
          // Enable auto-scroll while streaming
          setShouldAutoScroll(true);
        }
      }

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
    <div className="flex flex-col h-[calc(100vh-6rem)] w-full max-w-4xl mx-auto rounded-lg bg-[#0F172A] border border-[#2D3B55]">
      <div className="flex-1 overflow-hidden flex flex-col">
        <MessageList 
          messages={messages} 
          isLoading={isLoading}
          containerRef={messageContainerRef}
          onScroll={handleScroll}
          onSendMessage={handleSendMessage}
        />
      </div>
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
