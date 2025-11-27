'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { ITimeCard, IEquipmentLog, IMaterialLog, Log, Status } from '@/types';

// Dummy data for the initial state
const initialTimeCards: ITimeCard[] = [
  {
    _id: '1',
    employeeName: 'Paving Crew 1',
    date: new Date('2024-07-25'),
    regularHours: 8,
    overtimeHours: 0,
    jobName: 'Deerfoot Trail Overlay',
    status: 'Approved',
  },
  {
    _id: '2',
    employeeName: 'Milling Crew 2',
    date: new Date('2024-07-25'),
    regularHours: 8,
    overtimeHours: 1.5,
    jobName: 'Crowchild Interchange Rehab',
    status: 'Pending',
  },
];

const initialEquipmentLogs: IEquipmentLog[] = [
    {
        _id: 'eq-1',
        equipmentName: 'Paver 1',
        date: new Date('2024-07-25'),
        totalHours: 1234,
        runHours: 8,
        status: 'Approved',
    }
]

const initialMaterialLogs: IMaterialLog[] = [
    {
        _id: 'mat-1',
        date: new Date('2024-07-25'),
        category: 'Asphalt',
        subcategory: 'City A',
        supplier: 'Lafarge',
        unitOfMeasure: 'tonnes',
        quantity: 100,
        status: 'Approved',
    }
]


interface IAppContext {
  timeCards: ITimeCard[];
  equipmentLogs: IEquipmentLog[];
  materialLogs: IMaterialLog[];
  addTimeCard: (newTimeCard: Omit<ITimeCard, '_id'>) => void;
  addEquipmentLog: (newEquipmentLog: Omit<IEquipmentLog, '_id'>) => void;
  addMaterialLog: (newMaterialLog: Omit<IMaterialLog, '_id'>) => void;
  updateLog: (updatedLog: Log) => void;
  updateLogStatus: (logId: string, newStatus: Status) => void;
}

const AppContext = createContext<IAppContext | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [timeCards, setTimeCards] = useState<ITimeCard[]>(initialTimeCards);
  const [equipmentLogs, setEquipmentLogs] = useState<IEquipmentLog[]>(initialEquipmentLogs);
  const [materialLogs, setMaterialLogs] = useState<IMaterialLog[]>(initialMaterialLogs);

  const addTimeCard = (newTimeCard: Omit<ITimeCard, '_id'>) => {
    const timeCardWithId: ITimeCard = {
      ...newTimeCard,
      _id: `tc-${new Date().getTime()}`,
    };
    setTimeCards((prev) => [...prev, timeCardWithId]);
  };

  const addEquipmentLog = (newEquipmentLog: Omit<IEquipmentLog, '_id'>) => {
    const equipmentLogWithId: IEquipmentLog = {
      ...newEquipmentLog,
      _id: `eq-${new Date().getTime()}`,
    };
    setEquipmentLogs((prev) => [...prev, equipmentLogWithId]);
  };

  const addMaterialLog = (newMaterialLog: Omit<IMaterialLog, '_id'>) => {
    const materialLogWithId: IMaterialLog = {
      ...newMaterialLog,
      _id: `ma-${new Date().getTime()}`,
    };
    setMaterialLogs((prev) => [...prev, materialLogWithId]);
  };

  const updateLog = (updatedLog: Log) => {
    if ('employeeName' in updatedLog) {
      setTimeCards(prev => prev.map(log => log._id === updatedLog._id ? updatedLog : log));
    } else if ('equipmentName' in updatedLog) {
      setEquipmentLogs(prev => prev.map(log => log._id === updatedLog._id ? updatedLog : log));
    } else if ('category' in updatedLog) {
      setMaterialLogs(prev => prev.map(log => log._id === updatedLog._id ? updatedLog : log));
    }
  };

  const updateLogStatus = (logId: string, newStatus: Status) => {
    setTimeCards((prev) =>
      prev.map((log) => (log._id === logId ? { ...log, status: newStatus } : log))
    );
    setEquipmentLogs((prev) =>
      prev.map((log) => (log._id === logId ? { ...log, status: newStatus } : log))
    );
    setMaterialLogs((prev) =>
      prev.map((log) => (log._id === logId ? { ...log, status: newStatus } : log))
    );
  };

  const value = {
    timeCards,
    equipmentLogs,
    materialLogs,
    addTimeCard,
    addEquipmentLog,
    addMaterialLog,
    updateLog,
    updateLogStatus,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
