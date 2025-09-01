import { format } from 'date-fns';
import type { ItemWithStatus } from '../types';
import StatusChip from './StatusChip';

interface ItemCardProps {
  item: ItemWithStatus;
  onEdit: (item: ItemWithStatus) => void;
  onDelete: (id: string) => void;
}

export default function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDelete(item.id);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-white/20 shadow-sm p-6 space-y-4 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-slate-900 truncate text-lg group-hover:text-slate-700 transition-colors">
            {item.name}
          </h3>
          <p className="text-sm text-slate-600 mt-1 font-medium">
            Quantity: {item.quantity}
          </p>
        </div>
        <StatusChip status={item.status} size="sm" />
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Expires:</span>
          <span className={`font-semibold ${item.status === 'Expired' ? 'text-rose-600' : 'text-slate-700'}`}>
            {format(item.expiresOn, 'MMM dd, yyyy')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-500 font-medium">Added:</span>
          <span className="text-slate-700 font-semibold">{format(item.addedAt, 'MMM dd, yyyy')}</span>
        </div>
      </div>

      {item.notes && (
        <div className="pt-3 border-t border-slate-200/50">
          <p className="text-sm text-slate-600 italic leading-relaxed">
            {item.notes}
          </p>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
        <button
          onClick={() => onEdit(item)}
          className="flex-1 bg-gradient-to-r from-slate-50 to-slate-100 hover:from-blue-50 hover:to-blue-100 text-slate-700 hover:text-blue-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 border border-slate-200 hover:border-blue-200"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 bg-gradient-to-r from-rose-50 to-red-50 hover:from-red-500 hover:to-red-600 text-rose-700 hover:text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 border border-rose-200 hover:border-red-500"
        >
          Delete
        </button>
      </div>
    </div>
  );
}