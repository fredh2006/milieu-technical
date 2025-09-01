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
    <div className="py-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={onAddItem}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
          >
            <Upload className="w-4 h-4" />
            Add Item
          </button>

          <div className="flex-1 relative max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm placeholder-slate-400"
            />
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          </div>

          <div className="ml-auto flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-xl border border-white/40 p-1">
            <button 
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === 'table' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              onClick={() => onViewModeChange?.('table')}
              title="Table view"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button 
              className={`p-2.5 rounded-lg transition-all duration-200 ${
                viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
              onClick={() => onViewModeChange?.('grid')}
              title="Grid view"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value as ItemStatus | 'All')}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm font-medium text-slate-700"
          >
            <option value="All">All Status</option>
            <option value="Fresh">Fresh</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>

          <select
            value={locationFilter}
            onChange={(e) => handleLocationFilterChange(e.target.value as FreezerLocation | 'All')}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 backdrop-blur-sm font-medium text-slate-700"
          >
            <option value="All">All Locations</option>
            <option value="Top Drawer">Top Drawer</option>
            <option value="Bottom Drawer">Bottom Drawer</option>
            <option value="Door">Door</option>
          </select>

          <button
            onClick={handleExpiringToggle}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border ${
              showExpiringWithin7Days
                ? 'bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border-amber-200 shadow-sm'
                : 'bg-white/70 backdrop-blur-sm text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Expiring in 7 days
            {showExpiringWithin7Days && (
              <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-amber-200 to-orange-200 text-amber-800 rounded-lg text-xs font-semibold">ON</span>
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
              className="text-sm text-slate-500 hover:text-slate-700 font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-all duration-200"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}