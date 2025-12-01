'use client';

import { useState, useEffect } from 'react';
import { IEquipmentLog } from '@/types';
import Notification from './Notification';
import SearchableSelect from './SearchableSelect';

const equipmentOptions = [
  { value: 'Paver 1', label: 'Paver 1' },
  { value: 'Paver 2', label: 'Paver 2' },
  { value: 'Milling Machine', label: 'Milling Machine' },
  { value: 'Extruder', label: 'Extruder' },
];

interface EquipmentFormProps {
  onEquipmentLogSubmit: (newLog: Omit<IEquipmentLog, '_id'>) => void;
  initialData?: IEquipmentLog;
  onSave?: (updatedLog: IEquipmentLog) => void;
  onCancel?: () => void;
}

export default function EquipmentForm({ onEquipmentLogSubmit, initialData, onSave, onCancel }: EquipmentFormProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [equipment, setEquipment] = useState<{ value: string; label: string } | null>(null);
  const [date, setDate] = useState(formatDate(new Date()));
  const [totalHours, setTotalHours] = useState<number | string>('');
  const [runHours, setRunHours] = useState<number | string>('');
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (initialData) {
      setEquipment({ value: initialData.equipmentName, label: initialData.equipmentName });
      setDate(formatDate(initialData.date));
      setTotalHours(initialData.totalHours);
      setRunHours(initialData.runHours);
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!equipment || !date) {
      setNotification({ message: 'Equipment and Date are required', type: 'error' });
      return;
    }

    const payload = {
      equipmentName: equipment.value,
      date: new Date(date),
      totalHours: Number(totalHours),
      runHours: Number(runHours),
      notes,
    };

    if (initialData && onSave) {
      onSave({ ...initialData, ...payload });
      setNotification({ message: 'Equipment log updated successfully!', type: 'success' });
    } else {
      onEquipmentLogSubmit({ ...payload, status: 'Pending' });
      setNotification({ message: 'Equipment log submitted successfully!', type: 'success' });
      // Reset form
      setEquipment(null);
      setDate(formatDate(new Date()));
      setTotalHours('');
      setRunHours('');
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
              <label htmlFor="equipmentName" className="block text-sm font-medium text-gray-700">
                Equipment <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={equipmentOptions}
                value={equipment}
                onChange={setEquipment}
                placeholder="Select Equipment"
              />
            </div>
            <div>
              <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700">
                Total hours on machine
              </label>
              <input
                type="number"
                id="totalHours"
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
                className="mt-1 block w-full border-gray-300 shadow-sm rounded-md"
                inputMode="numeric"
              />
            </div>
            <div>
              <label htmlFor="runHours" className="block text-sm font-medium text-gray-700">
                Hours run today
              </label>
              <input
                type="number"
                id="runHours"
                value={runHours}
                onChange={(e) => setRunHours(e.target.value)}
                className="mt-1 block w-full border-gray-300 shadow-sm rounded-md"
                inputMode="decimal"
                step="0.25"
              />
            </div>
            <p className="md:col-span-2 text-sm text-gray-500">You can fill in one or both.</p>
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
