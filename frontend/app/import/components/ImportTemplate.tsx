import React, { useMemo } from 'react';
import { ImportDataTypeStringMappings } from './models/ImportDataTypeStringMappings';
import { Download, X } from 'lucide-react';
import { getImportTemplateData } from './functions/getImportTemplateData';

interface ImportTemplateProps {
  dataTypeString: (typeof ImportDataTypeStringMappings)[keyof typeof ImportDataTypeStringMappings];
  onClose: () => void;
}

export default function ImportTemplate(props: ImportTemplateProps) {

  const template = useMemo(() => 
    getImportTemplateData(props.dataTypeString), 
  [props.dataTypeString]);

  const downloadTemplate = () => {
    const csvContent = [
      template.headers.join(','),
      ...template.sampleData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${props.dataTypeString.toLowerCase()}_import_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Import Template - {props.dataTypeString}
          </h2>
          <button
            onClick={props.onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-base-content/70">{template.description}</p>

          <div className="bg-base-200 rounded-lg p-4 text-sm space-y-2">
            <div>
              <h3 className="font-medium">📋 Instructions:</h3>
              <ol className="text-sm space-y-1 mt-2">
                <li>1. Download the template below</li>
                <li>2. Fill in your data following the format shown</li>
                <li>3. Save the file as CSV format</li>
                <li>4. Upload the CSV file to import your data</li>
              </ol>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm">
            <div className="card-body">
              <h3 className="card-title text-base">Required Columns:</h3>
              <div className="grid grid-cols-2 gap-2">
                {template.headers.map((header, index) => (
                  <div key={index} className="badge badge-outline">
                    {header}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-sm border">
            <div className="card-body">
              <h3 className="card-title text-base">Sample Data:</h3>
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      {template.headers.map((header, index) => (
                        <th key={index}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {template.sampleData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-action">
            <button
              onClick={props.onClose}
              className="btn btn-outline"
            >
              Close
            </button>
            <button
              onClick={downloadTemplate}
              className="btn btn-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
          </div>
        </div>
      </div>
      <div className="modal-backdrop" onClick={props.onClose}></div>
    </div>
  );
} 