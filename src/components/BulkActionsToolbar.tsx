import { Trash2 } from 'lucide-react';

interface BulkActionsToolbarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onClearSelection: () => void;
}

export default function BulkActionsToolbar({ 
  selectedCount, 
  onBulkDelete, 
  onClearSelection 
}: BulkActionsToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white rounded-lg px-4 py-2 shadow-lg z-50">
      <div className="flex items-center space-x-4">
        <span className="text-sm font-medium">
          {selectedCount} selected
        </span>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onClearSelection}
            className="text-xs text-gray-300 hover:text-white px-2 py-1"
          >
            Clear
          </button>
          
          <button
            onClick={onBulkDelete}
            className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}