import { get, set, del, keys } from 'idb-keyval';
import type { FreezerItem } from '../types';

export class FreezerRepository {
  private static readonly DB_NAME = 'freezer-inventory';
  private static readonly STORE_KEY = 'items';

  private generateId(): string {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldSimulateFailure(forceFailure = false): boolean {
    // Only simulate failures in development mode
    if (!import.meta.env.DEV) return false;
    
    // If forceFailure is true (from test buttons), always fail
    if (forceFailure) return true;
    
    // For normal operations, never fail
    return false;
  }

  private async simulateNetworkDelay(): Promise<void> {
    // Add realistic network delay
    const delay = Math.random() * 1000 + 500; // 500-1500ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  private getItemKey(id: string): string {
    return `${FreezerRepository.STORE_KEY}-${id}`;
  }

  async getAll(): Promise<FreezerItem[]> {
    try {
      const allKeys = await keys();
      const itemKeys = allKeys.filter((key: IDBValidKey) => 
        typeof key === 'string' && key.startsWith(`${FreezerRepository.STORE_KEY}-`)
      ) as string[];
      
      const items = await Promise.all(
        itemKeys.map(async (key: string) => {
          const item = await get(key);
          if (item) {
            // Convert date strings back to Date objects
            return {
              ...item,
              addedAt: new Date(item.addedAt),
              expiresOn: new Date(item.expiresOn)
            };
          }
          return null;
        })
      );

      return items.filter((item): item is FreezerItem => item !== null);
    } catch (error) {
      console.error('Failed to get all items:', error);
      return [];
    }
  }

  async getById(id: string): Promise<FreezerItem | null> {
    try {
      const item = await get(this.getItemKey(id));
      if (!item) return null;

      return {
        ...item,
        addedAt: new Date(item.addedAt),
        expiresOn: new Date(item.expiresOn)
      };
    } catch (error) {
      console.error('Failed to get item by id:', error);
      return null;
    }
  }

  async save(itemData: Omit<FreezerItem, 'id'>, forceFailure = false): Promise<FreezerItem> {
    await this.simulateNetworkDelay();
    
    if (this.shouldSimulateFailure(forceFailure)) {
      throw new Error('Network error: Failed to save item. Please try again.');
    }

    try {
      const id = this.generateId();
      const item: FreezerItem = {
        ...itemData,
        id,
        addedAt: itemData.addedAt || new Date()
      };

      await set(this.getItemKey(id), {
        ...item,
        addedAt: item.addedAt.toISOString(),
        expiresOn: item.expiresOn.toISOString()
      });

      return item;
    } catch (error) {
      console.error('Failed to save item:', error);
      throw new Error('Failed to save item');
    }
  }

  async update(id: string, updates: Partial<FreezerItem>, forceFailure = false): Promise<FreezerItem> {
    await this.simulateNetworkDelay();
    
    if (this.shouldSimulateFailure(forceFailure)) {
      throw new Error('Network error: Failed to update item. Please try again.');
    }

    try {
      const existingItem = await this.getById(id);
      if (!existingItem) {
        throw new Error(`Item with id ${id} not found`);
      }

      const updatedItem: FreezerItem = {
        ...existingItem,
        ...updates,
        id // Ensure ID cannot be changed
      };

      await set(this.getItemKey(id), {
        ...updatedItem,
        addedAt: updatedItem.addedAt.toISOString(),
        expiresOn: updatedItem.expiresOn.toISOString()
      });

      return updatedItem;
    } catch (error) {
      console.error('Failed to update item:', error);
      throw new Error('Failed to update item');
    }
  }

  async delete(id: string, forceFailure = false): Promise<void> {
    await this.simulateNetworkDelay();
    
    if (this.shouldSimulateFailure(forceFailure)) {
      throw new Error('Network error: Failed to delete item. Please try again.');
    }

    try {
      await del(this.getItemKey(id));
    } catch (error) {
      console.error('Failed to delete item:', error);
      throw new Error('Failed to delete item');
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    try {
      await Promise.all(ids.map(id => del(this.getItemKey(id))));
    } catch (error) {
      console.error('Failed to bulk delete items:', error);
      throw new Error('Failed to bulk delete items');
    }
  }
}