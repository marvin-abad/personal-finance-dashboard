import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null;
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-between mt-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} className="mr-1" />
        Previous
      </button>
      <span className="text-sm text-slate-400">
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 text-sm font-medium text-slate-300 bg-slate-700/50 rounded-md hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight size={16} className="ml-1" />
      </button>
    </div>
  );
};
