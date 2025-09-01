# Milieu's Freezer

Technical for Milieu. 

### Prerequisites
- Node.js (v16 or higher)
- npm

### Development Mode
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Architecture & Design Decisions

- **`useFreezerItems`**: Core CRUD operations with optimistic updates
- **`useFilteredItems`**: Memoized filtering logic
- **`useBulkSelection`**: Selection state management

This approach provides better performance and type safety while keeping the codebase simple.

### Memoization Strategy
Strategic use of `useMemo` and `useCallback` to prevent unnecessary re-renders:

```typescript
// Memoized status calculation - only recalculates when items change
const itemsWithStatus = useMemo((): ItemWithStatus[] => {
  return items.map(item => ({
    ...item,
    status: calculateStatus(item.expiresOn)
  }));
}, [items]);

// Memoized filtering - only recalculates when items or filters change
const filteredItems = useMemo(() => {
  return items.filter(item => {
    // Complex filtering logic
  });
}, [items, filters]);
```

**Why memoize here?**
- Status calculation runs for every item on every render
- Filtering can be expensive with large inventories
- Prevents cascading re-renders in child components

### Status Calculation Logic
Items are automatically categorized based on expiration dates:

```typescript
export function calculateStatus(expiresOn: Date): ItemStatus {
  const now = new Date();
  const timeDiff = expiresOn.getTime() - now.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  
  if (daysDiff < 0) return 'Expired';
  if (daysDiff <= 7) return 'Expiring Soon';
  return 'Fresh';
}
```

- **Expired**: Past expiration date
- **Expiring Soon**: Within 7 days
- **Fresh**: More than 7 days remaining

## 🔄 Optimistic Updates & Error Handling

### Optimistic UI Pattern
All write operations (add, update, delete) use optimistic updates:

1. **Immediate UI update** - Changes appear instantly
2. **Background API call** - Actual operation happens asynchronously
3. **Success**: UI stays updated
4. **Failure**: UI reverts to previous state + shows error toast

```typescript
const addItem = useCallback(async (itemData, forceFailure = false) => {
  // 1. Optimistically add to UI
  setItems(prevItems => [...prevItems, optimisticItem]);
  
  try {
    // 2. Attempt to save
    const savedItem = await repository.save(itemData, forceFailure);
    // 3. Replace optimistic with real data
    setItems(prevItems => 
      prevItems.map(item => 
        item.id === optimisticItem.id ? savedItem : item
      )
    );
  } catch (err) {
    // 4. Rollback on failure
    setItems(prevItems => 
      prevItems.filter(item => item.id !== optimisticItem.id)
    );
    throw err;
  }
}, []);
```

### Failure Simulation (Dev Mode Only)
In development, test buttons in the bottom-left corner simulate network failures:
- **Normal operations** work perfectly
- **Test buttons** always fail to demonstrate rollback behavior
- Simulated network delays (500-1500ms) for realistic testing

## 📱 Performance Optimizations

### Component-Level Optimizations
- **React.memo** for expensive components
- **useCallback** for stable function references
- **useMemo** for expensive calculations
- **Virtualization-ready** architecture for large datasets

### Data Management
- **IndexedDB** for client-side persistence
- **Debounced search** (300ms) to reduce filter operations
- **Efficient filtering** with early returns
- **Minimal re-renders** through careful dependency arrays

### Bundle Optimization
- **Tree-shaking** with ES modules
- **Code splitting** ready (dynamic imports)
- **Optimized builds** with Vite

## ♿ Accessibility Features

### Keyboard Navigation
- **Tab/Shift+Tab**: Navigate through all interactive elements
- **Enter/Space**: Activate buttons and form controls
- **Escape**: Close modals and dropdowns
- **Arrow keys**: Navigate dropdown options
- **Home/End**: Jump to first/last options in dropdowns

### Screen Reader Support
- **Semantic HTML**: Proper use of headings, lists, and landmarks
- **ARIA labels**: Descriptive labels for all interactive elements
- **ARIA live regions**: Status updates announced to screen readers
- **ARIA states**: `aria-expanded`, `aria-selected`, `aria-pressed`
- **Role attributes**: `dialog`, `toolbar`, `status`, `listbox`

### Focus Management
- **Visible focus indicators** on all interactive elements
- **Focus trapping** in modals
- **Focus restoration** when closing modals
- **Skip links** for keyboard users

### Examples of Accessibility Implementation:

```tsx
// Modal with proper ARIA attributes and focus management
<div 
  role="dialog" 
  aria-modal="true" 
  aria-labelledby="modal-title"
  tabIndex={-1}
  ref={modalRef}
>

// Button with descriptive label
<button
  onClick={onDelete}
  aria-label={`Delete ${item.name}`}
  className="focus:outline-none focus:ring-2 focus:ring-red-500/50"
>

// Status with screen reader context
<span 
  role="status"
  aria-label={`Status: ${status}`}
>
  {status}
</span>

// Time elements with proper datetime attributes
<time 
  className="font-semibold" 
  dateTime={item.expiresOn.toISOString()}
>
  {format(item.expiresOn, 'MMM dd, yyyy')}
</time>
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   └── ...             # Feature components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and business logic
├── types/              # TypeScript type definitions
└── main.tsx           # Application entry point
```
