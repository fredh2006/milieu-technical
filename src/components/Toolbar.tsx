import { useState, useEffect } from 'react';
import type { SearchFilters, ItemStatus, FreezerLocation } from '../types';
import { ITEM_STATUSES, FREEZER_LOCATIONS, SEARCH_DEBOUNCE_MS } from '../lib/constants';
import { useDebounce } from '../hooks/useDebounce';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

interface ToolbarProps {
  onFiltersChange: (filters: SearchFilters) => void;
  onAddItem: () => void;
  totalItems: number;
  filteredCount: number;
}

export default function Toolbar({ 
  onFiltersChange, 
  onAddItem, 
  totalItems, 
  filteredCount 
}: ToolbarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItemStatus | 'All'>('All');
  const [locationFilter, setLocationFilter] = useState<FreezerLocation | 'All'>('All');
  const [showExpiringWithin7Days, setShowExpiringWithin7Days] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, SEARCH_DEBOUNCE_MS);

  // Update filters when debounced search or other filters change
  useEffect(() => {
    onFiltersChange({
      searchTerm: debouncedSearchTerm,
      statusFilter,
      locationFilter,
      showExpiringWithin7Days
    });
  }, [debouncedSearchTerm, statusFilter, locationFilter, showExpiringWithin7Days, onFiltersChange]);

  const statusOptions = [
    { value: 'All', label: 'All Status' },
    ...ITEM_STATUSES.map(status => ({
      value: status,
      label: status
    }))
  ];

  const locationOptions = [
    { value: 'All', label: 'All Locations' },
    ...FREEZER_LOCATIONS.map(location => ({
      value: location,
      label: location
    }))
  ];

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setLocationFilter('All');
    setShowExpiringWithin7Days(false);
  };

  const hasActiveFilters = 
    debouncedSearchTerm || 
    statusFilter !== 'All' || 
    locationFilter !== 'All' || 
    showExpiringWithin7Days;

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Top Toolbar */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onAddItem} className="bg-blue-600 hover:bg-blue-700">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
              </svg>
              Add Item
            </Button>
            
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
              </svg>
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd"/>
              </svg>
              <span>Filters</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
              </svg>
              <span>Tags</span>
            </button>
            
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
              </svg>
              <span>Stats</span>
            </button>
            
            <div className="flex border border-gray-300 rounded-md">
              <button className="px-3 py-2 text-sm bg-blue-50 text-blue-600 border-r border-gray-300 rounded-l-md">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
                </svg>
              </button>
              <button className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-r-md">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Row */}
      {hasActiveFilters && (
        <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Filters:</span>
            {statusFilter !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                Status: {statusFilter}
                <button onClick={() => setStatusFilter('All')} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
              </span>
            )}
            {locationFilter !== 'All' && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                Location: {locationFilter}
                <button onClick={() => setLocationFilter('All')} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
              </span>
            )}
            {showExpiringWithin7Days && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs">
                Expiring within 7 days
                <button onClick={() => setShowExpiringWithin7Days(false)} className="ml-1 text-blue-600 hover:text-blue-800">×</button>
              </span>
            )}
            <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-800">Clear all</button>
          </div>
        </div>
      )}
    </div>
  );
}