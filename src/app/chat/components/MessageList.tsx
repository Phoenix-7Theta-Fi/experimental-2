import TypingIndicator from './TypingIndicator';
import { ProductCard } from '@/components/shop/product-card';
import { Product } from '@/lib/types';
import { RefObject } from 'react';
import AssessmentQuestion from './assessment/AssessmentQuestion';
import AssessmentReport from './assessment/AssessmentReport';

export type MessageContent = {
  type: 'text';
  content: string;
} | {
  type: 'product_recommendation';
  content: {
    products: Product[];
    context: string;
  };
} | {
  type: 'health_assessment';
  step: number;
  totalSteps: number;
  question?: {
    id?: number;
    question: string;
    options: string[];
    context?: string;
  };
  isComplete: boolean;
  report?: {
    summary: string;
    recommendations: string[];
    riskFactors: string[];
  };
};

export type Message = {
  role: 'user' | 'assistant';
  content: string | MessageContent;
};

interface MessageListProps {
  messages: Message[];
  isLoading?: boolean;
  containerRef: RefObject<HTMLDivElement>;
  onScroll: () => void;
  onSendMessage: (message: string) => Promise<void>;
}

export default function MessageList({ 
  messages, 
  isLoading, 
  containerRef, 
  onScroll,
  onSendMessage
}: MessageListProps) {
  console.log('MessageList rendering:', {
    messageCount: messages.length,
    lastMessage: messages[messages.length - 1],
    isLoading
  });

  return (
    <div 
      ref={containerRef}
      onScroll={onScroll}
      className="flex-1 overflow-y-auto p-4 space-y-4"
    >
      {messages.map((message, index) => {
        console.log('Rendering message:', { index, message });
        return (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-[#3B82F6] text-white'
                  : 'bg-[#1E293B] text-[#F8FAFC] border border-[#2D3B55]'
              }`}
            >
              {typeof message.content === 'string' ? (
                <p className="whitespace-pre-wrap">
                  {message.content}
                  {index === messages.length - 1 && message.role === 'assistant' && !message.content && isLoading && (
                    <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse" />
                  )}
                </p>
              ) : message.content.type === 'product_recommendation' ? (
                <div className="space-y-4">
                  {message.content?.content?.context && (
                    <p className="whitespace-pre-wrap">{message.content.content.context}</p>
                  )}
                  <div className="grid grid-cols-1 gap-4">
                    {message.content?.content?.products?.length > 0 ? (
                      message.content.content.products.map((product) => (
                        <ProductCard 
                          key={product.id}
                          product={product}
                          onAddToCart={async (productId) => {
                            try {
                              const response = await fetch('/api/cart', {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ productId, quantity: 1 }),
                              });
                              if (!response.ok) throw new Error('Failed to add to cart');
                            } catch (error) {
                              console.error('Error adding to cart:', error);
                            }
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-gray-400">
                        No relevant products found. Try being more specific about what you're looking for.
                      </p>
                    )}
                  </div>
                </div>
              ) : message.content.type === 'health_assessment' ? (
                <div>
                  {message.content.isComplete ? (
                    message.content.report && (
                      <AssessmentReport report={message.content.report} />
                    )
                  ) : (
                    message.content.question && (
                      <AssessmentQuestion
                        step={message.content.step}
                        totalSteps={message.content.totalSteps}
                        question={message.content.question}
                        onSubmit={async (answer) => {
                          console.log('Assessment answer submitted:', answer);
                          await onSendMessage(answer);
                        }}
                      />
                    )
                  )}
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content.content}</p>
              )}
            </div>
          </div>
        );
      })}
      {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
        <TypingIndicator />
      )}
    </div>
  );
}
