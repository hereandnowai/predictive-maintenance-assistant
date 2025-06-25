import React from 'react';

interface SpinnerProps {
  text?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ text = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-3 py-4" role="status" aria-live="polite">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-primary"></div>
      <p className="text-sm text-brand-primary">{text}</p>
    </div>
  );
};