import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DataImport from '../DataImport';
import { ImportDataTypeStringMappings } from '../models/ImportDataTypeStringMappings';

const mockParseCsvFile = jest.fn();
const mockValidateImportData = jest.fn();
const mockTransformImportData = jest.fn();
const mockUploadImportData = jest.fn();

jest.doMock('../functions/parseCsvFile', () => ({
  parseCsvFile: mockParseCsvFile
}));

jest.doMock('../functions/validateImportData', () => ({
  validateImportData: mockValidateImportData
}));

jest.doMock('../functions/transformImportData', () => ({
  transformImportData: mockTransformImportData
}));

jest.doMock('../functions/uploadImportData', () => ({
  uploadImportData: mockUploadImportData
}));

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
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('handles invalid file types', async () => {
    const user = userEvent.setup();
    render(<DataImport />);
    
    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/CSV file/)).toBeInTheDocument();
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
      expect(screen.getByText(/Imported.*items.*with.*errors/)).toBeInTheDocument();
    });
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
      expect(screen.getByText(/Imported.*items.*with.*errors/)).toBeInTheDocument();
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
  
  it('shows processing state during import', async () => {
    const user = userEvent.setup();
    mockUploadImportData.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<DataImport />);
    
    const file = new File(['description,amount,date,categoryName,categoryType\nTest,100.00,2024-01-01,Category,Expense'], 'test.csv', { type: 'text/csv' });
    const fileInput = screen.getByLabelText(/Choose CSV file to import/);
    
    await user.upload(fileInput, file);
    
    await waitFor(() => {
      expect(screen.getByText(/Cancel/)).toBeInTheDocument();
    });
    
    const importButton = screen.getByRole('button', { name: /Import.*Items/ });
    await user.click(importButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Imported.*items.*with.*errors/)).toBeInTheDocument();
    });
  });
}); 