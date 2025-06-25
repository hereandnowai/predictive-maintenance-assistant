
export type VibrationLevel = 'Low' | 'Medium' | 'High';

export interface MachineData {
  // Original headers for user reference, actual keys used internally are mapped
  // 'Machine ID': string;
  // 'Temperature (°C)': number;
  // 'Vibration Level': VibrationLevel;
  // 'Pressure (bar)': number;
  // 'Operating Hours': number;
  // 'Last Maintenance (days ago)': number;
  // 'Error Logs': string;

  // Internal keys after parsing and mapping
  machineId: string;
  temperature: number;
  vibrationLevel: VibrationLevel;
  pressure: number;
  operatingHours: number;
  lastMaintenanceDays: number;
  errorLogs: string;
  // To allow for extra columns that might exist in the file but are not used
  [key: string]: any; 
}

export interface MaintenancePrediction {
  'Maintenance Required': 'Yes' | 'No';
  'Reason': string;
  'Suggested Action': string;
  'Urgency Level': 'Low' | 'Medium' | 'High';
}

// For parsing raw data from sheet_to_json
export interface RawMachineDataRow {
  'Machine ID'?: string | number;
  'Temperature (°C)'?: string | number;
  'Vibration Level'?: string;
  'Pressure (bar)'?: string | number;
  'Operating Hours'?: string | number;
  'Last Maintenance (days ago)'?: string | number;
  'Error Logs'?: string;
  [key: string]: any; // To accommodate any other columns
}
    