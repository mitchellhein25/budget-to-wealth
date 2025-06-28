import React from 'react';
import { ImportDataType } from './DataImportTypes';
import { Download, X } from 'lucide-react';

interface ImportTemplateProps {
  dataType: ImportDataType;
  onClose: () => void;
}

export default function ImportTemplate({ dataType, onClose }: ImportTemplateProps) {
  const getTemplateData = () => {
    switch (dataType) {
      case 'CashFlowEntry':
        return {
          headers: ['amount', 'date', 'categoryName', 'description', 'entryType'],
          sampleData: [
            ['100.00', '2024-01-15', 'Groceries', 'Weekly grocery shopping', 'Expense'],
            ['2500.00', '2024-01-15', 'Salary', 'Monthly salary', 'Income'],
            ['50.00', '2024-01-16', 'Entertainment', 'Movie tickets', 'Expense']
          ],
          description: 'Import cash flow entries with amount, date, category, description, and type (Income/Expense)'
        };
      case 'Holding':
        return {
          headers: ['name', 'type', 'categoryName'],
          sampleData: [
            ['Savings Account', 'Asset', 'Cash'],
            ['Credit Card', 'Debt', 'Credit'],
            ['Investment Portfolio', 'Asset', 'Investments']
          ],
          description: 'Import holdings with name, type (Asset/Debt), and category'
        };
      case 'HoldingSnapshot':
        return {
          headers: ['holdingName', 'value', 'date'],
          sampleData: [
            ['Savings Account', '5000.00', '2024-01-15'],
            ['Investment Portfolio', '25000.00', '2024-01-15'],
            ['Credit Card', '-1500.00', '2024-01-15']
          ],
          description: 'Import holding snapshots with holding name, value, and date'
        };
      case 'Budget':
        return {
          headers: ['amount', 'categoryName'],
          sampleData: [
            ['500.00', 'Groceries'],
            ['200.00', 'Entertainment'],
            ['1000.00', 'Transportation']
          ],
          description: 'Import budgets with amount and category'
        };
      default:
        return { headers: [], sampleData: [], description: '' };
    }
  };

  const template = getTemplateData();

  const downloadTemplate = () => {
    const csvContent = [
      template.headers.join(','),
      ...template.sampleData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dataType.toLowerCase()}_import_template.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Import Template - {dataType}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-gray-600">{template.description}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">📋 Instructions:</h3>
            <ol className="text-sm text-blue-800 space-y-1">
              <li>1. Download the template below</li>
              <li>2. Fill in your data following the format shown</li>
              <li>3. Save the file as CSV format</li>
              <li>4. Upload the CSV file to import your data</li>
            </ol>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">Required Columns:</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {template.headers.map((header, index) => (
                <div key={index} className="bg-white px-3 py-1 rounded border">
                  {header}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b">
              <h3 className="font-medium text-gray-900">Sample Data:</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    {template.headers.map((header, index) => (
                      <th key={index} className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {template.sampleData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-t">
                      {row.map((cell, cellIndex) => (
                        <td key={cellIndex} className="px-4 py-2 text-sm text-gray-900">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={downloadTemplate}
              className="btn btn-primary"
            >
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </button>
            <button
              onClick={onClose}
              className="btn btn-outline"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 