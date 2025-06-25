
import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="bg-red-800 border-2 border-red-600 text-red-100 px-4 py-3 rounded-md relative shadow-lg" role="alert">
      <div className="flex items-center">
        <svg className="fill-current h-6 w-6 text-red-300 mr-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M10 0C4.486 0 0 4.486 0 10s4.486 10 10 10 10-4.486 10-10S15.514 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-.5-5h1v-7h-1v7zm0 2h1v-1h-1v1z"/>
        </svg>
        <div>
          <strong className="font-bold block">Error:</strong>
          <span className="block sm:inline">{message}</span>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 m-auto mr-1 px-3 py-2 text-red-300 hover:text-red-100 transition-colors"
          aria-label="Close error message"
        >
          <svg className="fill-current h-5 w-5" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
        </button>
      )}
    </div>
  );
};