import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import type { ItemWithStatus, ItemFormData, FreezerLocation } from '../types';
import { FREEZER_LOCATIONS } from '../lib/constants';
import Button from './ui/Button';
import Input from './ui/Input';
import CustomSelect from './ui/CustomSelect';
import Modal from './ui/Modal';

interface ItemFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ItemFormData) => Promise<void>;
  editItem?: ItemWithStatus;
}

export default function ItemForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editItem 
}: ItemFormProps) {
  const [formData, setFormData] = useState<ItemFormData>({
    name: '',
    quantity: 1,
    location: 'Top Drawer' as FreezerLocation,
    expiresOn: new Date(),
    notes: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ItemFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with edit data or reset
  useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          name: editItem.name,
          quantity: editItem.quantity,
          location: editItem.location,
          expiresOn: editItem.expiresOn,
          notes: editItem.notes || ''
        });
      } else {
        setFormData({
          name: '',
          quantity: 1,
          location: 'Top Drawer' as FreezerLocation,
          expiresOn: new Date(),
          notes: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, editItem]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ItemFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    }

    if (!formData.expiresOn) {
      newErrors.expiresOn = 'Expiration date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to save item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ItemFormData, value: string | number | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const locationOptions = FREEZER_LOCATIONS.map(location => ({
    value: location,
    label: location
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editItem ? 'Edit Item' : 'Add New Item'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Item Name *"
          type="text"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="Frozen Chicken Breast"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Quantity *"
            type="number"
            min="1"
            value={formData.quantity.toString()}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
            error={errors.quantity}
          />

          <CustomSelect
            label="Location *"
            value={formData.location}
            onChange={(value) => handleInputChange('location', value as FreezerLocation)}
            options={locationOptions}
            error={errors.location}
          />
        </div>

        <Input
          label="Expiration Date *"
          type="date"
          value={format(formData.expiresOn, 'yyyy-MM-dd')}
          onChange={(e) => handleInputChange('expiresOn', new Date(e.target.value))}
          error={errors.expiresOn}
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-slate-700">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Optional notes about the item..."
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 placeholder:text-slate-400"
          />
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Saving...' : editItem ? 'Update Item' : 'Add Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}