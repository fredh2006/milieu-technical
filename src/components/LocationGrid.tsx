import type { ItemWithStatus, FreezerLocation } from '../types';
import { format } from 'date-fns';
import { Edit2, Trash2, Calendar, Package } from 'lucide-react';
import StatusChip from './StatusChip';
import EmptyState from './EmptyState';
import Pagination from './ui/Pagination';
import { usePagination } from '../hooks/usePagination';

interface LocationGridProps {
  location: FreezerLocation;
  items: ItemWithStatus[];
  onEditItem: (item: ItemWithStatus) => void;
  onDeleteItem: (id: string) => void;
  onAddItem?: () => void;
  // Filter context for empty states
  searchTerm?: string;
  statusFilter?: string;
  locationFilter?: string;
  showExpiringWithin7Days?: boolean;
  totalItemsCount?: number;
  onClearFilters?: () => void;
}

export default function LocationGrid({ 
  location, 
  items, 
  onEditItem, 
  onDeleteItem,
  onAddItem,
  searchTerm,
  statusFilter,
  locationFilter,
  showExpiringWithin7Days,
  totalItemsCount = 0,
  onClearFilters
}: LocationGridProps) {
  const pagination = usePagination(items, { itemsPerPage: 5 });

  const getEmptyStateType = (): 'no-items' | 'no-results' | 'filter-empty' | 'location-empty' | 'search-only' | 'status-filter' | 'date-filter' => {
    // If there are no items in the entire freezer
    if (totalItemsCount === 0) {
      return 'no-items';
    }
    
    // If there are items in freezer but none in this location and no filters applied
    if (!searchTerm && (!statusFilter || statusFilter === 'All') && (!locationFilter || locationFilter === 'All') && !showExpiringWithin7Days) {
      return 'location-empty';
    }
    
    // If only search is applied
    if (searchTerm && (!statusFilter || statusFilter === 'All') && (!locationFilter || locationFilter === 'All') && !showExpiringWithin7Days) {
      return 'search-only';
    }
    
    // If only status filter is applied
    if (!searchTerm && statusFilter && statusFilter !== 'All' && (!locationFilter || locationFilter === 'All') && !showExpiringWithin7Days) {
      return 'status-filter';
    }
    
    // If only date filter is applied
    if (!searchTerm && (!statusFilter || statusFilter === 'All') && (!locationFilter || locationFilter === 'All') && showExpiringWithin7Days) {
      return 'date-filter';
    }
    
    // If a specific location is filtered BUT there are other filters active (status, search, date)
    // This means the location has items, but none match the other criteria
    if (locationFilter && locationFilter !== 'All' && locationFilter === location && 
        (searchTerm || (statusFilter && statusFilter !== 'All') || showExpiringWithin7Days)) {
      return 'no-results';
    }
    
    // If a specific location is filtered and it's truly empty (no other filters)
    if (locationFilter && locationFilter !== 'All' && locationFilter === location) {
      return 'location-empty';
    }
    
    // Multiple filters or complex combinations
    return 'no-results';
  };

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/90 via-slate-50/40 to-blue-50/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-500">
        <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-slate-100/60 via-white/50 to-blue-50/40 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent tracking-tight">{location}</h3>
            <span className="text-sm text-slate-600 bg-gradient-to-r from-slate-200/80 to-slate-100/60 px-3 py-1.5 rounded-full font-bold border border-slate-300/30 shadow-sm">0 items</span>
          </div>
        </div>
        <div className="p-4">
          <EmptyState
            type={getEmptyStateType()}
            location={location}
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            locationFilter={locationFilter}
            showExpiringWithin7Days={showExpiringWithin7Days}
            totalItemsCount={totalItemsCount}
            onAction={onClearFilters}
            onAddItem={onAddItem}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white/90 via-slate-50/40 to-blue-50/20 backdrop-blur-xl rounded-3xl shadow-xl border border-white/40 overflow-hidden hover:shadow-2xl transition-all duration-500">
      <div className="px-6 py-4 border-b border-slate-200/60 bg-gradient-to-r from-slate-100/60 via-white/50 to-blue-50/40 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent tracking-tight">{location}</h3>
          <span className="text-sm text-slate-600 bg-gradient-to-r from-slate-200/80 to-slate-100/60 px-3 py-1.5 rounded-full font-bold border border-slate-300/30 shadow-sm">{items.length} items</span>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {pagination.paginatedItems.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-white/80 via-slate-50/60 to-blue-50/40 backdrop-blur-xl rounded-xl p-4 hover:shadow-lg transition-all duration-200 border border-gray-300/60 group hover:scale-[1.01]">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-slate-900 text-sm leading-tight pr-2">{item.name}</h4>
                <StatusChip status={item.status} size="xs" />
              </div>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Package className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-medium">Qty: {item.quantity}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span className="font-medium">Expires: {format(item.expiresOn, 'MMM d')}</span>
                </div>
              </div>

              {item.notes && (
                <div className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed bg-slate-100/50 rounded-lg p-2 border border-slate-200/40" title={item.notes}>
                  {item.notes.length > 50 ? `${item.notes.substring(0, 50)}...` : item.notes}
                </div>
              )}

              <div className="flex gap-1 justify-end pt-2 border-t border-slate-200/40">
                <button
                  onClick={() => onEditItem(item)}
                  className="text-slate-500 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-100/60 transition-all duration-200"
                  title="Edit"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-slate-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-100/60 transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onNextPage={pagination.nextPage}
        onPreviousPage={pagination.previousPage}
        onGoToPage={pagination.goToPage}
        hasNextPage={pagination.hasNextPage}
        hasPreviousPage={pagination.hasPreviousPage}
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={items.length}
      />
    </div>
  );
}