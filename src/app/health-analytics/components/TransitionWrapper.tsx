'use client';

import { useEffect, useState } from 'react';

interface TransitionWrapperProps {
  children: React.ReactNode;
  show: boolean;
}

export default function TransitionWrapper({ children, show }: TransitionWrapperProps) {
  const [shouldRender, setShouldRender] = useState(show);

  useEffect(() => {
    if (show) setShouldRender(true);
  }, [show]);

  const onAnimationEnd = () => {
    if (!show) setShouldRender(false);
  };

  return shouldRender ? (
    <div
      className={`transition-opacity duration-300 ease-in-out ${
        show ? 'opacity-100' : 'opacity-0'
      }`}
      onTransitionEnd={onAnimationEnd}
    >
      {children}
    </div>
  ) : null;
}
