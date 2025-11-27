'use client';

import TimeCardForm from '@/components/TimeCardForm';
import TimeCardList from '@/components/TimeCardList';
import { useAppContext } from '@/context/AppContext';

export default function HomePage() {
  const { timeCards, addTimeCard } = useAppContext();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employee Time Card Entry</h1>
      <TimeCardForm onTimeCardSubmit={addTimeCard} />
      <TimeCardList timeCards={timeCards} />
    </div>
  );
}
