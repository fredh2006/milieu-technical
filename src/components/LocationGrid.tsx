import type { ItemWithStatus, FreezerLocation } from '../types';
import { format } from 'date-fns';
import { Edit2, Trash2, Calendar, Package } from 'lucide-react';
import StatusChip from './StatusChip';

interface LocationGridProps {
  location: FreezerLocation;
  items: ItemWithStatus[];
  onEditItem: (item: ItemWithStatus) => void;
  onDeleteItem: (id: string) => void;
  onAddItem?: () => void;
}

export default function LocationGrid({ location, items, onEditItem, onDeleteItem }: LocationGridProps) {
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
      <div className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                <StatusChip status={item.status} size="xs" />
              </div>
              
              <div className="space-y-1 mb-3">
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Package className="w-3 h-3" />
                  <span>Qty: {item.quantity}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <Calendar className="w-3 h-3" />
                  <span>Expires: {format(item.expiresOn, 'MMM d')}</span>
                </div>
              </div>

              {item.notes && (
                <div className="text-xs text-gray-500 italic mb-3 line-clamp-2" title={item.notes}>
                  {item.notes.length > 60 ? `${item.notes.substring(0, 60)}...` : item.notes}
                </div>
              )}

              <div className="flex gap-2 justify-end">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}