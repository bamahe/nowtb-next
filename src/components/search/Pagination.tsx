// src/components/search/Pagination.tsx
// Page navigation for search results — shows result count, prev/next, and page X/Y
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalResults: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalResults, pageSize, onPageChange }: PaginationProps) {
  // Calculate total number of pages needed
  const totalPages = Math.ceil(totalResults / pageSize);
  // Don't render pagination if only one page
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-border">
      <p className="font-body text-xs text-muted">
        {totalResults.toLocaleString()} Properties
      </p>
      <div className="flex items-center gap-2">
        {/* Previous page button — disabled on first page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="w-8 h-8 flex items-center justify-center rounded border border-border
                     disabled:opacity-30 hover:bg-light transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        {/* Current page / total pages indicator */}
        <span className="font-body text-sm text-primary font-medium">
          {currentPage} / {totalPages}
        </span>
        {/* Next page button — disabled on last page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded border border-border
                     disabled:opacity-30 hover:bg-light transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
