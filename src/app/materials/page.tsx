'use client';

import MaterialForm from '@/components/MaterialForm';
import MaterialList from '@/components/MaterialList';
import { useAppContext } from '@/context/AppContext';

export default function MaterialsPage() {
  const { materialLogs, addMaterialLog } = useAppContext();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Material Tracking</h1>
      <MaterialForm onMaterialLogSubmit={addMaterialLog} />
      <MaterialList materialLogs={materialLogs} />
    </div>
  );
}
