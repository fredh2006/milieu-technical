import { differenceInDays, compareAsc } from 'date-fns';
import type { ItemStatus } from '../types';
import { EXPIRING_SOON_DAYS } from './constants';

export function calculateStatus(expiresOn: Date): ItemStatus {
  const now = new Date();
  const diffInDays = differenceInDays(expiresOn, now);
  
  if (diffInDays < 0) return 'Expired';
  if (diffInDays <= EXPIRING_SOON_DAYS) return 'Expiring Soon';
  return 'Fresh';
}

export function sortByExpirationAsc(a: { expiresOn: Date }, b: { expiresOn: Date }) {
  return compareAsc(a.expiresOn, b.expiresOn);
}

export function isExpiringWithinDays(expiresOn: Date, days: number): boolean {
  const diffInDays = differenceInDays(expiresOn, new Date());
  return diffInDays >= 0 && diffInDays <= days;
}