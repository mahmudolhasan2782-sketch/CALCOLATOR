import React, { useEffect } from 'react';
import Calculator from './components/Calculator';

const App: React.FC = () => {
  // Update document title on mount
  useEffect(() => {
    document.title = "Hemontu Inco. | Scientific Calculator";
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 font-sans">
      {/* Branding Section */}
      <div className="mb-8 flex flex-col items-center animate-fade-in-down">
        {/* Logo Icon (SVG recreation of the provided Shark Fin logo) */}
        <div className="w-24 h-24 mb-3 shadow-lg rounded-2xl overflow-hidden transition-transform hover:scale-105 duration-300">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            {/* Orange Background */}
            <rect width="100" height="100" fill="#F4A261" />
            
            {/* Purple Shark Fin */}
            {/* Main fin body */}
            <path d="M25 70 Q 30 10 50 15 C 65 20, 75 50, 75 70 Z" fill="#7C3AED" />
            
            {/* Fin notch detail */}
            <path d="M30 45 L 45 50 L 30 55 Z" fill="#F4A261" />
            
            {/* Waves at the bottom */}
            <path d="M10 70 Q 20 78 30 70 T 50 70 T 70 70 T 90 70 V 85 H 10 Z" fill="#7C3AED" />
            <path d="M10 80 Q 20 88 30 80 T 50 80 T 70 80 T 90 80 V 95 H 10 Z" fill="#6D28D9" />
          </svg>
        </div>
        
        {/* Logo Text */}
        <h1 className="text-4xl font-bold text-indigo-900 tracking-wide drop-shadow-sm" style={{ fontFamily: '"Brush Script MT", "Comic Sans MS", cursive' }}>
          Hemontu Inco.
        </h1>
      </div>

      {/* Main Calculator Component */}
      <Calculator />

      {/* Footer Section */}
      <footer className="mt-8 text-center">
        <p className="text-gray-500 text-sm font-semibold tracking-wide hover:text-indigo-600 transition-colors duration-300">
          @HEMONTU INCORPORATION এর একটি সার্ভিস
        </p>
        <p className="text-xs text-gray-400 mt-2">v2.0.1 - Redesigned for Professional Use</p>
      </footer>
    </div>
  );
};

export default App;