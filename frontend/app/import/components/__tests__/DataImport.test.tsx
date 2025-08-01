import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ImportDataTypeStringMappings } from '../models/ImportDataTypeStringMappings';

jest.mock('../functions/parseCsvFile', () => ({
  parseCsvFile: jest.fn()
}));

jest.mock('../functions/validateImportData', () => ({
  validateImportData: jest.fn()
}));

jest.mock('../functions/transformImportData', () => ({
  transformImportData: jest.fn()
}));

jest.mock('../functions/uploadImportData', () => ({
  uploadImportData: jest.fn()
}));

import DataImport from '../DataImport';

const mockParseCsvFile = require('../functions/parseCsvFile').parseCsvFile;
const mockValidateImportData = require('../functions/validateImportData').validateImportData;
const mockTransformImportData = require('../functions/transformImportData').transformImportData;
const mockUploadImportData = require('../functions/uploadImportData').uploadImportData;

const testIds = {
  dataTypeSelect: 'data-type-select',
  fileUpload: 'file-upload',
  downloadTemplateButton: 'download-template-button',
  importButton: 'import-button',
  cancelButton: 'cancel-button',
  closeButton: 'close-button',
  tryAgainButton: 'try-again-button',
  processingMessage: 'processing-message',
  successMessage: 'success-message',
  errorMessage: 'error-message',
  previewTable: 'preview-table',
  templateModal: 'template-modal'
};

const sampleCsvData = [
  { description: 'Test Entry', amount: 100.00, date: '2024-01-01', categoryName: 'Test Category', categoryType: 'Expense' },
  { description: 'Test Entry 2', amount: 200.00, date: '2024-01-02', categoryName: 'Test Category 2', categoryType: 'Income' }
];

const sampleValidationResult = {
  success: true,
  data: sampleCsvData,
  errors: []
};

const sampleImportResult = {
  success: true,
  message: 'Successfully imported 2 items',
  importedCount: 2,
  errorCount: 0,
  results: []
};

