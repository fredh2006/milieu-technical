import { format } from 'date-fns';
import type { ItemWithStatus } from '../types';
import StatusChip from './StatusChip';
import Button from './ui/Button';

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
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 truncate">
            {item.name}
          </h3>
          <p className="text-sm text-gray-500">
            Quantity: {item.quantity}
          </p>
        </div>
        <StatusChip status={item.status} size="sm" />
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Expires:</span>
          <span className={item.status === 'Expired' ? 'text-red-600 font-medium' : ''}>
            {format(item.expiresOn, 'MMM dd, yyyy')}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Added:</span>
          <span>{format(item.addedAt, 'MMM dd, yyyy')}</span>
        </div>
      </div>

      {item.notes && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-sm text-gray-600 italic">
            {item.notes}
          </p>
        </div>
      )}

      <div className="flex space-x-2 pt-2">
        <Button 
          size="sm" 
          variant="secondary"
          onClick={() => onEdit(item)}
          className="flex-1"
        >
          Edit
        </Button>
        <Button 
          size="sm" 
          variant="danger"
          onClick={handleDelete}
          className="flex-1"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}