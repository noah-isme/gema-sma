"use client";

import { Search, Filter, Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: Array<{ value: string; label: string }>;
  filterLabel?: string;
  actionButton?: {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
  };
}

export default function FilterBar({
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterLabel = 'Filter',
  actionButton
}: FilterBarProps) {
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        {onSearchChange && (
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {/* Filter Dropdown */}
        {onFilterChange && filterOptions.length > 0 && (
          <div className="flex items-center gap-2 min-w-[200px]">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterValue}
              onChange={(e) => onFilterChange(e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* Action Button */}
        {actionButton && (
          <button
            onClick={actionButton.onClick}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap"
          >
            {actionButton.icon || <Plus className="w-4 h-4" />}
            {actionButton.label}
          </button>
        )}
      </div>
    </div>
  );
}