describe('DataImport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockParseCsvFile.mockResolvedValue(sampleCsvData);
    mockValidateImportData.mockReturnValue(sampleValidationResult);
    mockTransformImportData.mockReturnValue(sampleCsvData);
    mockUploadImportData.mockResolvedValue(sampleImportResult);
  });

  it('renders the component with default state', () => {
    render(<DataImport />);
    
    expect(screen.getByText(/Import.*CashFlow.*Entries.*Data/)).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/Download Template/)).toBeInTheDocument();
    expect(screen.getByText(/Choose CSV file to import/)).toBeInTheDocument();
  });

  it('allows selecting different data types', async () => {
    const user = userEvent.setup();
    render(<DataImport />);
    
    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'Holding Snapshots');
    
    expect(select).toHaveValue('Holding Snapshots');
    expect(screen.getByText(/Import.*Holding.*Snapshots.*Data/)).toBeInTheDocument();
  });

  it('handles file selection with valid CSV file', async () => {
    const user = userEvent.setup();
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Cancel/)).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Entry')).toBeInTheDocument();
  });

  it('handles file with invalid type but .csv extension', async () => {
    const user = userEvent.setup();
    render(<DataImport />);
    
    const file = new File(['test content'], 'test.csv', { type: 'application/octet-stream' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Cancel/)).toBeInTheDocument();
    });
  });

  it('shows validation errors when data is invalid', async () => {
    const user = userEvent.setup();
    mockValidateImportData.mockReturnValue({
      success: false,
      data: [],
      errors: [
        { row: 1, message: 'categoryName is required', field: 'categoryName' },
        { row: 1, message: 'categoryType is required', field: 'categoryType' }
      ]
    });
    
    render(<DataImport />);
    
    const file = new File(['description,amount,date\nTest,100.00,2024-01-01'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Invalid data format/)).toBeInTheDocument();
      expect(screen.getByText(/categoryName is required/)).toBeInTheDocument();
    });
  });

  it('shows preview when data is valid', async () => {
    const user = userEvent.setup();
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Preview.*items/)).toBeInTheDocument();
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
  });

  it('handles import process successfully', async () => {
    const user = userEvent.setup();
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Successfully imported/)).toHaveLength(2);
    });
  });

  it('handles import when previewData is empty', async () => {
    const user = userEvent.setup();
    render(<DataImport />);
    
    // Mock empty preview data
    mockTransformImportData.mockReturnValue([]);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    // Should not call uploadImportData when previewData is empty
    expect(mockUploadImportData).not.toHaveBeenCalled();
  });

  it('handles import errors', async () => {
    const user = userEvent.setup();
    mockUploadImportData.mockResolvedValue({
      success: false,
      message: 'Import failed',
      importedCount: 0,
      errorCount: 2,
      results: [
        { success: false, message: 'Error 1', row: 1 },
        { success: false, message: 'Error 2', row: 2 }
      ]
    });
    
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Import failed/)).toBeInTheDocument();
      expect(screen.getByText(/Row 1: Error 1/)).toBeInTheDocument();
      expect(screen.getByText(/Row 2: Error 2/)).toBeInTheDocument();
    });
  });

  it('handles import with partial success', async () => {
    const user = userEvent.setup();
    mockUploadImportData.mockResolvedValue({
      success: true,
      message: 'Successfully imported 1 item',
      importedCount: 1,
      errorCount: 1,
      results: [
        { success: true, message: 'Success', row: 1 },
        { success: false, message: 'Error', row: 2 }
      ]
    });
    
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Successfully imported/)).toHaveLength(2);
      expect(screen.getByText(/1 errors/)).toBeInTheDocument();
      expect(screen.getByText(/Row 2: Error/)).toBeInTheDocument();
    });
  });

  it('handles import with no errors', async () => {
    const user = userEvent.setup();
    mockUploadImportData.mockResolvedValue({
      success: true,
      message: 'Successfully imported 2 items',
      importedCount: 2,
      errorCount: 0,
      results: []
    });
    
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Successfully imported/)).toHaveLength(2);
      expect(screen.queryByText(/errors/)).not.toBeInTheDocument();
      expect(screen.queryByText(/Errors:/)).not.toBeInTheDocument();
    });
  });

  it('allows canceling the import process', async () => {
    const user = userEvent.setup();
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Cancel/)).toBeInTheDocument();
    });
    
    const cancelButton = screen.getByText(/Cancel/);
    await user.click(cancelButton);
    
    expect(screen.getByText(/Choose CSV file to import/)).toBeInTheDocument();
  });

  it('shows template modal when download template is clicked', async () => {
    const user = userEvent.setup();
    render(<DataImport />);
    
    const downloadButtons = screen.getAllByText(/Download Template/);
    await user.click(downloadButtons[0]);
    
    expect(screen.getByText(/Import Template/)).toBeInTheDocument();
    expect(screen.getAllByText(/Download Template/)).toHaveLength(2);
  });

  it('handles file processing errors', async () => {
    const user = userEvent.setup();
    mockParseCsvFile.mockRejectedValueOnce(new Error('File read error'));
    
    render(<DataImport />);
    
    const file = new File(['invalid content'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Error processing file/)).toBeInTheDocument();
    });
  });

  it('handles upload errors', async () => {
    const user = userEvent.setup();
    mockUploadImportData.mockRejectedValueOnce(new Error('Upload error'));
    
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Error uploading data/)).toBeInTheDocument();
    });
  });
  
  it('shows processing state during import', async () => {
    const user = userEvent.setup();
    // Create a promise that resolves after a delay
    let resolvePromise: (value: any) => void;
    const delayedPromise = new Promise(resolve => {
      resolvePromise = resolve;
    });
    mockUploadImportData.mockImplementation(() => delayedPromise);
    
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    // The import should be in progress
    expect(mockUploadImportData).toHaveBeenCalled();
    
    // Resolve the promise to complete the import
    resolvePromise!({
      success: true,
      message: 'Successfully imported 2 items',
      importedCount: 2,
      errorCount: 0,
      results: []
    });
    
    await waitFor(() => {
      expect(screen.getAllByText(/Successfully imported/)).toHaveLength(2);
    });
  });

  it('shows try again button when import fails', async () => {
    const user = userEvent.setup();
    mockUploadImportData.mockResolvedValue({
      success: false,
      message: 'Import failed',
      importedCount: 0,
      errorCount: 1,
      results: [{ success: false, message: 'Error', row: 1 }]
    });
    
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Try Again/)).toBeInTheDocument();
    });
  });

  it('allows trying again after failed import', async () => {
    const user = userEvent.setup();
    mockUploadImportData.mockResolvedValue({
      success: false,
      message: 'Import failed',
      importedCount: 0,
      errorCount: 1,
      results: [{ success: false, message: 'Error', row: 1 }]
    });
    
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Import.*Items/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Try Again/)).toBeInTheDocument();
    });
    
    const tryAgainButton = screen.getByText(/Try Again/);
    await user.click(tryAgainButton);
    
    // Should return to the file selection state
    expect(screen.getByText(/Choose CSV file to import/)).toBeInTheDocument();
  });
}); 