'use client';

import { ITimeCard } from '@/types';

export default function TimeCardList({ timeCards }: { timeCards: ITimeCard[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Submitted Time Cards</h2>
      <ul className="space-y-4">
        {timeCards.map((card) => (
          <li key={card._id} className="p-4 border rounded-md shadow-sm bg-white">
            <p><strong>Employee:</strong> {card.employeeName}</p>
            <p><strong>Date:</strong> {new Date(card.date).toLocaleDateString()}</p>
            <p><strong>Regular Hours:</strong> {card.regularHours}</p>
            <p><strong>Overtime Hours:</strong> {card.overtimeHours}</p>
            <p><strong>Job:</strong> {card.jobName}</p>
            {card.notes && <p><strong>Notes:</strong> {card.notes}</p>}
            <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                card.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>{card.status}</span></p>
          </li>
        ))}
      </ul>
    </div>
  );
}
