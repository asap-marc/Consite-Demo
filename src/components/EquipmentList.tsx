'use client';

import { IEquipmentLog } from '@/types';

export default function EquipmentList({ equipmentLogs }: { equipmentLogs: IEquipmentLog[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Submitted Equipment Logs</h2>
      <ul className="space-y-4">
        {equipmentLogs.map((log) => (
          <li key={log._id} className="p-4 border rounded-md shadow-sm bg-white">
            <p><strong>Equipment:</strong> {log.equipmentName}</p>
            <p><strong>Date:</strong> {new Date(log.date).toLocaleDateString()}</p>
            <p><strong>Total Hours on Machine:</strong> {log.totalHours}</p>
            <p><strong>Hours Run Today:</strong> {log.runHours}</p>
            {log.notes && <p><strong>Notes:</strong> {log.notes}</p>}
            <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                log.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>{log.status}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
