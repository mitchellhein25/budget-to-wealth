import React from 'react';
import { ImportDataType } from './ExcelImportTypes';
import { formatCurrency, formatDate } from '../Utils';

interface ImportPreviewProps {
  data: any[];
  dataType: ImportDataType;
  onImport: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export default function ImportPreview({ 
  data, 
  dataType, 
  onImport, 
  onCancel, 
  isProcessing 
}: ImportPreviewProps) {
  const getPreviewColumns = () => {
    switch (dataType) {
      case 'CashFlowEntry':
        return [
          { key: 'amount', label: 'Amount', formatter: (value: number) => formatCurrency(value / 100) },
          { key: 'date', label: 'Date', formatter: (value: string) => formatDate(new Date(value)) },
          { key: 'categoryName', label: 'Category' },
          { key: 'description', label: 'Description' },
          { key: 'entryType', label: 'Type' }
        ];
      case 'Holding':
        return [
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'categoryName', label: 'Category' }
        ];
      case 'HoldingSnapshot':
        return [
          { key: 'holdingName', label: 'Holding' },
          { key: 'value', label: 'Value', formatter: (value: number) => formatCurrency(value / 100) },
          { key: 'date', label: 'Date', formatter: (value: string) => formatDate(new Date(value)) }
        ];
      case 'Budget':
        return [
          { key: 'amount', label: 'Amount', formatter: (value: number) => formatCurrency(value / 100) },
          { key: 'categoryName', label: 'Category' }
        ];
      default:
        return [];
    }
  };

  const columns = getPreviewColumns();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          Preview ({data.length} items)
        </h3>
        <div className="text-sm text-gray-500">
          Review the data before importing
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.slice(0, 10).map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {column.formatter 
                        ? column.formatter(item[column.key] as never)
                        : item[column.key] || '-'
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {data.length > 10 && (
          <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500">
            Showing first 10 of {data.length} items
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="btn btn-outline"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          onClick={onImport}
          className="btn btn-primary"
          disabled={isProcessing}
        >
          {isProcessing ? 'Importing...' : `Import ${data.length} Items`}
        </button>
      </div>
    </div>
  );
} 