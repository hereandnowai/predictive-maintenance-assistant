
import React, { useState, useEffect, useCallback } from 'react';
import { MachineData, MaintenancePrediction } from './types';
import { FileUpload } from './components/FileUpload';
import { MachineSelector } from './components/MachineSelector';
import { MaintenanceReport } from './components/MaintenanceReport';
import { Spinner } from './components/Spinner';
import { ErrorMessage } from './components/ErrorMessage';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { parseMachineDataFile } from './services/fileParserService';
import { analyzeMachineDataWithGemini } from './services/geminiService';

const App: React.FC = () => {
  const [machineDataList, setMachineDataList] = useState<MachineData[]>([]);
  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [maintenanceReport, setMaintenanceReport] = useState<MaintenancePrediction | null>(null);
  
  const [isLoadingFile, setIsLoadingFile] = useState<boolean>(false);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUploaded = useCallback(async (file: File) => {
    setError(null);
    setMaintenanceReport(null);
    setSelectedMachineId(null);
    setMachineDataList([]);
    setIsLoadingFile(true);
    try {
      const data = await parseMachineDataFile(file);
      if (data.length === 0) {
        setError("No valid machine data found in the file or the file is empty.");
        setMachineDataList([]);
      } else {
        setMachineDataList(data);
      }
    } catch (err) {
      console.error("File parsing error:", err);
      setError(err instanceof Error ? err.message : "Failed to parse the uploaded file. Please ensure it's a valid CSV or Excel file with correct columns.");
      setMachineDataList([]);
    } finally {
      setIsLoadingFile(false);
    }
  }, []);

  const handleMachineSelected = useCallback((machineId: string) => {
    setError(null);
    setMaintenanceReport(null);
    setSelectedMachineId(machineId);
  }, []);

  useEffect(() => {
    const fetchMaintenanceReport = async () => {
      if (selectedMachineId && machineDataList.length > 0) {
        const selectedMachine = machineDataList.find(m => m.machineId === selectedMachineId);
        if (selectedMachine) {
          setIsLoadingReport(true);
          setError(null);
          setMaintenanceReport(null);
          try {
            const report = await analyzeMachineDataWithGemini(selectedMachine);
            if (report) {
              setMaintenanceReport(report);
            } else {
              setError("Failed to get maintenance prediction. The AI service might have returned an invalid response.");
            }
          } catch (err) {
            console.error("Gemini API error:", err);
            setError(err instanceof Error ? err.message : "An error occurred while fetching the maintenance report from the AI service.");
          } finally {
            setIsLoadingReport(false);
          }
        }
      }
    };

    fetchMaintenanceReport();
  }, [selectedMachineId, machineDataList]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <section aria-labelledby="upload-section-title" className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700">
          <h2 id="upload-section-title" className="text-2xl font-semibold text-brand-primary mb-6">1. Upload Equipment Data</h2>
          <FileUpload onFileUploaded={handleFileUploaded} disabled={isLoadingFile} />
          {isLoadingFile && <div className="mt-4"><Spinner text="Parsing file..." /></div>}
        </section>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        {machineDataList.length > 0 && !isLoadingFile && (
          <section aria-labelledby="select-machine-title" className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700">
            <h2 id="select-machine-title" className="text-2xl font-semibold text-brand-primary mb-6">2. Select Machine</h2>
            <MachineSelector
              machines={machineDataList}
              selectedMachineId={selectedMachineId}
              onMachineSelected={handleMachineSelected}
              disabled={isLoadingReport}
            />
          </section>
        )}

        {isLoadingReport && <div className="mt-4"><Spinner text="Analyzing machine data..." /></div>}
        
        {maintenanceReport && !isLoadingReport && selectedMachineId && (
          <section aria-labelledby="maintenance-report-title" className="bg-slate-800 p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700">
            <h2 id="maintenance-report-title" className="text-2xl font-semibold text-brand-primary mb-6">3. Maintenance Report for <span className="text-yellow-300">{selectedMachineId}</span></h2> {/* Consider text-brand-primary for selectedMachineId too */}
            <MaintenanceReport report={maintenanceReport} />
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default App;