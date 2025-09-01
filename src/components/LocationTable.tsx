import type { ItemWithStatus, FreezerLocation } from '../types';
import { format } from 'date-fns';
import { ChevronUp, Edit2, Trash2 } from 'lucide-react';
import StatusChip from './StatusChip';
import EmptyState from './EmptyState';

interface LocationTableProps {
  location: FreezerLocation;
  items: ItemWithStatus[];
  onEditItem: (item: ItemWithStatus) => void;
  onDeleteItem: (id: string) => void;
  onDeleteMultipleItems?: (ids: string[]) => void;
  onAddItem?: () => void;
  selectedIds?: string[];
  onToggleItem?: (id: string) => void;
  onToggleAll?: () => void;
  isAllSelected?: boolean;
  isPartiallySelected?: boolean;
  // Filter context for empty states
  searchTerm?: string;
  statusFilter?: string;
  locationFilter?: string;
  showExpiringWithin7Days?: boolean;
  totalItemsCount?: number;
  onClearFilters?: () => void;
}

export default function LocationTable({ 
  location, 
  items, 
  onEditItem, 
  onDeleteItem, 
  selectedIds = [],
  onToggleItem,
  onToggleAll,
  isAllSelected = false,
  isPartiallySelected = false,
  searchTerm,
  statusFilter,
  locationFilter,
  showExpiringWithin7Days,
  totalItemsCount = 0,
  onClearFilters,
  onAddItem
}: LocationTableProps) {

  const getEmptyStateType = (): string => {
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
            type={getEmptyStateType() as any}
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
      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col className="w-12" />
            <col className="w-60" />
            <col className="w-16" />
            <col className="w-24" />
            <col className="w-20" />
            <col className="w-20" />
            <col className="w-20" />
          </colgroup>
          <thead>
            <tr className="border-b border-slate-200/60 bg-gradient-to-r from-slate-100/50 via-blue-50/30 to-slate-50/40">
              <th className="text-left px-4 py-3">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={onToggleAll}
                  disabled={!onToggleAll}
                  className="rounded border-slate-400 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0"
                />
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-800 text-sm">
                Item
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-800 text-sm">
                Qty
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-800 text-sm">
                Status
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-800 text-sm">
                Added
              </th>
              <th className="text-left px-4 py-3 font-semibold text-slate-800 text-sm">
                Expires
              </th>
              <th className="text-right px-4 py-3 font-semibold text-slate-800 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/50">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-gradient-to-r hover:from-blue-50/30 hover:via-slate-50/50 hover:to-blue-50/20 transition-all duration-200 group">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleItem?.(item.id)}
                    disabled={!onToggleItem}
                    className="rounded border-slate-400 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-0"
                  />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
                    {item.notes && (
                      <div className="text-xs text-slate-600 mt-1 truncate max-w-xs" title={item.notes}>
                        {item.notes.length > 40 ? `${item.notes.substring(0, 40)}...` : item.notes}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-800 text-sm">{item.quantity}</span>
                </td>
                <td className="px-4 py-3">
                  <StatusChip status={item.status} size="xs" />
                </td>
                <td className="px-4 py-3 text-slate-700 text-xs font-medium">
                  {format(item.addedAt, 'MMM d')}
                </td>
                <td className="px-4 py-3 text-slate-700 text-xs font-medium">
                  {format(item.expiresOn, 'MMM d')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="text-slate-500 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-100/50 transition-all duration-200"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-500 hover:text-red-600 p-2 rounded-lg hover:bg-red-100/50 transition-all duration-200"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}