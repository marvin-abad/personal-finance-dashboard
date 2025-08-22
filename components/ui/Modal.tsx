

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center">
      <div className="glassmorphism rounded-lg shadow-xl w-full max-w-md m-4 relative animate-fade-in-up">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-400 hover:text-white">
          <X size={24} />
        </button>
        <div className="p-6">
            {children}
        </div>
      </div>
    </div>
  );
};

// Add keyframes for animation in index.html or a global CSS file if you had one.
// For now, it will work without animation. A simple style tag can be added to index.html for this
/*
<style>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}
</style>
*/