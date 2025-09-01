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

- `useFreezerItems` Core CRUD operations with optimistic updates
- `useFilteredItems`: Memoized filtering logic
- `useBulkSelection`: Selection state management

Simple, type safe approach.

### Memoization 
Used `useMemo` and `useCallback` to prevent unnecessary re-renders:

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

- Status calculation runs for every item on every render
- Filtering can be expensive and take too long for large freezers

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

## Optimistic Updates & Error Handling

### Optimistic UI Pattern
All write operations (add, update, delete) use optimistic updates:

1. **Immediate UI update** - Changes appear instantly
2. **Background API call** - Actual operation happens asynchronously
3. **Success**: UI stays updated
4. **Failure**: UI reverts to previous state + shows error toast

### Failure Simulation (Dev Mode Only)
In development, test buttons in the bottom-left corner simulate network failures:
- Buttons will always fail with a network delay

## Accessibility Features

### Keyboard Navigation
- **Tab/Shift+Tab**: Navigate through all interactive elements
- **Space**: Activate buttons and form controls
- **Escape**: Close modals and dropdowns
- **Arrow keys**: Navigate dropdown options

### Screen Reader Support
- Visible focus indicators on all interactive elements
- Semantic HTML: Proper use of headings, lists, and landmarks
- ARIA labels: Descriptive labels for all interactive elements
- ARIA live regions: Status updates announced to screen readers
- ARIA states: `aria-expanded`, `aria-selected`, `aria-pressed`
- Role attributes: `dialog`, `toolbar`, `status`, `listbox`

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

## Project Structure

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
