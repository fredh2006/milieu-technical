import type { FreezerLocation, ItemStatus } from '../types';

export const FREEZER_LOCATIONS: FreezerLocation[] = [
  'Top Drawer',
  'Bottom Drawer',
  'Door'
];

export const ITEM_STATUSES: ItemStatus[] = [
  'Fresh',
  'Expiring Soon',
  'Expired'
];

export const EXPIRING_SOON_DAYS = 3;
export const SEARCH_DEBOUNCE_MS = 300;

export const STATUS_COLORS = {
  Fresh: 'bg-green-100 text-green-800 border-green-200',
  'Expiring Soon': 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Expired: 'bg-red-100 text-red-800 border-red-200'
} as const;

export const LOCATION_ICONS = {
  'Top Drawer': '📦',
  'Bottom Drawer': '🗃️',
  'Door': '🚪'
} as const;