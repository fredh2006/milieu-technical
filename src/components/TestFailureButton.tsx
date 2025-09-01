import { useState } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useToast } from './ui/ToastContainer';
import type { ItemWithStatus, ItemFormData } from '../types';

interface TestFailureButtonProps {
  items: ItemWithStatus[];
  onAddItem: (item: ItemFormData & { addedAt: Date }, forceFailure?: boolean) => Promise<void>;
  onUpdateItem: (id: string, updates: ItemFormData, forceFailure?: boolean) => Promise<void>;
  onDeleteItem: (id: string, forceFailure?: boolean) => Promise<void>;
}

export default function TestFailureButton({ 
  items, 
  onAddItem, 
  onUpdateItem, 
  onDeleteItem 
}: TestFailureButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const testOptimisticAdd = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    const testItem: ItemFormData & { addedAt: Date } = {
      name: 'Test Item (Will Fail)',
      quantity: 1,
      location: 'Top Drawer',
      expiresOn: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      notes: 'This is a test item that will randomly fail to simulate network errors',
      addedAt: new Date()
    };

    try {
      await onAddItem(testItem, true); // Force failure
      showToast('success', 'Item Added Successfully', 'The test item was added to your inventory.');
    } catch (error) {
      showToast('error', 'Failed to Add Item', 'The operation was rolled back due to a network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const testOptimisticUpdate = async () => {
    if (isLoading || items.length === 0) return;
    
    setIsLoading(true);
    
    // Pick the first item to update
    const itemToUpdate = items[0];
    const updates: ItemFormData = {
      ...itemToUpdate,
      name: `${itemToUpdate.name} (Updated - Will Fail)`,
      notes: `Updated at ${new Date().toLocaleTimeString()}: This update will randomly fail`
    };

    try {
      await onUpdateItem(itemToUpdate.id, updates, true); // Force failure
      showToast('success', 'Item Updated Successfully', 'The item was updated in your inventory.');
    } catch (error) {
      showToast('error', 'Failed to Update Item', 'The operation was rolled back due to a network error.');
    } finally {
      setIsLoading(false);
    }
  };

  const testOptimisticDelete = async () => {
    if (isLoading || items.length === 0) return;
    
    setIsLoading(true);
    
    // Pick the last item to delete
    const itemToDelete = items[items.length - 1];

    try {
      await onDeleteItem(itemToDelete.id, true); // Force failure
      showToast('success', 'Item Deleted Successfully', 'The item was removed from your inventory.');
    } catch (error) {
      showToast('error', 'Failed to Delete Item', 'The operation was rolled back due to a network error.');
    } finally {
      setIsLoading(false);
    }
  };

  // Only show in development mode
  if (!import.meta.env.DEV) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div className="bg-orange-50/90 backdrop-blur-xl rounded-lg px-2 py-2 shadow-lg border border-orange-200/60">
        <div className="flex items-center gap-1 mb-1">
          <AlertTriangle className="w-3 h-3 text-orange-600" />
          <span className="text-[10px] font-semibold text-orange-800 uppercase tracking-wider">
            Test Failures
          </span>
        </div>
        
        <div className="flex gap-1">
          <button
            onClick={testOptimisticAdd}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white text-[10px] font-medium px-2 py-1 rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
            aria-label="Test optimistic add with failure"
            title="Test Add (100% fail)"
          >
            {isLoading ? (
              <RefreshCw className="w-2 h-2 animate-spin" />
            ) : (
              '+'
            )}
          </button>
          
          <button
            onClick={testOptimisticUpdate}
            disabled={isLoading || items.length === 0}
            className="bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white text-[10px] font-medium px-2 py-1 rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
            aria-label="Test optimistic update with failure"
            title="Test Update (100% fail)"
          >
            {isLoading ? (
              <RefreshCw className="w-2 h-2 animate-spin" />
            ) : (
              '✏'
            )}
          </button>
          
          <button
            onClick={testOptimisticDelete}
            disabled={isLoading || items.length === 0}
            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-[10px] font-medium px-2 py-1 rounded transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-red-500/50"
            aria-label="Test optimistic delete with failure"
            title="Test Delete (100% fail)"
          >
            {isLoading ? (
              <RefreshCw className="w-2 h-2 animate-spin" />
            ) : (
              '×'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}