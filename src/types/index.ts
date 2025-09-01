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

export interface SearchFilters {
  searchTerm: string;
  statusFilter: ItemStatus | 'All';
  locationFilter: FreezerLocation | 'All';
  showExpiringWithin7Days: boolean;
}

export interface ItemFormData {
  name: string;
  quantity: number;
  location: FreezerLocation;
  expiresOn: Date;
  notes?: string;
}