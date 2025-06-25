import React from 'react';
import { MaintenancePrediction } from '../types';

interface MaintenanceReportProps {
  report: MaintenancePrediction;
}

const ReportItem: React.FC<{ label: string; value: string; isStatus?: boolean; urgency?: string }> = ({ label, value, isStatus, urgency }) => {
  let valueClasses = "text-brand-primary"; // Default for general values using new brand color
  
  if (isStatus) {
    if (value.toLowerCase() === 'yes') valueClasses = "text-red-400 font-semibold";
    if (value.toLowerCase() === 'no') valueClasses = "text-green-400 font-semibold";
  }
  
  if (urgency) {
    if (urgency.toLowerCase() === 'high') valueClasses = "text-red-400 font-semibold";
    else if (urgency.toLowerCase() === 'medium') valueClasses = "text-orange-400 font-semibold";
    else if (urgency.toLowerCase() === 'low') valueClasses = "text-green-400 font-semibold";
  }

  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 border-b border-slate-700 last:border-b-0">
      <dt className="text-sm font-medium text-slate-400">{label}</dt>
      <dd className={`mt-1 text-sm sm:mt-0 sm:col-span-2 ${valueClasses}`}>{value}</dd>
    </div>
  );
};

export const MaintenanceReport: React.FC<MaintenanceReportProps> = ({ report }) => {
  return (
    <div className="bg-slate-850 p-4 sm:p-6 rounded-lg shadow-inner border border-slate-700"> {/* Consider using brand-secondary for border */}
      <dl>
        <ReportItem 
          label="Maintenance Required" 
          value={report['Maintenance Required']} 
          isStatus
        />
        <ReportItem 
          label="Urgency Level" 
          value={report['Urgency Level']} 
          urgency={report['Urgency Level']} 
        />
        <ReportItem label="Reason" value={report.Reason} />
        <ReportItem label="Suggested Action" value={report['Suggested Action']} />
      </dl>
    </div>
  );
};