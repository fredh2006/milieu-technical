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
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20">
        <div className="px-6 py-4 border-b border-slate-200/50">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{location}</h3>
        </div>
        <div className="p-12">
          <div className="text-center">
            <div className="text-4xl mb-4 opacity-50">🥶</div>
            <p className="text-slate-500 font-medium">No items in {location}</p>
            <p className="text-xs text-slate-400 mt-1">Add your first item to get started</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-300/40 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-300/60 bg-gradient-to-r from-slate-50/50 to-white/50">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{location}</h3>
          <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">{items.length} items</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-300/60 bg-slate-50/50">
              <th className="text-left px-4 py-4 w-12">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={onToggleAll}
                  disabled={!onToggleAll}
                  className="rounded-md border-slate-300 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                />
              </th>
              <th className="text-left px-4 py-4 font-semibold text-slate-700 text-sm">
                <div className="flex items-center gap-2">
                  Item
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                </div>
              </th>
              <th className="text-left px-4 py-4 font-semibold text-slate-700 text-sm">
                Qty
              </th>
              <th className="text-left px-4 py-4 font-semibold text-slate-700 text-sm">
                Status
              </th>
              <th className="text-left px-4 py-4 font-semibold text-slate-700 text-sm">
                Added
              </th>
              <th className="text-left px-4 py-4 font-semibold text-slate-700 text-sm">
                <div className="flex items-center gap-2">
                  Expires
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                </div>
              </th>
              <th className="text-right px-4 py-4 font-semibold text-slate-700 text-sm">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300/40">
            {items.map((item, index) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors duration-150">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleItem?.(item.id)}
                    disabled={!onToggleItem}
                    className="rounded-md border-slate-300 w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                </td>
                <td className="px-4 py-4">
                  <div>
                    <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
                    {item.notes && (
                      <div className="text-xs text-slate-500 mt-1 truncate max-w-xs" title={item.notes}>
                        {item.notes.length > 50 ? `${item.notes.substring(0, 50)}...` : item.notes}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="font-medium text-slate-700">{item.quantity}</span>
                </td>
                <td className="px-4 py-4">
                  <StatusChip status={item.status} size="xs" />
                </td>
                <td className="px-4 py-4 text-slate-600 text-sm font-medium">
                  {format(item.addedAt, 'MMM d')}
                </td>
                <td className="px-4 py-4 text-slate-600 text-sm font-medium">
                  {format(item.expiresOn, 'MMM d')}
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEditItem(item)}
                      className="text-slate-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-all duration-200"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      className="text-slate-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-all duration-200"
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