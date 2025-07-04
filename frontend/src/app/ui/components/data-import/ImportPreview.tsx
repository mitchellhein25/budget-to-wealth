import React from 'react';
import { ImportDataTypeStrings } from './DataImportTypes';

interface ImportPreviewProps {
  data: any[];
  dataTypeString: ImportDataTypeStrings;
  onImport: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export default function ImportPreview(props: ImportPreviewProps) {
  const getColumns = () => {
    if (props.data.length === 0) return [];
    
    const firstItem = props.data[0];
    const allKeys = Object.keys(firstItem);
    const limitedKeys = allKeys.slice(0, 10);
    
    return limitedKeys.map(key => ({
      key,
      label: key
    }));
  };

  const columns = getColumns();
  const totalColumns = props.data.length > 0 ? Object.keys(props.data[0]).length : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">
          Preview ({props.data.length} items)
        </h3>
        <div className="text-sm opacity-70">
          Review the data before importing
        </div>
      </div>

      <div className="card bg-base-100 shadow-sm border">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.key}>
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.data.length > 10 
                ? props.data.slice(0, 10).map((item, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td key={column.key}>
                          {item[column.key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))
                : props.data.map((item, index) => (
                    <tr key={index}>
                      {columns.map((column) => (
                        <td key={column.key}>
                          {item[column.key] || '-'}
                        </td>
                      ))}
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
        
        <div className="card-body pt-0 space-y-2">
          {props.data.length > 10 && (
            <div className="alert alert-info alert-soft">
              Showing first 10 of {props.data.length} items
            </div>
          )}
          {totalColumns > 10 && (
            <div className="alert alert-info alert-soft">
              Showing first 10 of {totalColumns} columns
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={props.onCancel}
          className="btn btn-outline"
          disabled={props.isProcessing}
        >
          Cancel
        </button>
        <button
          onClick={props.onImport}
          className="btn btn-primary"
          disabled={props.isProcessing}
        >
          {props.isProcessing ? 'Importing...' : `Import ${props.data.length} Items`}
        </button>
      </div>
    </div>
  );
} 