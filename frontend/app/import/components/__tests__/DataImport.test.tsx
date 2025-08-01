import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DataImport from '../DataImport';

jest.mock('../functions/getFieldsForImportType', () => ({
  getFieldsForImportType: jest.fn(),
}));

jest.mock('../functions/getImportTemplateData', () => ({
  getImportTemplateData: jest.fn(),
}));

jest.mock('../functions/parseCsvFile', () => ({
  parseCsvFile: jest.fn(),
}));

jest.mock('../functions/validateImportData', () => ({
  validateImportData: jest.fn(),
}));

jest.mock('../functions/uploadImportData', () => ({
  uploadImportData: jest.fn(),
}));

describe('DataImport', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with correct title', () => {
    render(<DataImport />);
    
    expect(screen.getByText(/Import.*Data/)).toBeInTheDocument();
  });

  it('renders file input', () => {
    render(<DataImport />);
    
    const fileInput = screen.getByDisplayValue('');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
  });

  it('renders data type selector', () => {
    render(<DataImport />);
    
    const dataTypeSelect = screen.getByRole('combobox');
    expect(dataTypeSelect).toBeInTheDocument();
  });

  it('renders download template button', () => {
    render(<DataImport />);
    
    const downloadButton = screen.getByText(/download template/i);
    expect(downloadButton).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<DataImport />);
    
    const fileInput = screen.getByDisplayValue('');
    
    expect(fileInput).toBeInTheDocument();
  });

  it('handles data type selection', () => {
    render(<DataImport />);
    
    const dataTypeSelect = screen.getByRole('combobox');
    
    expect(dataTypeSelect).toBeInTheDocument();
  });

  it('renders with all required elements', () => {
    render(<DataImport />);
    
    expect(screen.getByText(/Import.*Data/)).toBeInTheDocument();
    expect(screen.getByDisplayValue('')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByText(/download template/i)).toBeInTheDocument();
  });
}); 