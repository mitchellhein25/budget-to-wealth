import React from 'react';
import { ImportDataType, ImportDataTypeStringMappings, ImportDataTypeStrings } from './DataImportTypes';
import { formatCurrency, formatDate } from '../Utils';

interface ImportPreviewProps {
  data: any[];
  dataTypeString: ImportDataTypeStrings;
  onImport: () => void;
  onCancel: () => void;
  isProcessing: boolean;
}

export default function ImportPreview(props: ImportPreviewProps) {
  const getPreviewColumns = () => {
    switch (props.dataTypeString) {
      case ImportDataTypeStringMappings.CashFlowEntries:
        return [
          { key: 'amount', label: 'Amount', formatter: (value: number) => formatCurrency(value * 100) },
          { key: 'date', label: 'Date', formatter: (value: string) => formatDate(new Date(value)) },
          { key: 'categoryName', label: 'Category' },
          { key: 'description', label: 'Description' },
          { key: 'entryType', label: 'Type' },
          { key: 'recurrenceFrequency', label: 'Recurrence Frequency' }
        ];
      case ImportDataTypeStringMappings.Holdings:
        return [
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' },
          { key: 'holdingCategoryName', label: 'Category' }
        ];
      case ImportDataTypeStringMappings.HoldingSnapshots:
        return [
          { key: 'holdingName', label: 'Holding' },
          { key: 'balance', label: 'Balance', formatter: (value: number) => formatCurrency(value * 100) },
          { key: 'date', label: 'Date', formatter: (value: string) => formatDate(new Date(value)) }
        ];
      case ImportDataTypeStringMappings.Budgets:
        return [
          { key: 'amount', label: 'Amount', formatter: (value: number) => formatCurrency(value * 100) },
          { key: 'categoryName', label: 'Category' },
          { key: 'name', label: 'Name' }
        ];
      case ImportDataTypeStringMappings.HoldingCategories:
        return [
          { key: 'name', label: 'Name' }
        ];
      case ImportDataTypeStringMappings.CashFlowCategories:
        return [
          { key: 'name', label: 'Name' },
          { key: 'type', label: 'Type' }
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
          Preview ({props.data.length} items)
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
              {props.data.slice(0, 10).map((item, index) => (
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
        
        {props.data.length > 10 && (
          <div className="bg-gray-50 px-6 py-3 text-sm text-gray-500">
            Showing first 10 of {props.data.length} items
          </div>
        )}
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