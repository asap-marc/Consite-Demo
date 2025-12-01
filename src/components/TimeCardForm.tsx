'use client';

import { useState, useEffect } from 'react';
import { ITimeCard } from '@/types';
import Notification from './Notification';
import SearchableSelect from './SearchableSelect';

const employeeOptions = [
  { value: 'Paving Crew 1', label: 'Paving Crew 1' },
  { value: 'Paving Crew 2', label: 'Paving Crew 2' },
  { value: 'Milling Crew 1', label: 'Milling Crew 1' },
  { value: 'Milling Crew 2', label: 'Milling Crew 2' },
  { value: 'Katniss Everdeen', label: 'Katniss Everdeen' },
  { value: 'Peeta Mellark', label: 'Peeta Mellark' },
  { value: 'Gale Hawthorne', label: 'Gale Hawthorne' },
  { value: 'Finnick Odair', label: 'Finnick Odair' },
  { value: 'Johanna Mason', label: 'Johanna Mason' },
];

const jobOptions = [
  { value: 'Deerfoot Trail Overlay', label: 'Deerfoot Trail Overlay' },
  { value: 'Crowchild Interchange Rehab', label: 'Crowchild Interchange Rehab' },
  { value: 'Stoney NW Widening', label: 'Stoney NW Widening' },
  { value: '17 Ave SW Streetscape', label: '17 Ave SW Streetscape' },
  { value: 'Foothills Industrial Pad', label: 'Foothills Industrial Pad' },
];

interface TimeCardFormProps {
  onTimeCardSubmit: (newTimeCard: Omit<ITimeCard, '_id'>) => void;
  initialData?: ITimeCard;
  onSave?: (updatedTimeCard: ITimeCard) => void;
  onCancel?: () => void;
}

export default function TimeCardForm({ onTimeCardSubmit, initialData, onSave, onCancel }: TimeCardFormProps) {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [employee, setEmployee] = useState<{ value: string; label: string } | null>(null);
  const [date, setDate] = useState(formatDate(new Date()));
  const [regularHours, setRegularHours] = useState<number | string>(8);
  const [overtimeHours, setOvertimeHours] = useState<number | string>(0);
  const [job, setJob] = useState<{ value: string; label: string } | null>(null);
  const [notes, setNotes] = useState('');
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (initialData) {
      setEmployee({ value: initialData.employeeName, label: initialData.employeeName });
      setDate(formatDate(initialData.date));
      setRegularHours(initialData.regularHours);
      setOvertimeHours(initialData.overtimeHours);
      setJob({ value: initialData.jobName, label: initialData.jobName });
      setNotes(initialData.notes || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!employee || !date || !job) {
      setNotification({ message: 'Employee, Date, and Job are required', type: 'error' });
      return;
    }

    const payload = {
      employeeName: employee.value,
      date: new Date(date),
      regularHours: Number(regularHours),
      overtimeHours: Number(overtimeHours),
      jobName: job.value,
      notes,
    };

    if (initialData && onSave) {
      onSave({ ...initialData, ...payload });
      setNotification({ message: 'Time card updated successfully!', type: 'success' });
    } else {
      onTimeCardSubmit({ ...payload, status: 'Pending' });
      setNotification({ message: 'Time card submitted successfully!', type: 'success' });
      // Reset form
      setEmployee(null);
      setDate(formatDate(new Date()));
      setRegularHours(8);
      setOvertimeHours(0);
      setJob(null);
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
              <label htmlFor="employeeName" className="block text-sm font-medium text-gray-700">
                Employee Name <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={employeeOptions}
                value={employee}
                onChange={setEmployee}
                placeholder="Select Employee"
              />
            </div>
            <div>
              <label htmlFor="regularHours" className="block text-sm font-medium text-gray-700">
                Regular Hours <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="regularHours"
                value={regularHours}
                onChange={(e) => setRegularHours(e.target.value)}
                className="mt-1 block w-full border-gray-300 shadow-sm rounded-md"
                inputMode="decimal"
                step="0.25"
              />
            </div>
            <div>
              <label htmlFor="overtimeHours" className="block text-sm font-medium text-gray-700">
                Overtime Hours
              </label>
              <input
                type="number"
                id="overtimeHours"
                value={overtimeHours}
                onChange={(e) => setOvertimeHours(e.target.value)}
                className="mt-1 block w-full border-gray-300 shadow-sm rounded-md"
                inputMode="decimal"
                step="0.25"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="jobName" className="block text-sm font-medium text-gray-700">
                Job Name <span className="text-red-500">*</span>
              </label>
              <SearchableSelect
                options={jobOptions}
                value={job}
                onChange={setJob}
                placeholder="Select Job"
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
