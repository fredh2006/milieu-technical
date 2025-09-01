import type { ItemWithStatus, FreezerLocation } from '../types';
import { format } from 'date-fns';
import { ChevronUp, Edit2, Trash2 } from 'lucide-react';
import StatusChip from './StatusChip';

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
  isPartiallySelected = false
}: LocationTableProps) {

  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">{location}</h3>
        </div>
        <div className="p-8">
          <p className="text-center text-sm text-gray-500">No items in {location}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{location}</h3>
          <span className="text-xs text-gray-500">{items.length} items</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left px-3 py-2 w-8">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={onToggleAll}
                  disabled={!onToggleAll}
                  className="rounded border-gray-300 w-3.5 h-3.5"
                />
              </th>
              <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Item
                  <ChevronUp className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Qty
              </th>
              <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Status
              </th>
              <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Added
              </th>
              <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                <div className="flex items-center gap-1">
                  Expires
                  <ChevronUp className="w-3 h-3" />
                </div>
              </th>
              <th className="text-left px-3 py-2 font-medium text-gray-500 text-xs uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-3 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleItem?.(item.id)}
                    disabled={!onToggleItem}
                    className="rounded border-gray-300 w-3.5 h-3.5"
                  />
                </td>
                <td className="px-3 py-2">
                  <span className="font-medium text-gray-900 text-sm">{item.name}</span>
                  {item.notes && (
                    <div className="text-xs text-gray-500 italic mt-0.5 truncate max-w-xs" title={item.notes}>
                      {item.notes.length > 50 ? `${item.notes.substring(0, 50)}...` : item.notes}
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-gray-600 text-sm">{item.quantity}</td>
                <td className="px-3 py-2">
                  <StatusChip status={item.status} size="xs" />
                </td>
                <td className="px-3 py-2 text-gray-600 text-sm">
                  {format(item.addedAt, 'MMM d')}
                </td>
                <td className="px-3 py-2 text-gray-600 text-sm">
                  {format(item.expiresOn, 'MMM d')}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="text-gray-600 hover:text-gray-800 p-1"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-red-600 hover:text-red-800 p-1"
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