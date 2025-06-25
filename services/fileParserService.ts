
import { MachineData, RawMachineDataRow, VibrationLevel } from '../types';

// Make XLSX available from global scope (loaded via CDN)
declare var XLSX: any;

// Helper function to normalize header strings for comparison
// Converts to lowercase and removes all non-alphanumeric characters
const normalizeHeader = (header: string | undefined): string => {
  if (!header) return '';
  return header.toString().toLowerCase().replace(/[^a-z0-9]/gi, '');
};

// Configuration for each expected field in MachineData
// - internalKey: The key used in the MachineData object.
// - aliases: A list of common header names found in uploaded files for this field. The first is preferred for error messages.
// - required: Whether this field must be present and parseable.
// - parser: A function to parse and validate the raw value. Returns undefined if parsing fails for a required type.
const FIELD_CONFIGS: {
    internalKey: keyof MachineData;
    aliases: string[];
    required: boolean;
    parser: (value: any, fieldNameForErrorMsg?: string) => any;
}[] = [
    { 
        internalKey: 'machineId', 
        aliases: ['Machine ID', 'Machine_ID', 'ID', 'Asset ID'], 
        required: true, 
        parser: (v) => {
            const val = v?.toString().trim();
            return val || undefined; // Must not be empty
        } 
    },
    { 
        internalKey: 'temperature', 
        aliases: ['Temperature (°C)', 'Temperature(°C)', 'Temp C', 'Temperature C', 'Temperature_C', 'Temperature'], 
        required: true, 
        parser: (v) => {
            const val = parseFloat(v?.toString().trim());
            return !isNaN(val) ? val : undefined;
        }
    },
    { 
        internalKey: 'vibrationLevel', 
        aliases: ['Vibration Level', 'Vibration_Level', 'Vibration'], 
        required: true, 
        parser: (v) => {
            const valStr = v?.toString().trim().toLowerCase();
            if (valStr === 'low') return 'Low' as VibrationLevel;
            if (valStr === 'medium') return 'Medium' as VibrationLevel;
            if (valStr === 'high') return 'High' as VibrationLevel;
            return undefined; // Invalid vibration level
        }
    },
    { 
        internalKey: 'pressure', 
        aliases: ['Pressure (bar)', 'Pressure(bar)', 'Pressure bar', 'Pressure_bar', 'Pressure'], 
        required: true, 
        parser: (v) => {
            const val = parseFloat(v?.toString().trim());
            return !isNaN(val) ? val : undefined;
        } 
    },
    { 
        internalKey: 'operatingHours', 
        aliases: ['Operating Hours', 'Operating_Hours', 'Op Hours', 'Total Hours'], 
        required: true, 
        parser: (v) => {
            const val = parseInt(v?.toString().trim(), 10);
            return !isNaN(val) ? val : undefined;
        }
    },
    { 
        internalKey: 'lastMaintenanceDays', 
        aliases: [
            'Last Maintenance (days ago)', 
            'Last_Maintenance_Days', 
            'Last Maintenance Days', 
            'Days Since Last Maintenance',
            'Last Maintenance Days Ago'
        ], 
        required: true, 
        parser: (v) => {
            const val = parseInt(v?.toString().trim(), 10);
            return !isNaN(val) ? val : undefined;
        }
    },
    { 
        internalKey: 'errorLogs', 
        aliases: ['Error Logs', 'Error_Logs', 'Logs', 'Errors', 'Faults'], 
        required: false, // Not strictly required, defaults to "None"
        parser: (v) => v?.toString().trim() || 'None' 
    },
];

// Function to find the value for a field using its aliases from a raw data row
const findValueByNormalizedAliases = (rawRow: RawMachineDataRow, aliases: string[]): { value: any, foundKey: string | undefined }=> {
    const rawRowKeys = Object.keys(rawRow);
    const normalizedFileHeaders = rawRowKeys.map(k => ({ original: k, normalized: normalizeHeader(k) }));

    for (const alias of aliases) {
        const normalizedAlias = normalizeHeader(alias);
        const foundHeader = normalizedFileHeaders.find(fh => fh.normalized === normalizedAlias);
        if (foundHeader) {
            return { value: rawRow[foundHeader.original], foundKey: foundHeader.original };
        }
    }
    return { value: undefined, foundKey: undefined };
};

const mapRawDataToMachineData = (rawRow: RawMachineDataRow, rowIndex: number, allFileHeaders: string[]): MachineData | null => {
  const machineEntry: Partial<MachineData> = {};
  let criticalError = false;

  // Process configured fields
  const processedRawKeys = new Set<string>();
  for (const config of FIELD_CONFIGS) {
    const { value, foundKey } = findValueByNormalizedAliases(rawRow, config.aliases);
    if (foundKey) processedRawKeys.add(foundKey);

    const parsedValue = config.parser(value, config.aliases[0]);

    if (config.required && parsedValue === undefined) {
      // Handles missing required value, or parser returning undefined for invalid type/format
      console.warn(`Row ${rowIndex + 1}: Required field "${config.aliases[0]}" (for internal key "${config.internalKey}") is missing, empty, or has an invalid format (raw value: "${value}"). Skipping row.`);
      criticalError = true;
      break;
    }
    machineEntry[config.internalKey] = parsedValue;
  }

  if (criticalError) return null;
  
  // Ensure 'errorLogs' has a default if it was optional and not found/parsed
  if (machineEntry.errorLogs === undefined) {
      machineEntry.errorLogs = FIELD_CONFIGS.find(fc => fc.internalKey === 'errorLogs')?.parser(undefined) as string;
  }

  // Add any extra columns from rawRow that were not part of FIELD_CONFIGS
  for(const rawKey of Object.keys(rawRow)){
      if(!processedRawKeys.has(rawKey)){
          // Check if this rawKey, when normalized, doesn't match any known alias for any field
          // to avoid re-adding a known field that might have had a slightly different original casing.
          // This simplified logic assumes that if it wasn't in processedRawKeys, it's an extra column.
          (machineEntry as any)[rawKey] = rawRow[rawKey];
      }
  }
  
  return machineEntry as MachineData;
};

