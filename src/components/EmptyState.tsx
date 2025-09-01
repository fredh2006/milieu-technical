import { Package, Search } from 'lucide-react';

interface EmptyStateProps {
  type: 'no-items' | 'no-results' | 'filter-empty' | 'location-empty' | 'search-only' | 'status-filter' | 'date-filter';
  searchTerm?: string;
  statusFilter?: string;
  locationFilter?: string;
  location?: string;
  showExpiringWithin7Days?: boolean;
  totalItemsCount?: number;
  onAction?: () => void;
  onAddItem?: () => void;
}

export default function EmptyState({ 
  type, 
  searchTerm, 
  statusFilter,
  locationFilter, 
  location,
  showExpiringWithin7Days,
  onAddItem 
}: EmptyStateProps) {
  const getConfig = () => {
    switch (type) {
      case 'no-items':
        return {
          icon: <Package className="w-12 h-12 text-slate-400" />,
          title: "Your freezer is empty",
          description: "Start adding items now to keep track of what you have stored.",
          actionText: "Add Item",
          showAction: !!onAddItem,
          action: onAddItem
        };

      case 'search-only':
        return {
          title: "No results found",
          description: `No items matching "${searchTerm}". Try a different search term.`,
        };

      case 'status-filter':
        return {
          title: `No ${statusFilter?.toLowerCase()} items`,
          description: `No ${statusFilter?.toLowerCase()} items found. Items with this status will appear here.`,
        };

      case 'date-filter':
        return {
          title: "No items expiring soon",
          description: location
            ? `No items expiring within 7 days in ${location}. Great job keeping things fresh!`
            : "No items expiring within 7 days. Great job keeping things fresh!",
        };

      case 'location-empty':
        return {
          title: `No items in the ${location}`,
          description: `This location is empty. Add items to start tracking.`,
          actionText: "Add Item",
          showAction: !!onAddItem,
          action: onAddItem
        };

      default: // 'no-results' - multiple filters active
        const hasSearch = !!searchTerm;
        const hasStatusFilter = statusFilter && statusFilter !== 'All';
        const hasLocationFilter = locationFilter && locationFilter !== 'All';
        const hasDateFilter = showExpiringWithin7Days;
        
        let description = "No items match ";
        const conditions = [];
        
        if (hasSearch) conditions.push(`search "${searchTerm}"`);
        if (hasStatusFilter) conditions.push(`status "${statusFilter}"`);
        if (hasLocationFilter) conditions.push(`location "${locationFilter}"`);
        if (hasDateFilter) conditions.push("expiring within 7 days");
        
        description += conditions.join(", ");
        description += ". Try adjusting your filters.";

        return {
          icon: <Search className="w-12 h-12 text-slate-400" />,
          title: "No results found",
          description,
        };
    }
  };

  const config = getConfig();

  return (
    <div className="bg-gradient-to-br from-white/80 via-slate-50/40 to-blue-50/30 backdrop-blur-xl rounded-2xl shadow-lg border border-white/40 py-8">
      <div className="text-center max-w-md mx-auto px-6">
        <h3 className="text-lg font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 bg-clip-text text-transparent mb-3 tracking-tight">
          {config.title}
        </h3>
        <p className="text-sm text-slate-700 mb-6 leading-relaxed">
          {config.description}
        </p>
        {config.showAction && config.action && (
          <button
            onClick={config.action}
            className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            {config.actionText}
          </button>
        )}
      </div>
    </div>
  );
}