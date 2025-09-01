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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50" role="toolbar" aria-label="Bulk actions">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-2xl border border-slate-300/60 shadow-slate-900/10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2" role="status" aria-live="polite">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse" aria-hidden="true"></div>
            <span className="text-sm font-semibold text-slate-700">
              {selectedCount} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClearSelection}
              aria-label={`Clear selection of ${selectedCount} items`}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2"
            >
              Clear
            </button>
            
            <button
              onClick={onBulkDelete}
              aria-label={`Delete selected ${selectedCount} items`}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/25 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2"
            >
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}