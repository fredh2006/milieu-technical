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
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/90 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-2xl border border-white/20 shadow-slate-900/10">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-slate-700">
              {selectedCount} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClearSelection}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-all duration-200"
            >
              Clear
            </button>
            
            <button
              onClick={onBulkDelete}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-all duration-200 shadow-lg hover:shadow-red-500/25"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}