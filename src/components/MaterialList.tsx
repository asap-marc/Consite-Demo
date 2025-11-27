'use client';

import { IMaterialLog } from '@/types';

export default function MaterialList({ materialLogs }: { materialLogs: IMaterialLog[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Submitted Material Logs</h2>
      <ul className="space-y-4">
        {materialLogs.map((log) => (
          <li key={log._id} className="p-4 border rounded-md shadow-sm bg-white">
            <p><strong>Date:</strong> {new Date(log.date).toLocaleDateString()}</p>
            <p><strong>Category:</strong> {log.category}</p>
            <p><strong>Subcategory:</strong> {log.subcategory}</p>
            <p><strong>Supplier:</strong> {log.supplier}</p>
            <p><strong>Quantity:</strong> {log.quantity} {log.unitOfMeasure}</p>
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
