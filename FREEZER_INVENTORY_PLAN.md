# Freezer Inventory App - Implementation Plan

## Overview
A React-based freezer inventory management application with IndexedDB persistence, built with TypeScript, Vite, and Tailwind CSS.

## Current Stack Analysis
- ✅ React 18.x
- ✅ TypeScript 5.8.x
- ✅ Vite 7.x
- ✅ Tailwind CSS 4.x
- ❌ idb-keyval (needs installation)
- ❌ date-fns (needs installation)
- ❌ Vitest (needs installation)
- ❌ React Testing Library (needs installation)

## Required Dependencies to Install
```bash
# Production dependencies
npm install idb-keyval date-fns

# Development dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

## Data Models & Types

### Core Types
```typescript
export type FreezerLocation = 'Top Drawer' | 'Bottom Drawer' | 'Door';

export type ItemStatus = 'Fresh' | 'Expiring Soon' | 'Expired';

export interface FreezerItem {
  id: string;
  name: string;
  quantity: number;
  location: FreezerLocation;
  addedAt: Date;
  expiresOn: Date;
  notes?: string;
}

export interface ItemWithStatus extends FreezerItem {
  status: ItemStatus;
}
```

### Filter Types
```typescript
export interface SearchFilters {
  searchTerm: string;
  statusFilter: ItemStatus | 'All';
  locationFilter: FreezerLocation | 'All';
  showExpiringWithin7Days: boolean;
}
```

## Architecture Overview

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Button, Modal, etc.)
│   ├── ItemCard.tsx     # Individual item display
│   ├── ItemForm.tsx     # Create/Edit form
│   ├── ItemList.tsx     # List with grouping
│   ├── StatusChip.tsx   # Status indicator
│   └── Toolbar.tsx      # Search/filter controls
├── hooks/               # Custom hooks
│   ├── useFreezerItems.ts  # Main data hook
│   └── useDebounce.ts   # Search debouncing
├── lib/                 # Utilities and services
│   ├── repository.ts    # IndexedDB operations
│   ├── dateUtils.ts     # Date/status calculations
│   └── constants.ts     # App constants
├── types/               # Type definitions
│   └── index.ts
├── __tests__/           # Test files
└── App.tsx              # Main application
```

## Data Layer Architecture

### IndexedDB Repository (`lib/repository.ts`)
```typescript
export class FreezerRepository {
  private static readonly DB_NAME = 'freezer-inventory';
  private static readonly STORE_KEY = 'items';
  
  async getAll(): Promise<FreezerItem[]>
  async getById(id: string): Promise<FreezerItem | null>
  async save(item: Omit<FreezerItem, 'id'>): Promise<FreezerItem>
  async update(id: string, updates: Partial<FreezerItem>): Promise<FreezerItem>
  async delete(id: string): Promise<void>
}
```

### Custom Hook (`hooks/useFreezerItems.ts`)
```typescript
export function useFreezerItems() {
  // In-memory cache
  const [items, setItems] = useState<FreezerItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // CRUD operations
  const addItem = async (item: Omit<FreezerItem, 'id'>) => { /* ... */ };
  const updateItem = async (id: string, updates: Partial<FreezerItem>) => { /* ... */ };
  const deleteItem = async (id: string) => { /* ... */ };
  
  // Computed data
  const itemsWithStatus = useMemo(() => 
    items.map(item => ({ ...item, status: calculateStatus(item.expiresOn) }))
  , [items]);
  
  return { items: itemsWithStatus, loading, addItem, updateItem, deleteItem };
}
```

## Component Architecture

### Main App Component
- Manages global state via custom hook
- Renders toolbar and item list
- Handles modal state for item editing

### Toolbar Component
- Search input with 300ms debounce
- Status filter dropdown
- Location filter dropdown  
- "Expiring within 7 days" toggle
- "Add Item" button

### ItemList Component
- Groups items by location
- Sorts by expiresOn (ascending) within each group
- Renders ItemCard components
- Shows empty states

### ItemCard Component
- Displays item details
- Shows status chip
- Edit/delete actions
- Responsive design

### ItemForm Component (Modal/Side Panel)
- Form for creating/editing items
- Form validation
- Date picker for expiration
- Location selector

### StatusChip Component
- Color-coded status indicator
- Fresh: Green
- Expiring Soon: Yellow/Orange
- Expired: Red

## Business Logic

### Status Calculation
```typescript
export function calculateStatus(expiresOn: Date): ItemStatus {
  const now = new Date();
  const diffInDays = differenceInDays(expiresOn, now);
  
  if (diffInDays < 0) return 'Expired';
  if (diffInDays <= 3) return 'Expiring Soon';
  return 'Fresh';
}
```

### Filtering Logic
```typescript
export function filterItems(
  items: ItemWithStatus[],
  filters: SearchFilters
): ItemWithStatus[] {
  return items.filter(item => {
    // Search term filter (debounced)
    if (filters.searchTerm && !item.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
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
    if (filters.showExpiringWithin7Days) {
      const daysUntilExpiration = differenceInDays(item.expiresOn, new Date());
      if (daysUntilExpiration > 7) return false;
    }
    
    return true;
  });
}
```

