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

// Component wrapper to handle location-specific bulk selection
function LocationTableWrapper({ 
  location, 
  items, 
  onEditItem, 
  onDeleteItem, 
  onAddItem, 
  viewMode,
  globalToggleItem,
  globalSelectedIds
}: {
  location: FreezerLocation;
  items: ItemWithStatus[];
  onEditItem: (item: ItemWithStatus) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: () => void;
  viewMode: 'table' | 'grid';
  globalToggleItem: (id: string) => void;
  globalSelectedIds: string[];
}) {
  const locationSelectedIds = globalSelectedIds.filter(id => 
    items.some(item => item.id === id)
  );

  const toggleItem = useCallback((id: string) => {
    globalToggleItem(id);
  }, [globalToggleItem]);

  const toggleAll = useCallback(() => {
    const locationItemIds = items.map(item => item.id);
    const allSelected = locationItemIds.every(id => globalSelectedIds.includes(id));
    
    if (allSelected) {
      // Deselect all items in this location
      locationItemIds.forEach(id => {
        if (globalSelectedIds.includes(id)) {
          globalToggleItem(id);
        }
      });
    } else {
      // Select all items in this location
      locationItemIds.forEach(id => {
        if (!globalSelectedIds.includes(id)) {
          globalToggleItem(id);
        }
      });
    }
  }, [items, globalSelectedIds, globalToggleItem]);

  const isAllSelected = items.length > 0 && items.every(item => globalSelectedIds.includes(item.id));
  const isPartiallySelected = items.some(item => globalSelectedIds.includes(item.id)) && !isAllSelected;

  return viewMode === 'table' ? (
    <LocationTable
      location={location}
      items={items}
      onEditItem={onEditItem}
      onDeleteItem={onDeleteItem}
      onAddItem={onAddItem}
      selectedIds={locationSelectedIds}
      onToggleItem={toggleItem}
      onToggleAll={toggleAll}
      isAllSelected={isAllSelected}
      isPartiallySelected={isPartiallySelected}
    />
  ) : (
    <LocationGrid
      location={location}
      items={items}
      onEditItem={onEditItem}
      onDeleteItem={onDeleteItem}
      onAddItem={onAddItem}
    />
  );
}

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
  
  // Global selection state for bulk actions toolbar
  const {
    selectedIds: globalSelectedIds,
    toggleItem: globalToggleItem,
    clearSelection: globalClearSelection,
    selectedCount: globalSelectedCount
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
    if (globalSelectedIds.length === 0) return;
    
    const selectedItems = filteredItems.filter(item => globalSelectedIds.includes(item.id));
    const itemNames = selectedItems.map(item => item.name).join(', ');
    
    if (window.confirm(`Are you sure you want to delete ${globalSelectedIds.length} item(s)? This will delete: ${itemNames}`)) {
      try {
        setPersistenceError(null);
        await bulkDeleteItems(globalSelectedIds);
        globalClearSelection();
      } catch (error) {
        console.error('Failed to bulk delete items:', error);
        setPersistenceError({ 
          message: 'Unable to delete selected items. Please check your connection and try again.',
          type: 'delete'
        });
      }
    }
  }, [globalSelectedIds, filteredItems, bulkDeleteItems, globalClearSelection]);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-lg font-medium text-slate-700">Loading your freezer inventory...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              Freezer Inventory
            </h1>
            <p className="text-slate-600">Manage your frozen items with ease</p>
          </div>
          
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-5 shadow-sm border border-white/20 hover:shadow-md transition-shadow">
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Total Items</div>
                <div className="text-2xl font-bold text-slate-900">{totalItems}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
                <div className="text-xs font-medium text-emerald-700 uppercase tracking-wide mb-1">Fresh</div>
                <div className="text-2xl font-bold text-emerald-700">{freshItems}</div>
              </div>
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
                <div className="text-xs font-medium text-amber-700 uppercase tracking-wide mb-1">Expiring Soon</div>
                <div className="text-2xl font-bold text-amber-700">{expiringItems}</div>
              </div>
              <div className="bg-gradient-to-br from-rose-50 to-red-50 rounded-xl p-5 shadow-sm border border-rose-100 hover:shadow-md transition-shadow">
                <div className="text-xs font-medium text-rose-700 uppercase tracking-wide mb-1">Expired</div>
                <div className="text-2xl font-bold text-rose-700">{expiredItems}</div>
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
            <div className="mb-8">
              <ErrorState 
                error={persistenceError.message}
                type={persistenceError.type}
                onRetry={() => setPersistenceError(null)}
              />
            </div>
          )}

          <BulkActionsToolbar
            selectedCount={globalSelectedCount}
            onBulkDelete={handleBulkDelete}
            onClearSelection={globalClearSelection}
          />
          
          <div className="space-y-8">
            {filters.locationFilter === 'All' ? (
              (['Top Drawer', 'Bottom Drawer', 'Door'] as FreezerLocation[]).map((location) => {
                const locationItems = filteredItems.filter(item => item.location === location);
                return <LocationTableWrapper
                  key={location}
                  location={location}
                  items={locationItems}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                  onAddItem={handleAddItem}
                  viewMode={viewMode}
                  globalToggleItem={globalToggleItem}
                  globalSelectedIds={globalSelectedIds}
                />;
              })
            ) : (
              <LocationTableWrapper
                location={filters.locationFilter as FreezerLocation}
                items={filteredItems}
                onEditItem={handleEditItem}
                onDeleteItem={handleDeleteItem}
                onAddItem={handleAddItem}
                viewMode={viewMode}
                globalToggleItem={globalToggleItem}
                globalSelectedIds={globalSelectedIds}
              />
            )}
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
