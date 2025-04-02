'use client';

import { useState, ReactNode } from 'react';

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 w-max max-w-sm bg-slate-800 text-white rounded-md shadow-lg p-2 text-sm -translate-x-1/2 left-1/2 bottom-full mb-2">
          {content}
          {/* Arrow */}
          <div className="absolute w-2 h-2 bg-slate-800 rotate-45 left-1/2 -translate-x-1/2 -bottom-1"></div>
        </div>
      )}
    </div>
  );
}