export type Status = 'Pending' | 'Approved';

export interface ITimeCard {
  _id: string;
  employeeName: string;
  date: Date;
  regularHours: number;
  overtimeHours: number;
  jobName: string;
  status: Status;
  notes?: string;
}

export interface IEquipmentLog {
  _id: string;
  equipmentName: string;
  date: Date;
  totalHours: number;
  runHours: number;
  notes?: string;
  status: Status;
}

export interface IMaterialLog {
  _id: string;
  date: Date;
  category: string;
  subcategory: string;
  supplier: string;
  unitOfMeasure: 'tonnes' | 'cubic yards';
  quantity: number;
  notes?: string;
  status: Status;
}

export type Log = ITimeCard | IEquipmentLog | IMaterialLog;
