import React from 'react';
import { MachineData } from '../types';

interface MachineSelectorProps {
  machines: MachineData[];
  selectedMachineId: string | null;
  onMachineSelected: (machineId: string) => void;
  disabled?: boolean;
}

export const MachineSelector: React.FC<MachineSelectorProps> = ({ machines, selectedMachineId, onMachineSelected, disabled }) => {
  if (machines.length === 0) {
    return <p className="text-slate-400">Upload a file to see machine options.</p>;
  }

  return (
    <div className="space-y-2">
      <label htmlFor="machine-select" className="block text-sm font-medium text-brand-primary">
        Select Machine ID:
      </label>
      <select
        id="machine-select"
        value={selectedMachineId || ''}
        onChange={(e) => onMachineSelected(e.target.value)}
        disabled={disabled || machines.length === 0}
        className="mt-1 block w-full py-3 px-4 border border-slate-600 bg-slate-700 text-slate-100 rounded-md shadow-sm 
                   focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary 
                   sm:text-sm disabled:bg-slate-600 disabled:text-slate-400 disabled:border-slate-500 disabled:shadow-none
                   transition-colors"
        aria-label="Select a machine to analyze"
      >
        <option value="" disabled className="text-slate-400">-- Select a machine --</option>
        {machines.map((machine) => (
          <option key={machine.machineId} value={machine.machineId} className="text-slate-100 bg-slate-700">
            {machine.machineId}
          </option>
        ))}
      </select>
    </div>
  );
};