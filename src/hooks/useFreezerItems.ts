import { useState, useEffect, useMemo, useCallback } from 'react';
import type { FreezerItem, ItemWithStatus, SearchFilters, FreezerLocation } from '../types';
import { FreezerRepository } from '../lib/repository';
import { calculateStatus, sortByExpirationAsc, isExpiringWithinDays } from '../lib/dateUtils';

const repository = new FreezerRepository();

export function useFreezerItems() {
  const [items, setItems] = useState<FreezerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load items from IndexedDB on mount
  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        setError(null);
        const loadedItems = await repository.getAll();
        setItems(loadedItems);
      } catch (err) {
        console.error('Failed to load items:', err);
        setError('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  // Add status to items
  const itemsWithStatus = useMemo((): ItemWithStatus[] => {
    return items.map(item => ({
      ...item,
      status: calculateStatus(item.expiresOn)
    }));
  }, [items]);

  // CRUD operations
  const addItem = useCallback(async (itemData: Omit<FreezerItem, 'id'>) => {
    try {
      setError(null);
      const newItem = await repository.save(itemData);
      setItems(prevItems => [...prevItems, newItem]);
      return newItem;
    } catch (err) {
      console.error('Failed to add item:', err);
      setError('Failed to add item');
      throw err;
    }
  }, []);

  const updateItem = useCallback(async (id: string, updates: Partial<FreezerItem>) => {
    try {
      setError(null);
      const updatedItem = await repository.update(id, updates);
      setItems(prevItems => 
        prevItems.map(item => item.id === id ? updatedItem : item)
      );
      return updatedItem;
    } catch (err) {
      console.error('Failed to update item:', err);
      setError('Failed to update item');
      throw err;
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    try {
      setError(null);
      await repository.delete(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Failed to delete item:', err);
      setError('Failed to delete item');
      throw err;
    }
  }, []);

  const bulkDeleteItems = useCallback(async (ids: string[]) => {
    try {
      setError(null);
      await repository.bulkDelete(ids);
      setItems(prevItems => prevItems.filter(item => !ids.includes(item.id)));
    } catch (err) {
      console.error('Failed to bulk delete items:', err);
      setError('Failed to delete items');
      throw err;
    }
  }, []);

  return {
    items: itemsWithStatus,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem,
    bulkDeleteItems
  };
}

// Filtering logic
export function useFilteredItems(
  items: ItemWithStatus[],
  filters: SearchFilters
): ItemWithStatus[] {
  return useMemo(() => {
    return items.filter(item => {
      // Search term filter
      if (filters.searchTerm && 
          !item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      
      // Status filter
      if (filters.statusFilter !== 'All' && item.status !== filters.statusFilter) {
        return false;
      }
      
      // Location filter
      if (filters.locationFilter !== 'All' && item.location !== filters.locationFilter) {
        return false;
      }
      
      // Expiring within 7 days toggle
      if (filters.showExpiringWithin7Days && 
          !isExpiringWithinDays(item.expiresOn, 7)) {
        return false;
      }
      
      return true;
    });
  }, [items, filters]);
}

// Grouping logic
export function useGroupedItems(
  items: ItemWithStatus[]
): Record<FreezerLocation, ItemWithStatus[]> {
  return useMemo(() => {
    const groups = items.reduce((acc, item) => {
      if (!acc[item.location]) {
        acc[item.location] = [];
      }
      acc[item.location].push(item);
      return acc;
    }, {} as Record<FreezerLocation, ItemWithStatus[]>);
    
    // Sort items within each group by expiresOn ascending
    Object.keys(groups).forEach(location => {
      groups[location as FreezerLocation].sort(sortByExpirationAsc);
    });
    
    return groups;
  }, [items]);
}

// Bulk selection logic
export function useBulkSelection(items: ItemWithStatus[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleItem = useCallback((id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setSelectedIds(prev => {
      if (prev.size === items.length) {
        return new Set();
      } else {
        return new Set(items.map(item => item.id));
      }
    });
  }, [items]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = useCallback((id: string) => {
    return selectedIds.has(id);
  }, [selectedIds]);

  const isAllSelected = useMemo(() => {
    return items.length > 0 && selectedIds.size === items.length;
  }, [selectedIds.size, items.length]);

  const isPartiallySelected = useMemo(() => {
    return selectedIds.size > 0 && selectedIds.size < items.length;
  }, [selectedIds.size, items.length]);

  return {
    selectedIds: Array.from(selectedIds),
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isPartiallySelected,
    selectedCount: selectedIds.size
  };
}