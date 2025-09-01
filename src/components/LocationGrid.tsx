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
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-300/40">
        <div className="px-6 py-4 border-b border-slate-300/60">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">{location}</h3>
        </div>
        <div className="p-12">
          <div className="text-center">
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
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {items.map((item) => (
            <div key={item.id} className="bg-gradient-to-br from-white/60 to-slate-50/60 backdrop-blur-sm rounded-xl p-5 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 border border-slate-300/60 hover:border-slate-400/70 group">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-slate-900 text-sm leading-tight pr-2">{item.name}</h4>
                <StatusChip status={item.status} size="xs" />
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Package className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">Qty: {item.quantity}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium">Expires: {format(item.expiresOn, 'MMM d')}</span>
                </div>
              </div>

              {item.notes && (
                <div className="text-xs text-slate-500 italic mb-4 line-clamp-2 leading-relaxed" title={item.notes}>
                  {item.notes.length > 60 ? `${item.notes.substring(0, 60)}...` : item.notes}
                </div>
              )}

              <div className="flex gap-2 justify-end pt-2 border-t border-slate-300/40">
                <button
                  onClick={() => onEditItem(item)}
                  className="text-slate-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-all duration-200"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all duration-200"
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