const validateHeaders = (headersInFile: string[]): void => {
    const normalizedHeadersFromFile = headersInFile.map(h => normalizeHeader(h.toString()));
    const missingRequiredFields: string[] = [];

    for (const config of FIELD_CONFIGS) {
        if (config.required) {
            const found = config.aliases.some(alias => normalizedHeadersFromFile.includes(normalizeHeader(alias)));
            if (!found) {
                missingRequiredFields.push(config.aliases[0]); // Use the preferred name for the error message
            }
        }
    }

    if (missingRequiredFields.length > 0) {
        throw new Error(`File is missing required data columns (or uses unrecognized names). Could not find: ${missingRequiredFields.join(', ')}. Detected headers: ${headersInFile.join(', ')}`);
    }
};

const parseCSV = (fileContent: string): MachineData[] => {
  const lines = fileContent.split(/\r\n|\n/);
  if (lines.length === 0) throw new Error("CSV file is empty.");
  
  // Filter out completely empty lines before processing headers
  const nonEmptyLines = lines.filter(line => line.trim() !== '');
  if (nonEmptyLines.length < 1) throw new Error("CSV file contains no data or headers after removing empty lines.");

  const headerLine = nonEmptyLines[0];
  const headers = headerLine.split(',').map(h => h.trim());
  validateHeaders(headers);

  const dataRows = nonEmptyLines.slice(1);
  const parsedData: MachineData[] = [];

  dataRows.forEach((rowStr, index) => {
    if (!rowStr.trim()) return; // Skip empty lines that might still be in dataRows
    const values = rowStr.split(',');
    const rawRow: RawMachineDataRow = {};
    headers.forEach((header, i) => {
      rawRow[header] = values[i]?.trim();
    });
    const machineData = mapRawDataToMachineData(rawRow, index + 1, headers); // rowIndex is 1-based for user messages
    if (machineData) {
      parsedData.push(machineData);
    }
  });
  return parsedData;
};

const parseExcel = (fileContent: ArrayBuffer): MachineData[] => {
  const workbook = XLSX.read(fileContent, { type: 'array', cellDates: true }); // cellDates for better date handling if any
  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) throw new Error("Excel file contains no sheets.");
  
  const worksheet = workbook.Sheets[firstSheetName];
  // Using header: 1 to get headers as first row, and defval: "" for empty cells
  const jsonData: RawMachineDataRow[] = XLSX.utils.sheet_to_json(worksheet, { defval: "", header: 'A'}); 

  if (jsonData.length === 0) return [];

  // Extract headers from the first row of jsonData (which represents the header row)
  const headerRowObject = jsonData[0];
  if (!headerRowObject) throw new Error("Excel sheet is empty or header row could not be read.");
  const headersInFile = Object.values(headerRowObject).map(h => h?.toString().trim() || "");
  validateHeaders(headersInFile);

  // Data starts from the second row
  const dataObjects = XLSX.utils.sheet_to_json(worksheet, { defval: "" }); // Parse again for data rows with headers as keys

  const parsedData: MachineData[] = [];
  dataObjects.forEach((rawRow, index) => {
    const machineData = mapRawDataToMachineData(rawRow as RawMachineDataRow, index + 1, headersInFile); // rowIndex is 1-based for user messages
    if (machineData) {
      parsedData.push(machineData);
    }
  });
  return parsedData;
};

export const parseMachineDataFile = (file: File): Promise<MachineData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          reject(new Error("Failed to read file."));
          return;
        }
        
        const fileContent = event.target.result;
        let parsedData: MachineData[];

        if (file.name.endsWith('.csv')) {
          if (typeof fileContent !== 'string') {
             reject(new Error("File reader did not return string for CSV."));
             return;
          }
          parsedData = parseCSV(fileContent as string);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
          if (!(fileContent instanceof ArrayBuffer)) {
            reject(new Error("File reader did not return ArrayBuffer for Excel."));
            return;
          }
          parsedData = parseExcel(fileContent as ArrayBuffer);
        } else {
          reject(new Error("Unsupported file type. Please upload a CSV or Excel file."));
          return;
        }
        resolve(parsedData);
      } catch (error) {
        console.error("Error during file parsing:", error);
        reject(error instanceof Error ? error : new Error("An unknown error occurred during file parsing."));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file."));
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Unsupported file type. Please upload a CSV or Excel file."));
    }
  });
};
