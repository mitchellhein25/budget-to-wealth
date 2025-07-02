'use client';

import React, { useState, useCallback } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle, Loader2, FileText } from 'lucide-react';
import { validateImportData } from './functions/validateImportData';
import { transformImportData } from './functions/transformImportData';
import { uploadImportData } from './functions/uploadImportData';
import { parseCsvFile } from './functions/parseCsvFile';
import ImportPreview from './ImportPreview';
import ImportTemplate from './ImportTemplate';
import { ImportDataType, ImportDataTypeStringMappings, ImportDataTypeStrings, ImportResult } from './DataImportTypes';
import InputFieldSetTemplate from '../form/InputFieldSetTemplate';

export default function DataImport() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedDataType, setSelectedDataType] = useState<ImportDataTypeStrings>(ImportDataTypeStringMappings.CashFlowEntries);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false);

  const handleDataTypeChange = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDataType(event.target.value as ImportDataTypeStrings);
    setFile(null);
    setPreviewData([]);
    setShowPreview(false);
    setImportResult(null);
  }, []);

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
      const rawData = await parseCsvFile(selectedFile);
      const validationResult = validateImportData(rawData, selectedDataType);
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

      const transformedData = transformImportData(validationResult.data as ImportDataType[], selectedDataType as ImportDataTypeStrings);
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
  }, [selectedDataType]);

  const handleImport = useCallback(async () => {
    if (!previewData.length) return;

    setIsProcessing(true);
    setImportResult(null);

    try {
      const result = await uploadImportData(previewData, selectedDataType as ImportDataTypeStrings);
      setImportResult(result);
      
      if (result.success) {
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
  }, [previewData, selectedDataType]);

  const handleCancel = useCallback(() => {
    setFile(null);
    setPreviewData([]);
    setShowPreview(false);
    setImportResult(null);
  }, []);

  const handleDownloadTemplate = useCallback(() => {
    setShowTemplate(true);
  }, []);

  return (
    <div className={`p-6`}>
      <div className="flex items-center justify-between mb-6">  
        <h2 className="text-xl font-semibold">
          Import {selectedDataType} Data
        </h2>
      </div>

      {!showPreview && !importResult && (
        <div className="space-y-4">
          <div className="flex flex-col space-y-4">
            <InputFieldSetTemplate 
              label="Import Type" 
              isRequired={false}
              inputChild={
                <select
                  id="data-type-select"
                  value={selectedDataType}
                  onChange={handleDataTypeChange}
                  className="select"
                >
                  {Object.values(ImportDataTypeStringMappings).map((dataType) => (
                    <option key={dataType} value={dataType}>{dataType}</option>
                  ))}
                </select>
              }
            />
            <div className="flex justify-start">
              <button onClick={handleDownloadTemplate} className="btn btn-outline">
                <FileText className="w-6 h-6 mr-2" />
                Download Template
              </button>
            </div>
          </div>
          <div className="card bg-base-100 shadow-xl border-2 border-dashed border-base-300 hover:border-primary transition-colors">
            <div className="card-body items-center text-center space-y-4">
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
                <Upload className="w-12 h-12" />
                <div className="text-lg">
                  {isProcessing ? 'Processing file...' : 'Choose CSV file to import'}
                </div>
                <div className="text-sm">
                  Supports .csv files only
                </div>
                <div className="bg-base-200 rounded-lg p-4 text-sm space-y-2">
                  <div className="text-md">💡 Tip:</div>
                  <div>If you have an Excel file, save it as CSV first:</div>
                  <div className="text-xs">
                    <div>1. Open your Excel file</div>
                    <div>2. Go to File → Save As</div>
                    <div>3. Choose "CSV (Comma delimited)"</div>
                    <div>4. Save and upload the .csv file</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="w-6 h-6 animate-spin text-primary mr-2" />
              <span>Processing file...</span>
            </div>
          )}
        </div>
      )}

      {showPreview && (
        <ImportPreview
          data={previewData}
          dataTypeString={selectedDataType as ImportDataTypeStrings}
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
          dataTypeString={selectedDataType as ImportDataTypeStrings}
          onClose={() => setShowTemplate(false)}
        />
      )}
    </div>
  );
} 