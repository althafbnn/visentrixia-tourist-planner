import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Places', value: 'All' },
  { label: 'Religious', value: 'Religious' },
  { label: 'Nature', value: 'Nature' },
  { label: 'Heritage', value: 'Heritage' },
  { label: 'Cultural', value: 'Cultural' },
  { label: 'Culinary', value: 'Culinary' }
];

export const FilterSortBar = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
  totalResults
}) => {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search attractions by name, description, tips..."
            className="w-full pl-9 pr-9 py-2 text-sm text-stone-800 placeholder-stone-400 bg-stone-50 hover:bg-stone-100/70 focus:bg-white border border-stone-200 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 rounded-lg transition-colors outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-4 h-4 text-stone-500 shrink-0" />
          <span className="text-xs text-stone-500 font-medium whitespace-nowrap">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 focus:border-amber-700 focus:ring-1 focus:ring-amber-700 outline-none cursor-pointer"
          >
            <option value="distance">Nearest to Akkaraipattu (Distance)</option>
            <option value="name">Alphabetical (A - Z)</option>
            <option value="fee_low">Lowest Entrance Fee</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-100">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100/80 rounded-lg">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="text-xs text-stone-500 font-medium pl-1">
          Showing <span className="font-semibold text-stone-800 tabular-nums">{totalResults}</span> {totalResults === 1 ? 'place' : 'places'} within 25 km
        </div>
      </div>
    </div>
  );
};
