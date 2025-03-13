'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ScheduleActivity } from '@/lib/types/health';
import { Message } from '@/app/chat/components/MessageList';
import { ActivityLogResponse } from '@/lib/tools/activity-logger';
import TypingIndicator from '@/app/chat/components/TypingIndicator';

interface ActivityLoggerSheetProps {
  scheduleId: number;
  isOpen: boolean;
  onClose: () => void;
  activity: ScheduleActivity;
  onComplete: (activityId: number) => void;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  report?: {
    summary: string;
    insights: string[];
    effectiveness: number;
    recommendations: string[];
  };
}

export default function ActivityLoggerSheet({ scheduleId, isOpen, onClose, activity, onComplete }: ActivityLoggerSheetProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  
  // Use a stable ID based on activity
  const sessionId = `activity-${activity.id}`;

  const headers = {
    'Content-Type': 'application/json',
    'X-Session-ID': sessionId,
    'X-Request-Time': new Date().toISOString()
  };

  // Protect against rapid re-renders
  const [isInitializing, setIsInitializing] = useState(false);

  // Error handling utility
  const handleError = (error: any, fallbackMessage: string) => {
    console.error('Activity Logger Error:', {
      error,
      sessionId,
      activityId: activity.id,
      stack: error.stack
    });
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: fallbackMessage
    }]);
  };

  // Initialize session when sheet opens
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (isOpen && !hasStarted && !isInitializing) {
        setIsInitializing(true);
        console.log('🔵 Opening activity log sheet:', { activity, sessionId });
        
        try {
          await startActivityLogging();
          if (mounted) {
            setHasStarted(true);
          }
        } catch (error) {
          console.error('Failed to start session:', error);
        } finally {
          if (mounted) {
            setIsInitializing(false);
          }
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
    };
  }, [isOpen, hasStarted, isInitializing, activity.id]);

  // Handle cleanup when sheet closes
  useEffect(() => {
    if (!isOpen && hasStarted) {
      console.log('🔵 Closing activity log sheet, cleaning up:', { sessionId });
      
      const cleanup = async () => {
        try {
          await fetch('/api/activity-log', {
            method: 'POST',
            headers,
            body: JSON.stringify({
              action: 'end'
            })
          });
          setHasStarted(false);
          setMessages([]);
        } catch (error) {
          console.error('Failed to cleanup session:', error);
        }
      };

      cleanup();
    }
  }, [isOpen, hasStarted]);

  const startActivityLogging = async () => {
    if (!activity?.id) {
      handleError(new Error('Invalid activity data'), 'Unable to start activity logging due to missing data');
      return;
    }

    console.log('🔵 Starting activity log session:', { sessionId, activity });
    setIsLoading(true);
    try {
      const response = await fetch('/api/activity-log', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'start',
          activityId: activity.id,
          activityType: activity.type
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to start logging:', { status: response.status, error: errorText });
        throw new Error(`Failed to start activity logging: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Activity log session started:', { sessionId, response: data });
      
      setMessages([{
        role: 'assistant',
        content: data.message,
      }]);
    } catch (error) {
      console.error('❌ Error starting activity log:', error);
      setMessages([{
        role: 'assistant',
        content: 'Sorry, I had trouble starting our conversation. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    console.log('🔵 Sending message:', { sessionId, message: userMessage });
    
    setInputMessage('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/activity-log', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          action: 'chat',
          message: userMessage
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to get chat response:', { status: response.status, error: errorText });
        throw new Error(`Chat error: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Received chat response:', { sessionId, response: data });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        report: data.report
      }]);

      if (data.isComplete) {
        console.log('🔵 Session complete, updating activity status:', { sessionId, activityId: activity.id });
        
        try {
          // First update activity status in backend
          const updateResponse = await fetch('/api/daily-schedule', {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
              scheduleId,
              activityId: activity.id,
              updates: {
                completed: true,
                activityLog: {
                  notes: data.report?.summary,
                  insights: data.report?.insights,
                  effectiveness: data.report?.effectiveness,
                  recommendations: data.report?.recommendations,
                  completedAt: new Date().toISOString()
                }
              }
            })
          });

          if (!updateResponse.ok) {
            throw new Error(await updateResponse.text());
          }

          console.log('✅ Activity status updated in backend');
          
          // Then immediately update parent component state
          onComplete(activity.id);
          console.log('✅ Parent component state updated');

          // Finally close the sheet after a delay
          setTimeout(() => {
            onClose();
            console.log('✅ Activity logger sheet closed');
          }, 1500); // Give user time to see the final message
        } catch (error) {
          console.error('Failed to update activity:', error);
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: 'There was an error updating your activity status. Please try again.',
          }]);
        }
      }
    } catch (error) {
      console.error('❌ Error in activity logging:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-96 bg-gray-900 border-l border-gray-800 shadow-xl 
                  transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                  }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-100">{activity.title}</h3>
          <p className="text-sm text-gray-400">{activity.type}</p>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          <XMarkIcon className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 h-[calc(100vh-12rem)]">
        {messages.map((message, idx) => (
          <div
            key={idx}
            className={`flex ${
              message.role === 'assistant' ? 'justify-start' : 'justify-end'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'assistant'
                  ? 'bg-gray-800 text-gray-100'
                  : 'bg-primary/20 text-primary-foreground'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              {message.report && (
                <div className="mt-4 space-y-4 border-t border-gray-700 pt-4">
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Summary</h4>
                    <p className="text-sm text-gray-300">{message.report.summary}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Key Insights</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {message.report.insights.map((insight: string, i: number) => (
                        <li key={i} className="text-sm text-gray-300">{insight}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Effectiveness</h4>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-gray-700 rounded-full">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${message.report.effectiveness}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-300">
                        {message.report.effectiveness}%
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-primary mb-2">Recommendations</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {message.report.recommendations.map((rec: string, i: number) => (
                        <li key={i} className="text-sm text-gray-300">{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-3 bg-gray-800">
              <TypingIndicator />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-800 p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your response..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 
                     text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 
                     focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