### Grouping Logic
```typescript
export function groupItemsByLocation(items: ItemWithStatus[]): Record<FreezerLocation, ItemWithStatus[]> {
  const groups = items.reduce((acc, item) => {
    if (!acc[item.location]) acc[item.location] = [];
    acc[item.location].push(item);
    return acc;
  }, {} as Record<FreezerLocation, ItemWithStatus[]>);
  
  // Sort items within each group by expiresOn ascending
  Object.keys(groups).forEach(location => {
    groups[location as FreezerLocation].sort((a, b) => 
      compareAsc(a.expiresOn, b.expiresOn)
    );
  });
  
  return groups;
}
```

## UI/UX Design

### Layout Structure
```
┌─────────────────────────────────────────────────┐
│                   Header                        │
│  🥶 Freezer Inventory      [Search] [Filters]  │
├─────────────────────────────────────────────────┤
│                  Toolbar                        │
│  [Search Input] [Status▼] [Location▼] [7days☐] │
├─────────────────────────────────────────────────┤
│                Items by Location                │
│                                                 │
│  📦 Top Drawer (3 items)                       │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Item 1  │ │ Item 2  │ │ Item 3  │          │
│  │[Fresh]  │ │[Exp.Soon│ │[Expired]│          │
│  └─────────┘ └─────────┘ └─────────┘          │
│                                                 │
│  🚪 Door (2 items)                             │
│  ┌─────────┐ ┌─────────┐                      │
│  │ Item 4  │ │ Item 5  │                      │
│  └─────────┘ └─────────┘                      │
└─────────────────────────────────────────────────┘
```

### Color Scheme
- Fresh: `bg-green-100 text-green-800 border-green-200`
- Expiring Soon: `bg-yellow-100 text-yellow-800 border-yellow-200`
- Expired: `bg-red-100 text-red-800 border-red-200`

### Responsive Design
- Mobile: Single column, stacked cards
- Tablet: Two columns
- Desktop: Three columns with sidebar

## Implementation Phases

### Phase 1: Foundation Setup
1. Install required dependencies
2. Set up basic project structure
3. Create type definitions
4. Set up testing environment

### Phase 2: Data Layer
1. Implement IndexedDB repository
2. Create custom hook for data management
3. Add in-memory caching
4. Write unit tests for data layer

### Phase 3: Core Components
1. Create base UI components (Button, Modal, etc.)
2. Build ItemCard component
3. Build ItemForm component
4. Build StatusChip component

### Phase 4: List & Grouping
1. Build ItemList component with grouping
2. Implement sorting by expiration date
3. Add empty states
4. Test responsive layout

### Phase 5: Search & Filtering
1. Build Toolbar component
2. Implement debounced search
3. Add status and location filters
4. Add 7-day expiration toggle

### Phase 6: CRUD Operations
1. Wire up create item functionality
2. Wire up edit item functionality
3. Wire up delete item functionality
4. Add confirmation dialogs

### Phase 7: Polish & Testing
1. Add loading states
2. Add error handling
3. Write comprehensive tests
4. Performance optimization
5. Accessibility improvements

## Testing Strategy

### Unit Tests
- Repository methods
- Utility functions (status calculation, filtering, grouping)
- Custom hooks

### Integration Tests  
- Component interactions
- Form submissions
- CRUD workflows

### E2E Tests (Optional)
- Complete user journeys
- Data persistence across browser sessions

## Performance Considerations

### Optimization Strategies
1. **Memoization**: Use `useMemo` for expensive computations (filtering, grouping)
2. **Virtualization**: Consider react-window if item count becomes large
3. **Debouncing**: 300ms debounce on search input
4. **Lazy Loading**: Split components with React.lazy if bundle size grows
5. **IndexedDB Batching**: Batch multiple operations when possible

### Bundle Size Management
- Tree shake unused date-fns functions
- Consider date-fns/esm for smaller imports
- Monitor bundle size with webpack-bundle-analyzer

## Future Enhancements

### Potential Features
1. **Export/Import**: CSV/JSON data export/import
2. **Categories**: Item categorization (meat, vegetables, etc.)
3. **Photos**: Item photos using device camera
4. **Barcode Scanning**: Product identification
5. **Notifications**: Browser notifications for expiring items
6. **Analytics**: Usage statistics and waste tracking
7. **Shopping List**: Generate shopping list from expired/low items
8. **Multi-Freezer**: Support for multiple freezers
9. **User Accounts**: Cloud sync across devices
10. **Recipe Integration**: Link items to recipes

### Technical Improvements
1. **Offline Support**: Service worker for offline functionality
2. **PWA Features**: App-like experience on mobile
3. **Theme Support**: Dark/light mode toggle
4. **Internationalization**: Multi-language support
5. **Advanced Search**: Full-text search, advanced filters
6. **Data Migration**: Schema versioning for data updates

## Next Steps

1. **Run the installation command** for new dependencies
2. **Set up the basic project structure** with folders and files
3. **Start with Phase 1** - foundation setup
4. **Create initial types and constants**
5. **Build the IndexedDB repository layer**

This plan provides a comprehensive roadmap for building a robust, scalable freezer inventory application that meets all the specified requirements while allowing for future growth and enhancement.