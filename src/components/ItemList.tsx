import type { ItemWithStatus } from '../types';
import ItemTable from './ItemTable';

interface ItemListProps {
  items: ItemWithStatus[];
  onEditItem: (item: ItemWithStatus) => void;
  onDeleteItem: (id: string) => void;
}

export default function ItemList({ items, onEditItem, onDeleteItem }: ItemListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No items found
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            Add your first item to start tracking your freezer inventory, or adjust your filters to see more items.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ItemTable 
      items={items}
      onEditItem={onEditItem}
      onDeleteItem={onDeleteItem}
    />
  );
}