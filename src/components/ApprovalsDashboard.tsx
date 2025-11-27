'use client';

import { useState, useMemo } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Log, ITimeCard, IEquipmentLog, IMaterialLog } from '@/types';
import Modal from './Modal';
import TimeCardForm from './TimeCardForm';
import EquipmentForm from './EquipmentForm';
import MaterialForm from './MaterialForm';

export default function ApprovalsDashboard() {
  const { timeCards, equipmentLogs, materialLogs, updateLog, updateLogStatus, addTimeCard, addEquipmentLog, addMaterialLog } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  // Combine all logs into a single array
  const allLogs: Log[] = useMemo(() => {
    return [...timeCards, ...equipmentLogs, ...materialLogs];
  }, [timeCards, equipmentLogs, materialLogs]);

  // Filters state
  const [employeeFilter, setEmployeeFilter] = useState('');
  const [jobFilter, setJobFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Apply filters
  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      const employeeName = 'employeeName' in log ? log.employeeName : '';
      const jobName = 'jobName' in log ? log.jobName : '';
      const equipmentName = 'equipmentName' in log ? log.equipmentName : '';
      const category = 'category' in log ? log.category : '';
      
      const logDate = new Date(log.date).toISOString().split('T')[0];

      if (employeeFilter && !employeeName.toLowerCase().includes(employeeFilter.toLowerCase()) && !equipmentName.toLowerCase().includes(employeeFilter.toLowerCase())) return false;
      if (jobFilter && !jobName.toLowerCase().includes(jobFilter.toLowerCase()) && !category.toLowerCase().includes(jobFilter.toLowerCase())) return false;
      if (dateFilter && logDate !== dateFilter) return false;
      if (statusFilter && log.status !== statusFilter) return false;

      return true;
    });
  }, [allLogs, employeeFilter, jobFilter, dateFilter, statusFilter]);

  const handleEdit = (log: Log) => {
    setSelectedLog(log);
    setIsModalOpen(true);
  };
  
  const handleSave = (updatedLog: Log) => {
    updateLog(updatedLog);
    setIsModalOpen(false);
    setSelectedLog(null);
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedLog(null);
  }

  const renderModalContent = () => {
    if (!selectedLog) return null;

    if ('employeeName' in selectedLog) {
      return <TimeCardForm onTimeCardSubmit={addTimeCard} initialData={selectedLog} onSave={(updatedLog) => handleSave(updatedLog as Log)} onCancel={handleCancel} />;
    }
    if ('equipmentName' in selectedLog) {
      return <EquipmentForm onEquipmentLogSubmit={addEquipmentLog} initialData={selectedLog} onSave={(updatedLog) => handleSave(updatedLog as Log)} onCancel={handleCancel} />;
    }
    if ('category' in selectedLog) {
        return <MaterialForm onMaterialLogSubmit={addMaterialLog} initialData={selectedLog} onSave={(updatedLog) => handleSave(updatedLog as Log)} onCancel={handleCancel} />;
    }
    return null;
  }

  const renderLogRow = (log: Log, index: number) => {
    const isTimeCard = (l: Log): l is ITimeCard => 'employeeName' in l;
    const isEquipmentLog = (l: Log): l is IEquipmentLog => 'equipmentName' in l;
    const isMaterialLog = (l: Log): l is IMaterialLog => 'category' in l;
    
    const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-50';

    let type, primary, secondary, tertiary, notes;

    if (isTimeCard(log)) {
      type = 'Employee Time';
      primary = log.employeeName;
      secondary = log.jobName;
      tertiary = `${log.regularHours} Reg / ${log.overtimeHours} OT`;
      notes = log.notes;
    } else if (isEquipmentLog(log)) {
      type = 'Equipment';
      primary = log.equipmentName;
      secondary = `Total: ${log.totalHours}hrs`;
      tertiary = `Run: ${log.runHours}hrs`;
      notes = log.notes;
    } else if (isMaterialLog(log)) {
      type = 'Material';
      primary = `${log.category} (${log.subcategory})`;
      secondary = log.supplier;
      tertiary = `${log.quantity} ${log.unitOfMeasure}`;
      notes = log.notes;
    }

    return (
      <tr key={log._id} className={`${rowClass} hover:bg-gray-100`}>
        <td className="p-3">{type}</td>
        <td className="p-3">{primary}</td>
        <td className="p-3">{secondary}</td>
        <td className="p-3">{tertiary}</td>
        <td className="p-3">{new Date(log.date).toLocaleDateString()}</td>
        <td className="p-3">{notes || 'N/A'}</td>
        <td className="p-3">
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                log.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>{log.status}</span>
        </td>
        <td className="p-3 text-right">
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => handleEdit(log)}
              className="py-1 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Edit
            </button>
            {log.status === 'Pending' && (
              <button
                onClick={() => updateLogStatus(log._id, 'Approved')}
                className="py-1 px-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-500 hover:bg-emerald-600"
              >
                Approve
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };
  
  return (
    <div className="card">
        {/* Filter UI */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input type="text" placeholder="Filter by Employee/Equipment..." value={employeeFilter} onChange={e => setEmployeeFilter(e.target.value)} className="w-full border-gray-300 shadow-sm rounded-md" />
            <input type="text" placeholder="Filter by Job/Material..." value={jobFilter} onChange={e => setJobFilter(e.target.value)} className="w-full border-gray-300 shadow-sm rounded-md" />
            <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} className="w-auto border-gray-300 shadow-sm rounded-md" />
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="w-full border-gray-300 shadow-sm rounded-md">
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
            </select>
        </div>
        
        {/* Table */}
        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 font-semibold">Type</th>
                        <th className="p-3 font-semibold">Primary</th>
                        <th className="p-3 font-semibold">Secondary</th>
                        <th className="p-3 font-semibold">Tertiary</th>
                        <th className="p-3 font-semibold">Date</th>
                        <th className="p-3 font-semibold">Notes</th>
                        <th className="p-3 font-semibold">Status</th>
                        <th className="p-3 font-semibold text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.map((log, index) => renderLogRow(log, index))}
                </tbody>
            </table>
        </div>
        
        <Modal isOpen={isModalOpen} onClose={handleCancel} title="Edit Log Entry">
            {renderModalContent()}
        </Modal>
    </div>
  );
}
