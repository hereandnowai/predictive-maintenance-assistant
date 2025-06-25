import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-black text-white shadow-lg border-b-4 border-brand-primary">
      <div className="container mx-auto px-4 py-4 sm:py-5"> {/* Slightly reduced padding for better logo fit */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <img 
              src="https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/HNAI%20Title%20-Teal%20%26%20Golden%20Logo%20-%20DESIGN%203%20-%20Raj-07.png" 
              alt="HERE AND NOW AI Logo" 
              className="h-16 sm:h-20 md:h-24 object-contain mx-auto sm:mx-0" // Increased height, object-contain
            />
            <p className="text-sm text-slate-300 mt-1 sm:mt-2 uppercase tracking-wider">
              Predictive Maintenance Assistant
            </p>
          </div>
          <div className="text-center sm:text-right">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 sm:h-16 sm:w-16 inline-block text-brand-primary" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};