import { useState, useCallback } from 'react';
import type { SearchFilters, ItemWithStatus, ItemFormData } from './types';
import { useFreezerItems, useFilteredItems, useBulkSelection } from './hooks/useFreezerItems';
import NewToolbar from './components/NewToolbar';
import LocationTable from './components/LocationTable';
import LocationGrid from './components/LocationGrid';
import ItemForm from './components/ItemForm';
import ErrorState from './components/ErrorState';
import BulkActionsToolbar from './components/BulkActionsToolbar';
import EmptyState from './components/EmptyState';
import TestFailureButton from './components/TestFailureButton';
import { useToast } from './components/ui/ToastContainer';
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
  globalSelectedIds,
  filters,
  totalItemsCount,
  onClearFilters
}: {
  location: FreezerLocation;
  items: ItemWithStatus[];
  onEditItem: (item: ItemWithStatus) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: () => void;
  viewMode: 'table' | 'grid';
  globalToggleItem: (id: string) => void;
  globalSelectedIds: string[];
  filters: SearchFilters;
  totalItemsCount: number;
  onClearFilters: () => void;
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
      searchTerm={filters.searchTerm}
      statusFilter={filters.statusFilter}
      locationFilter={filters.locationFilter}
      showExpiringWithin7Days={filters.showExpiringWithin7Days}
      totalItemsCount={totalItemsCount}
      onClearFilters={onClearFilters}
    />
  ) : (
    <LocationGrid
      location={location}
      items={items}
      onEditItem={onEditItem}
      onDeleteItem={onDeleteItem}
      onAddItem={onAddItem}
      searchTerm={filters.searchTerm}
      statusFilter={filters.statusFilter}
      locationFilter={filters.locationFilter}
      showExpiringWithin7Days={filters.showExpiringWithin7Days}
      totalItemsCount={totalItemsCount}
      onClearFilters={onClearFilters}
    />
  );
}

function App() {
  const { items, loading, error, addItem, updateItem, deleteItem, bulkDeleteItems } = useFreezerItems();
  const [persistenceError, setPersistenceError] = useState<{ message: string; type: 'save' | 'delete' } | null>(null);
  const { showToast } = useToast();
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
      showToast('success', 'Item Deleted', 'Item has been successfully removed from your inventory.');
    } catch (error) {
      console.error('Failed to delete item:', error);
      const message = error instanceof Error ? error.message : 'Unable to delete item. Please check your connection and try again.';
      showToast('error', 'Delete Failed', message);
      setPersistenceError({ 
        message,
        type: 'delete'
      });
    }
  }, [deleteItem, showToast]);

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
        showToast('success', 'Item Updated', 'Your changes have been saved successfully.');
      } else {
        await addItem({
          ...formData,
          addedAt: new Date()
        });
        showToast('success', 'Item Added', 'New item has been added to your inventory.');
      }
    } catch (error) {
      console.error('Failed to save item:', error);
      const message = error instanceof Error ? error.message : 'Unable to save changes. Your data may not be persisted.';
      showToast('error', 'Save Failed', message);
      setPersistenceError({ 
        message,
        type: 'save'
      });
      throw error;
    }
  }, [editingItem, updateItem, addItem, showToast]);

  const handleFormClose = useCallback(() => {
    setIsFormOpen(false);
    setEditingItem(undefined);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      searchTerm: '',
      statusFilter: 'All',
      locationFilter: 'All',
      showExpiringWithin7Days: false
    });
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-100/50 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
      <main className="relative px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent mb-3 tracking-tight">
              Milieu's Freezer
            </h1>
          </div>
          
          <div className="mb-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6" role="region" aria-label="Inventory statistics">
              <div className="bg-gradient-to-br from-white/90 via-slate-50/50 to-blue-50/30 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/30 hover:shadow-xl hover:border-blue-200/40 transition-all duration-300 group" role="status" aria-label="Total items in inventory">
                <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Total Items</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent group-hover:from-slate-900 group-hover:to-blue-800 transition-all duration-300" aria-label={`${totalItems} total items`}>{totalItems}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-100/80 via-green-50 to-teal-50/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-200/50 hover:shadow-xl hover:border-emerald-300/60 transition-all duration-300 group" role="status" aria-label="Fresh items count">
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">Fresh</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent group-hover:from-emerald-800 group-hover:to-teal-700 transition-all duration-300" aria-label={`${freshItems} fresh items`}>{freshItems}</div>
              </div>
              <div className="bg-gradient-to-br from-amber-100/80 via-orange-50 to-yellow-50/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-amber-200/50 hover:shadow-xl hover:border-amber-300/60 transition-all duration-300 group" role="status" aria-label="Items expiring soon count">
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Expiring Soon</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent group-hover:from-amber-800 group-hover:to-orange-700 transition-all duration-300" aria-label={`${expiringItems} items expiring soon`}>{expiringItems}</div>
              </div>
              <div className="bg-gradient-to-br from-rose-100/80 via-red-50 to-pink-50/60 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-rose-200/50 hover:shadow-xl hover:border-rose-300/60 transition-all duration-300 group" role="status" aria-label="Expired items count">
                <div className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">Expired</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-rose-700 to-red-600 bg-clip-text text-transparent group-hover:from-rose-800 group-hover:to-red-700 transition-all duration-300" aria-label={`${expiredItems} expired items`}>{expiredItems}</div>
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
          
          {items.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                type="no-items"
                totalItemsCount={items.length}
                onAddItem={handleAddItem}
              />
            </div>
          ) : (
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
                    filters={filters}
                    totalItemsCount={items.length}
                    onClearFilters={handleClearFilters}
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
                  filters={filters}
                  totalItemsCount={items.length}
                  onClearFilters={handleClearFilters}
                />
              )}
            </div>
          )}
        </div>
      </main>

      <ItemForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        editItem={editingItem}
      />

      <TestFailureButton
        items={filteredItems}
        onAddItem={async (item, forceFailure) => {
          await addItem(item, forceFailure);
        }}
        onUpdateItem={async (id, updates, forceFailure) => {
          await updateItem(id, updates, forceFailure);
        }}
        onDeleteItem={async (id, forceFailure) => {
          await deleteItem(id, forceFailure);
        }}
      />
    </div>
  );
}

export default App;
