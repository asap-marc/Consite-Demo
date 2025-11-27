'use client';

import EquipmentForm from '@/components/EquipmentForm';
import EquipmentList from '@/components/EquipmentList';
import { useAppContext } from '@/context/AppContext';

export default function EquipmentPage() {
  const { equipmentLogs, addEquipmentLog } = useAppContext();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Equipment Hours Tracker</h1>
      <EquipmentForm onEquipmentLogSubmit={addEquipmentLog} />
      <EquipmentList equipmentLogs={equipmentLogs} />
    </div>
  );
}
