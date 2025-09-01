import { format } from 'date-fns';
import type { ItemWithStatus } from '../types';
import StatusChip from './StatusChip';

interface ItemTableProps {
  items: ItemWithStatus[];
  onEditItem: (item: ItemWithStatus) => void;
  onDeleteItem: (id: string) => void;
  selectedIds?: string[];
  onToggleItem?: (id: string) => void;
  onToggleAll?: () => void;
  isAllSelected?: boolean;
  isPartiallySelected?: boolean;
}

export default function ItemTable({ 
  items, 
  onEditItem, 
  onDeleteItem,
  selectedIds = [],
  onToggleItem,
  onToggleAll,
  isAllSelected = false,
  isPartiallySelected = false
}: ItemTableProps) {
  const handleDelete = (item: ItemWithStatus) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDeleteItem(item.id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🥶</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No items found
        </h3>
        <p className="text-gray-600">
          {items.length === 0 ? 'Add your first item to start tracking your freezer inventory.' : 'Try adjusting your filters.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50/50">
              <th className="px-4 py-3 text-left">
                <div className="flex items-center space-x-1">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300" 
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isPartiallySelected;
                    }}
                    onChange={onToggleAll}
                    disabled={!onToggleAll}
                  />
                </div>
              </th>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  <span>Item Name</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 3l3 3H3l3-3zM6 9L3 6h6l-3 3z"/>
                  </svg>
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  <span>Location</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 3l3 3H3l3-3zM6 9L3 6h6l-3 3z"/>
                  </svg>
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  <span>Quantity</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 3l3 3H3l3-3zM6 9L3 6h6l-3 3z"/>
                  </svg>
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  <span>Status</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 3l3 3H3l3-3zM6 9L3 6h6l-3 3z"/>
                  </svg>
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  <span>Added</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 3l3 3H3l3-3zM6 9L3 6h6l-3 3z"/>
                  </svg>
                </button>
              </th>
              <th className="px-4 py-3 text-left">
                <button className="flex items-center space-x-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700">
                  <span>Expires</span>
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 12 12">
                    <path d="M6 3l3 3H3l3-3zM6 9L3 6h6l-3 3z"/>
                  </svg>
                </button>
              </th>
              <th className="px-4 py-3 text-right">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300" 
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleItem?.(item.id)}
                    disabled={!onToggleItem}
                  />
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    {item.notes && (
                      <div className="text-xs text-gray-500 mt-1">
                        {item.notes}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-600">{item.location}</div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-900">{item.quantity}</div>
                </td>
                <td className="px-4 py-3">
                  <StatusChip status={item.status} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-600">
                    <div>{format(item.addedAt, 'MMM dd, yyyy')}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm text-gray-600">
                    <div>{format(item.expiresOn, 'MMM dd, yyyy')}</div>
                    <div className="text-xs text-gray-400">{format(item.expiresOn, 'h:mm a')}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end space-x-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      title="Edit"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9zM4 5a2 2 0 012-2h8a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 102 0v3a1 1 0 11-2 0V9zm4 0a1 1 0 10-2 0v3a1 1 0 102 0V9z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Table Footer */}
      <div className="px-4 py-3 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              RECORDS {items.length > 0 ? '1' : '0'}-{items.length} OF {items.length}
            </span>
            <span className="text-sm text-gray-500">Show:</span>
            <select className="text-sm border border-gray-300 rounded px-2 py-1">
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}