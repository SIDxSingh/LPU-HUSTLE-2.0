import React from 'react';
import { Search, Filter, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { SEMESTERS, RESOURCE_TYPES } from '../../utils/constants';

export const ResourceFilters = ({
  filters,
  onChange,
  onReset,
  totalCount,
}) => {
  const handleInputChange = (field, value) => {
    onChange({ ...filters, [field]: value, page: 1 });
  };

  const isFiltered =
    Boolean(filters.search) ||
    filters.semester !== 'all' ||
    filters.type !== 'all' ||
    filters.sort !== 'newest';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4 mb-6">
      {/* Top row: Search and Sort */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            id="resource-search-input"
            value={filters.search || ''}
            onChange={(e) => handleInputChange('search', e.target.value)}
            placeholder="Search by subject code, topic, or title (e.g., DBMS, DSA, CSE316)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm border border-slate-200 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition"
          />
          {filters.search && (
            <button
              onClick={() => handleInputChange('search', '')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-1.5 py-0.5 rounded"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-slate-500 hidden lg:inline">Sort:</span>
          <select
            id="resource-sort-select"
            value={filters.sort || 'newest'}
            onChange={(e) => handleInputChange('sort', e.target.value)}
            className="py-2.5 px-3 rounded-xl text-sm font-medium border border-slate-200 bg-slate-50 hover:bg-white focus:outline-none focus:border-brand-500 transition text-slate-700 cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="title">Alphabetical (A-Z)</option>
          </select>

          {isFiltered && (
            <button
              onClick={onReset}
              id="resource-reset-filters-btn"
              title="Reset all filters"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition flex items-center gap-1.5 text-xs font-semibold"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Second row: Filter Tabs for Type and Semester */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
        {/* Semester pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          <span className="text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Semester:
          </span>
          <button
            id="filter-sem-all"
            onClick={() => handleInputChange('semester', 'all')}
            className={`px-3 py-1.5 rounded-lg shrink-0 transition ${
              filters.semester === 'all'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {SEMESTERS.map((sem) => (
            <button
              key={sem}
              id={`filter-sem-${sem}`}
              onClick={() => handleInputChange('semester', sem.toString())}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition ${
                filters.semester === sem.toString()
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>

        {/* Type pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold">
          <span className="text-slate-400 mr-1 shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Type:
          </span>
          <button
            id="filter-type-all"
            onClick={() => handleInputChange('type', 'all')}
            className={`px-3 py-1.5 rounded-lg shrink-0 transition ${
              filters.type === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Types
          </button>
          {RESOURCE_TYPES.map((type) => (
            <button
              key={type}
              id={`filter-type-${type.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => handleInputChange('type', type)}
              className={`px-3 py-1.5 rounded-lg shrink-0 transition ${
                filters.type === type
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
