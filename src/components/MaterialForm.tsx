'use client';

import { useState, useEffect } from 'react';
import { IMaterialLog } from '@/types';
import Notification from './Notification';
import SearchableSelect from './SearchableSelect';

const materialCategories = {
  Asphalt: ['City A', 'City B', 'City C', 'Comm B'],
  Gravel: ['25mm GBC', '80mm GBC', '40mm drain', '20mm drain'],
  Concrete: ['Type 1', 'Type 2'],
};

const categoryOptions = Object.keys(materialCategories).map((cat) => ({ value: cat, label: cat }));

const supplierOptions = [
    { value: 'Lafarge', label: 'Lafarge' },
    { value: 'Burnco', label: 'Burnco' },
    { value: 'Hillstone', label: 'Hillstone' },
    { value: 'Sarcee', label: 'Sarcee' },
    { value: 'Other', label: 'Other' },
];

const unitOfMeasureOptions = [
    { value: 'tonnes', label: 'tonnes' },
    { value: 'cubic yards', label: 'cubic yards' },
];

interface MaterialFormProps {
  onMaterialLogSubmit: (newLog: Omit<IMaterialLog, '_id'>) => void;
  initialData?: IMaterialLog;
  onSave?: (updatedLog: IMaterialLog) => void;
  onCancel?: () => void;
}

export default function MaterialForm({ onMaterialLogSubmit, initialData, onSave, onCancel }: MaterialFormProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [date, setDate] = useState(formatDate(new Date()));
  const [category, setCategory] = useState<{ value: string; label: string } | null>(null);
  const [subcategory, setSubcategory] = useState<{ value: string; label: string } | null>(null);
  const [subcategoryOptions, setSubcategoryOptions] = useState<{ value: string; label: string }[]>([]);
  const [supplier, setSupplier] = useState<{ value: string; label: string } | null>(null);
  const [unitOfMeasure, setUnitOfMeasure] = useState<{ value: 'tonnes' | 'cubic yards'; label: string } | null>(null);
  const [quantity, setQuantity] = useState<number | string>('');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (category) {
      setSubcategoryOptions(
        materialCategories[category.value as keyof typeof materialCategories].map((sub) => ({
          value: sub,
          label: sub,
        }))
      );
    } else {
      setSubcategoryOptions([]);
    }
    if (!initialData || (initialData && category?.value !== initialData.category)) {
        setSubcategory(null);
    }
  }, [category, initialData]);

  useEffect(() => {
    if (initialData) {
        const cat = { value: initialData.category, label: initialData.category };
      setCategory(cat);
      setDate(formatDate(initialData.date));
      setSubcategory({ value: initialData.subcategory, label: initialData.subcategory });
      setSupplier({ value: initialData.supplier, label: initialData.supplier });
      setUnitOfMeasure({ value: initialData.unitOfMeasure, label: initialData.unitOfMeasure });
      setQuantity(initialData.quantity);
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!category || !subcategory || !date || !supplier || !unitOfMeasure || !quantity) {
      setNotification({ message: 'All fields with * are required', type: 'error' });
      return;
    }

    const payload = {
        date: new Date(date),
        category: category.value,
        subcategory: subcategory.value,
        supplier: supplier.value,
        unitOfMeasure: unitOfMeasure.value,
        quantity: Number(quantity),
        notes,
    };

    if (initialData && onSave) {
        onSave({ ...initialData, ...payload });
        setNotification({ message: 'Material log updated successfully!', type: 'success' });
    } else {
        onMaterialLogSubmit({ ...payload, status: 'Pending' });
        setNotification({ message: 'Material log submitted successfully!', type: 'success' });
        // Reset form
        setDate(formatDate(new Date()));
        setCategory(null);
        setSubcategory(null);
        setSupplier(null);
        setUnitOfMeasure(null);
        setQuantity('');
        setNotes('');
    }
  };

  return (
    <div className="card">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-auto border-gray-300 shadow-sm rounded-md"
              />
            </div>
            <div>
                <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                    Supplier <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                    options={supplierOptions}
                    value={supplier}
                    onChange={setSupplier}
                    placeholder="Select Supplier"
                />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={categoryOptions}
                value={category}
                onChange={setCategory}
                placeholder="Select Category"
              />
            </div>
            <div>
              <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
                Subcategory <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={subcategoryOptions}
                value={subcategory}
                onChange={setSubcategory}
                placeholder="Select Subcategory"
                isDisabled={!category}
              />
            </div>
            <div>
                <label htmlFor="unitOfMeasure" className="block text-sm font-medium text-gray-700">
                    Unit of measure <span className="text-red-500">*</span>
                </label>
                <SearchableSelect
                    options={unitOfMeasureOptions}
                    value={unitOfMeasure}
                    onChange={setUnitOfMeasure}
                    placeholder="Select Unit"
                />
            </div>
            <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Number of units <span className="text-red-500">*</span>
                </label>
                <input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="mt-1 block w-full border-gray-300 shadow-sm rounded-md"
                    inputMode="numeric"
                />
            </div>
            <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Notes
                </label>
                <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 shadow-sm rounded-md"
                />
            </div>
        </div>
        
        <div className="flex justify-between">
            {onCancel && (
                <button
                    type="button"
                    onClick={onCancel}
                    className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancel
                </button>
            )}
            <div/>
            <button
                type="submit"
                className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600"
            >
              {initialData ? 'Save Changes' : 'Submit'}
            </button>
        </div>
      </form>
    </div>
  );
}
