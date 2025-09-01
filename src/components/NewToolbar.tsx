import { useState, useCallback } from 'react';
import type { SearchFilters, ItemStatus, FreezerLocation } from '../types';
import { Upload, Search, Filter, Tag, BarChart3, Menu, Grid, Calendar } from 'lucide-react';

interface NewToolbarProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onAddItem: () => void;
  viewMode?: 'table' | 'grid';
  onViewModeChange?: (mode: 'table' | 'grid') => void;
}

export default function NewToolbar({ onFiltersChange, onAddItem, viewMode = 'table', onViewModeChange }: NewToolbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<FreezerLocation | 'All'>('All');
  const [showExpiringWithin7Days, setShowExpiringWithin7Days] = useState(false);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    onFiltersChange({
      searchTerm: value,
      statusFilter,
      locationFilter,
      showExpiringWithin7Days
    });
  }, [onFiltersChange, statusFilter, locationFilter, showExpiringWithin7Days]);

  const handleStatusFilterChange = useCallback((value: ItemStatus | 'All') => {
    setStatusFilter(value);
    onFiltersChange({
      searchTerm,
      statusFilter: value,
      locationFilter,
      showExpiringWithin7Days
    });
  }, [onFiltersChange, searchTerm, locationFilter, showExpiringWithin7Days]);

  const handleLocationFilterChange = useCallback((value: FreezerLocation | 'All') => {
    setLocationFilter(value);
    onFiltersChange({
      searchTerm,
      statusFilter,
      locationFilter: value,
      showExpiringWithin7Days
    });
  }, [onFiltersChange, searchTerm, statusFilter, showExpiringWithin7Days]);

  const handleExpiringToggle = useCallback(() => {
    const newValue = !showExpiringWithin7Days;
    setShowExpiringWithin7Days(newValue);
    onFiltersChange({
      searchTerm,
      statusFilter,
      locationFilter,
      showExpiringWithin7Days: newValue
    });
  }, [onFiltersChange, searchTerm, statusFilter, locationFilter, showExpiringWithin7Days]);

  return (
    <div className="py-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <button
            onClick={onAddItem}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            Add Item
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search items..."
              className="w-full max-w-md pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          </div>

          <div className="ml-auto flex items-center gap-2 bg-white rounded-lg border border-gray-300 p-1">
            <button 
              className={`p-2 rounded transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => onViewModeChange?.('table')}
              title="Table view"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button 
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
              onClick={() => onViewModeChange?.('grid')}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as ItemStatus | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="All">All Status</option>
            <option value="Fresh">Fresh</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => handleLocationFilterChange(e.target.value as FreezerLocation | 'All')}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
          >
            <option value="All">All Locations</option>
            <option value="Top Drawer">Top Drawer</option>
            <option value="Bottom Drawer">Bottom Drawer</option>
            <option value="Door">Door</option>
          </select>

          <button
            onClick={handleExpiringToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
              showExpiringWithin7Days
                ? 'bg-yellow-50 text-yellow-700 border-yellow-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Expiring in 7 days
            {showExpiringWithin7Days && (
              <span className="ml-1 px-1.5 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs font-semibold">ON</span>
            )}
          </button>

          {(searchTerm || statusFilter !== 'All' || locationFilter !== 'All' || showExpiringWithin7Days) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setLocationFilter('All');
                setShowExpiringWithin7Days(false);
                onFiltersChange({
                  searchTerm: '',
                  statusFilter: 'All',
                  locationFilter: 'All',
                  showExpiringWithin7Days: false
                });
              }}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}