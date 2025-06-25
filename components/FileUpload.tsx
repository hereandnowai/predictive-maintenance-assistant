import React, { useCallback, useState } from 'react';

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
  disabled?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUploaded, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileUploaded(file);
    } else {
      setFileName(null);
    }
  }, [onFileUploaded]);

  const handleDragEvents = useCallback((event: React.DragEvent<HTMLDivElement>, dragging: boolean) => {
    event.preventDefault();
    event.stopPropagation();
    if (!disabled) {
      setIsDragging(dragging);
    }
  }, [disabled]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(event, false);
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      onFileUploaded(file);
    } else {
      setFileName(null);
    }
  }, [onFileUploaded, disabled, handleDragEvents]);


  return (
    <div 
      className={`flex flex-col items-center space-y-4 p-6 border-2 border-dashed rounded-lg transition-colors duration-200 ease-in-out
                  ${disabled ? 'border-slate-600 cursor-not-allowed' : isDragging ? 'border-brand-primary bg-slate-700' : 'border-slate-500 hover:border-yellow-500'}`} // Retained hover:border-yellow-500 for non-dragging hover, or could change to brand-primary
      onDragEnter={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDrop={handleDrop}
      aria-disabled={disabled}
    >
      <label
        htmlFor="file-upload"
        className={`w-full sm:w-auto inline-block py-3 px-8 text-center rounded-md font-semibold text-lg
                    ${disabled ? 'bg-slate-500 text-slate-400 cursor-not-allowed' : 'bg-brand-primary text-slate-900 hover:bg-yellow-400 cursor-pointer'}
                    transition-colors shadow-md hover:shadow-lg transform hover:scale-105`}
      >
        {fileName ? `Selected: ${fileName}` : 'Choose or Drag File'}
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
        aria-label="File upload input"
      />
      <p className="text-sm text-slate-400">Supported formats: .xlsx, .xls, .csv</p>
      <p className="text-xs text-slate-500 max-w-md text-center">
        Ensure your file has columns like: Machine ID, Temperature, Vibration Level, Pressure, Operating Hours, Last Maintenance, Error Logs.
      </p>
    </div>
  );
};