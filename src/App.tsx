import { useState, useCallback } from 'react';
import type { SearchFilters, ItemWithStatus, ItemFormData } from './types';
import { useFreezerItems, useFilteredItems, useBulkSelection } from './hooks/useFreezerItems';
import NewToolbar from './components/NewToolbar';
import LocationTable from './components/LocationTable';
import LocationGrid from './components/LocationGrid';
import ItemForm from './components/ItemForm';
import ErrorState from './components/ErrorState';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import type { FreezerLocation } from './types';

function App() {
  const { items, loading, error, addItem, updateItem, deleteItem, bulkDeleteItems } = useFreezerItems();
  const [persistenceError, setPersistenceError] = useState<{ message: string; type: 'save' | 'delete' } | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    statusFilter: 'All',
    locationFilter: 'All',
    showExpiringWithin7Days: false
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ItemWithStatus | undefined>();
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const filteredItems = useFilteredItems(items, filters);
  const {
    selectedIds,
    toggleItem,
    toggleAll,
    clearSelection,
    isAllSelected,
    isPartiallySelected,
    selectedCount
  } = useBulkSelection(filteredItems);

  const handleFiltersChange = useCallback((newFilters: SearchFilters) => {
    setFilters(newFilters);
  }, []);

  const handleAddItem = useCallback(() => {
    setEditingItem(undefined);
    setIsFormOpen(true);
  }, []);

  const handleEditItem = useCallback((item: ItemWithStatus) => {
    setEditingItem(item);
    setIsFormOpen(true);
  }, []);

  const handleDeleteItem = useCallback(async (id: string) => {
    try {
      setPersistenceError(null);
      await deleteItem(id);
    } catch (error) {
      console.error('Failed to delete item:', error);
      setPersistenceError({ 
        message: 'Unable to delete item. Please check your connection and try again.',
        type: 'delete'
      });
    }
  }, [deleteItem]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.length === 0) return;
    
    const selectedItems = filteredItems.filter(item => selectedIds.includes(item.id));
    const itemNames = selectedItems.map(item => item.name).join(', ');
    
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} item(s)? This will delete: ${itemNames}`)) {
      try {
        setPersistenceError(null);
        await bulkDeleteItems(selectedIds);
        clearSelection();
      } catch (error) {
        console.error('Failed to bulk delete items:', error);
        setPersistenceError({ 
          message: 'Unable to delete selected items. Please check your connection and try again.',
          type: 'delete'
        });
      }
    }
  }, [selectedIds, filteredItems, bulkDeleteItems, clearSelection]);

  const handleFormSubmit = useCallback(async (formData: ItemFormData) => {
    try {
      setPersistenceError(null);
      if (editingItem) {
        await updateItem(editingItem.id, formData);
      } else {
        await addItem({
          ...formData,
          addedAt: new Date()
        });
      }
    } catch (error) {
      console.error('Failed to save item:', error);
      setPersistenceError({ 
        message: 'Unable to save changes. Your data may not be persisted.',
        type: 'save'
      });
      throw error;
    }
  }, [editingItem, updateItem, addItem]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingItem(undefined);
  }, []);


  const handleRetry = useCallback(() => {
    setPersistenceError(null);
    window.location.reload();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg text-gray-600">Loading your freezer inventory...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <ErrorState 
          error={error} 
          type="load"
          onRetry={handleRetry}
        />
      </div>
    );
  }

  const totalItems = items.length;
  const expiringItems = items.filter(item => item.status === 'Expiring Soon').length;
  const expiredItems = items.filter(item => item.status === 'Expired').length;
  const freshItems = items.filter(item => item.status === 'Fresh').length;

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Freezer Inventory</h1>
          
          <div className="mb-6">
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">Total Items</div>
                <div className="text-2xl font-bold text-gray-900">{totalItems}</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">Fresh</div>
                <div className="text-2xl font-bold text-green-600">{freshItems}</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">Expiring Soon</div>
                <div className="text-2xl font-bold text-yellow-600">{expiringItems}</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-sm text-gray-500">Expired</div>
                <div className="text-2xl font-bold text-red-600">{expiredItems}</div>
              </div>
            </div>
            
            <NewToolbar
              onFiltersChange={handleFiltersChange}
              onAddItem={handleAddItem}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
          
          {persistenceError && (
            <div className="mb-6">
              <ErrorState 
                error={persistenceError.message}
                type={persistenceError.type}
                onRetry={() => setPersistenceError(null)}
              />
            </div>
          )}

          <BulkActionsToolbar
            selectedCount={selectedCount}
            onBulkDelete={handleBulkDelete}
            onClearSelection={clearSelection}
          />
          
          <div className="space-y-6">
            {(['Top Drawer', 'Bottom Drawer', 'Door'] as FreezerLocation[]).map((location) => {
              const locationItems = filteredItems.filter(item => item.location === location);
              return viewMode === 'table' ? (
                <LocationTable
                  key={location}
                  location={location}
                  items={locationItems}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                  selectedIds={selectedIds}
                  onToggleItem={toggleItem}
                  onToggleAll={toggleAll}
                  isAllSelected={isAllSelected}
                  isPartiallySelected={isPartiallySelected}
                />
              ) : (
                <LocationGrid
                  key={location}
                  location={location}
                  items={locationItems}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                />
              );
            })}
          </div>
        </div>
      </main>

      <ItemForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editItem={editingItem}
      />
    </div>
  );
}

export default App;
