import type { ItemStatus } from '../types';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface StatusChipProps {
  status: ItemStatus;
  size?: 'xs' | 'sm' | 'md';
}

export default function StatusChip({ status, size = 'sm' }: StatusChipProps) {
  const sizeClasses = {
    xs: 'px-3 py-1 text-xs',
    sm: 'px-3.5 py-1 text-xs',
    md: 'px-4 py-2 text-sm'
  };
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4'
  };
  
  const statusConfig = {
    'Fresh': {
      bg: 'bg-green-50',
      text: 'text-green-800',
      border: 'border-green-200',
      icon: CheckCircle
    },
    'Expiring Soon': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800', 
      border: 'border-yellow-200',
      icon: AlertTriangle
    },
    'Expired': {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      icon: XCircle
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span 
      className={`
        inline-flex items-center gap-1 rounded-full font-medium border
        ${config.bg} ${config.text} ${config.border}
        ${sizeClasses[size]}
      `}
      role="status"
      aria-label={`Status: ${status}`}
    >
      <Icon className={iconSizes[size]} aria-hidden="true" />
      <span>{status}</span>
    </span>
  );
}