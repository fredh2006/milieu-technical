import { Package, Search, Filter } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-items' | 'no-results' | 'filter-empty';
  searchTerm?: string;
  filterType?: string;
  onAction?: () => void;
}

export default function EmptyState({ type, searchTerm, filterType, onAction }: EmptyStateProps) {
  const configs = {
    'no-items': {
      icon: <Package className="w-16 h-16 text-gray-400" />,
      title: "No items in your freezer",
      description: "Get started by adding your first freezer item to keep track of what you have stored.",
      actionText: "Add First Item",
      showAction: true
    },
    'no-results': {
      icon: <Search className="w-16 h-16 text-gray-400" />,
      title: "No results found",
      description: searchTerm 
        ? `No items matching "${searchTerm}". Try adjusting your search or filters.`
        : "No items match the current filters. Try adjusting your criteria.",
      actionText: "Clear Filters",
      showAction: true
    },
    'filter-empty': {
      icon: <Filter className="w-16 h-16 text-gray-400" />,
      title: `No ${filterType || 'items'} items`,
      description: `There are no items in the "${filterType}" category. Items in this category will appear here.`,
      actionText: "View All Items",
      showAction: true
    }
  };

  const config = configs[type];

  return (
    <div className="bg-white rounded-lg shadow-sm py-16">
      <div className="text-center max-w-md mx-auto">
        <div className="flex justify-center mb-4">
          {config.icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {config.title}
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {config.description}
        </p>
        {config.showAction && onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-500 hover:bg-blue-600 transition-colors"
          >
            {config.actionText}
          </button>
        )}
      </div>
    </div>
  );
}