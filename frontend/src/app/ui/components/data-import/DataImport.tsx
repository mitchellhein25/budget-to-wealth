'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2, FileText } from 'lucide-react';
import { ExcelImportProps, ImportResult } from '../ExcelImport/ExcelImportTypes';
import { validateImportData } from './functions/validateImportData';
import { transformImportData } from './functions/transformImportData';
import { uploadImportData } from './functions/uploadImportData';
import { parseCsvFile } from './functions/parseCsvFile';
import ImportPreview from './ImportPreview';
import ImportTemplate from './ImportTemplate';

export default function DataImport({ 
  dataType, 
  onImportComplete, 
  onCancel,
  className = '' 
}: ExcelImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'text/csv' && !selectedFile.name.toLowerCase().endsWith('.csv')) {
      setImportResult({
        success: false,
        message: 'Please select a CSV file (.csv). For Excel files, please save as CSV first.',
        importedCount: 0,
        errorCount: 0,
        errors: []
      });
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    setImportResult(null);

    try {
      // Parse the CSV file
      const rawData = await parseCsvFile(selectedFile);
      
      // Validate the data
      const validationResult = validateImportData(rawData, dataType);
      
      if (!validationResult.success) {
        setImportResult({
          success: false,
          message: 'Invalid data format. Please check the template and try again.',
          importedCount: 0,
          errorCount: validationResult.errors.length,
          errors: validationResult.errors
        });
        return;
      }

      // Transform data to the correct format
      const transformedData = transformImportData(validationResult.data || [], dataType);
      setPreviewData(transformedData);
      setShowPreview(true);

    } catch (error) {
      setImportResult({
        success: false,
        message: `Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        importedCount: 0,
        errorCount: 0,
        errors: []
      });
    } finally {
      setIsProcessing(false);
    }
  }, [dataType]);

  const handleImport = useCallback(async () => {
    if (!previewData.length) return;

    setIsProcessing(true);
    setImportResult(null);

    try {
      const result = await uploadImportData(previewData, dataType);
      setImportResult(result);
      
      if (result.success) {
        onImportComplete?.(result);
        // Reset form after successful import
        setTimeout(() => {
          setFile(null);
          setPreviewData([]);
          setShowPreview(false);
          setImportResult(null);
        }, 3000);
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: `Error uploading data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        importedCount: 0,
        errorCount: previewData.length,
        errors: []
      });
    } finally {
      setIsProcessing(false);
    }
  }, [previewData, dataType, onImportComplete]);

  const handleCancel = useCallback(() => {
    setFile(null);
    setPreviewData([]);
    setShowPreview(false);
    setImportResult(null);
    onCancel?.();
  }, [onCancel]);

  const handleDownloadTemplate = useCallback(() => {
    setShowTemplate(true);
  }, []);

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Import {dataType} Data
        </h2>
        <button
          onClick={handleDownloadTemplate}
          className="btn btn-outline btn-sm"
        >
          <FileText className="w-4 h-4 mr-2" />
          Download Template
        </button>
      </div>

      {!showPreview && !importResult && (
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
              disabled={isProcessing}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload className="w-12 h-12 text-gray-400 mb-4" />
              <div className="text-lg font-medium text-gray-900 mb-2">
                {isProcessing ? 'Processing file...' : 'Choose CSV file to import'}
              </div>
              <div className="text-sm text-gray-500 mb-4">
                Supports .csv files only
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <div className="font-medium mb-1">💡 Tip:</div>
                <div>If you have an Excel file, save it as CSV first:</div>
                <div className="text-xs mt-1">
                  1. Open your Excel file<br/>
                  2. Go to File → Save As<br/>
                  3. Choose "CSV (Comma delimited)"<br/>
                  4. Save and upload the .csv file
                </div>
              </div>
            </label>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
              <span className="text-gray-600">Processing file...</span>
            </div>
          )}
        </div>
      )}

      {showPreview && (
        <ImportPreview
          data={previewData}
          dataType={dataType}
          onImport={handleImport}
          onCancel={handleCancel}
          isProcessing={isProcessing}
        />
      )}

      {importResult && (
        <div className="mt-6">
          <div className={`flex items-center p-4 rounded-lg ${
            importResult.success 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            {importResult.success ? (
              <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            )}
            <div>
              <div className={`font-medium ${
                importResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {importResult.message}
              </div>
              {importResult.success && (
                <div className="text-sm text-green-700 mt-1">
                  Successfully imported {importResult.importedCount} items
                  {importResult.errorCount > 0 && `, ${importResult.errorCount} errors`}
                </div>
              )}
            </div>
          </div>

          {importResult.errors.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Errors:</h4>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-h-40 overflow-y-auto">
                {importResult.errors.map((error, index) => (
                  <div key={index} className="text-sm text-red-700 mb-1">
                    Row {error.row}: {error.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleCancel}
              className="btn btn-outline"
            >
              Close
            </button>
            {!importResult.success && (
              <button
                onClick={() => {
                  setImportResult(null);
                  setShowPreview(false);
                }}
                className="btn btn-primary"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}

      {showTemplate && (
        <ImportTemplate
          dataType={dataType}
          onClose={() => setShowTemplate(false)}
        />
      )}
    </div>
  );
} 