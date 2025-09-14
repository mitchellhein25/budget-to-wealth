import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ImportPreview, ImportDataTypeString } from '@/app/import';

const mockOnImport = jest.fn();
const mockOnCancel = jest.fn();

const defaultProps = {
  data: [],
  dataTypeString: ImportDataTypeString.CashFlowEntries,
  onImport: mockOnImport,
  onCancel: mockOnCancel,
  isProcessing: false,
};

const sampleData = [
  {
    amountInCents: 10000,
    date: '2024-01-01',
    categoryName: 'Category 1',
    categoryType: 'Expense' as const,
    description: 'Test Entry 1',
  },
  {
    amountInCents: 20000,
    date: '2024-01-02',
    categoryName: 'Category 2',
    categoryType: 'Income' as const,
    description: 'Test Entry 2',
  },
];

const largeDataSet = Array.from({ length: 15 }, (_, index) => ({
  amountInCents: (index + 1) * 10000,
  date: `2024-01-${String(index + 1).padStart(2, '0')}`,
  categoryName: `Category ${index + 1}`,
  categoryType: index % 2 === 0 ? 'Expense' : 'Income',
  description: `Test Entry ${index + 1}`,
  field1: `Field 1 ${index + 1}`,
  field2: `Field 2 ${index + 1}`,
  field3: `Field 3 ${index + 1}`,
  field4: `Field 4 ${index + 1}`,
  field5: `Field 5 ${index + 1}`,
  field6: `Field 6 ${index + 1}`,
  field7: `Field 7 ${index + 1}`,
  field8: `Field 8 ${index + 1}`,
  field9: `Field 9 ${index + 1}`,
  field10: `Field 10 ${index + 1}`,
  field11: `Field 11 ${index + 1}`,
  field12: `Field 12 ${index + 1}`,
}));

describe('ImportPreview', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with empty data', () => {
    render(<ImportPreview {...defaultProps} />);
    
    expect(screen.getByText('Preview (0 items)')).toBeInTheDocument();
    expect(screen.getByText('Review the data before importing')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Import 0 Items')).toBeInTheDocument();
  });

  it('renders with sample data', () => {
    render(<ImportPreview {...defaultProps} data={sampleData} />);
    
    expect(screen.getByText('Preview (2 items)')).toBeInTheDocument();
    expect(screen.getByText('Test Entry 1')).toBeInTheDocument();
    expect(screen.getByText('Test Entry 2')).toBeInTheDocument();
    expect(screen.getByText('10000')).toBeInTheDocument();
    expect(screen.getByText('20000')).toBeInTheDocument();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByText('Import 2 Items')).toBeInTheDocument();
  });

  it('shows only first 10 items when data has more than 10 items', () => {
    render(<ImportPreview {...defaultProps} data={largeDataSet} />);
    
    expect(screen.getByText('Preview (15 items)')).toBeInTheDocument();
    expect(screen.getByText('Test Entry 1')).toBeInTheDocument();
    expect(screen.getByText('Test Entry 10')).toBeInTheDocument();
    expect(screen.queryByText('Test Entry 11')).not.toBeInTheDocument();
    expect(screen.getByText('Showing first 10 of 15 items')).toBeInTheDocument();
    expect(screen.getByText('Import 15 Items')).toBeInTheDocument();
  });

  it('shows only first 10 columns when data has more than 10 columns', () => {
    render(<ImportPreview {...defaultProps} data={largeDataSet} />);
    
    expect(screen.getByText('amountInCents')).toBeInTheDocument();
    expect(screen.getByText('date')).toBeInTheDocument();
    expect(screen.getByText('categoryName')).toBeInTheDocument();
    expect(screen.getByText('categoryType')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
    expect(screen.getByText('field1')).toBeInTheDocument();
    expect(screen.getByText('field2')).toBeInTheDocument();
    expect(screen.getByText('field3')).toBeInTheDocument();
    expect(screen.getByText('field4')).toBeInTheDocument();
    expect(screen.getByText('field5')).toBeInTheDocument();
    expect(screen.queryByText('field6')).not.toBeInTheDocument();
    expect(screen.queryByText('field7')).not.toBeInTheDocument();
    expect(screen.queryByText('field8')).not.toBeInTheDocument();
    expect(screen.queryByText('field9')).not.toBeInTheDocument();
    expect(screen.queryByText('field10')).not.toBeInTheDocument();
    expect(screen.queryByText('field11')).not.toBeInTheDocument();
    expect(screen.queryByText('field12')).not.toBeInTheDocument();
    expect(screen.getByText('Showing first 10 of 17 columns')).toBeInTheDocument();
  });

  it('shows both item and column limits when both are exceeded', () => {
    render(<ImportPreview {...defaultProps} data={largeDataSet} />);
    
    expect(screen.getByText('Showing first 10 of 15 items')).toBeInTheDocument();
    expect(screen.getByText('Showing first 10 of 17 columns')).toBeInTheDocument();
  });

  it('handles null/undefined values in data', () => {
    const dataWithNulls = [
      {
        amountInCents: 10000,
        date: '2024-01-01',
        categoryName: 'Category',
        categoryType: 'Expense' as const,
        description: 'Test Entry',
        field1: null,
        field2: undefined,
      },
    ];
    
    render(<ImportPreview {...defaultProps} data={dataWithNulls} />);
    
    expect(screen.getByText('Test Entry')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Expense')).toBeInTheDocument();
    expect(screen.getAllByText('-')).toHaveLength(2);
  });

  it('calls onCancel when cancel button is clicked', () => {
    render(<ImportPreview {...defaultProps} data={sampleData} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onImport when import button is clicked', () => {
    render(<ImportPreview {...defaultProps} data={sampleData} />);
    
    const importButton = screen.getByText('Import 2 Items');
    fireEvent.click(importButton);
    
    expect(mockOnImport).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when isProcessing is true', () => {
    render(<ImportPreview {...defaultProps} data={sampleData} isProcessing={true} />);
    
    const cancelButton = screen.getByText('Cancel');
    const importButton = screen.getByText('Importing...');
    
    expect(cancelButton).toBeDisabled();
    expect(importButton).toBeDisabled();
  });

  it('shows processing state in import button', () => {
    render(<ImportPreview {...defaultProps} data={sampleData} isProcessing={true} />);
    
    expect(screen.getByText('Importing...')).toBeInTheDocument();
    expect(screen.queryByText('Import 2 Items')).not.toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<ImportPreview {...defaultProps} data={sampleData} />);
    
    expect(screen.getByText('amountInCents')).toBeInTheDocument();
    expect(screen.getByText('date')).toBeInTheDocument();
    expect(screen.getByText('categoryName')).toBeInTheDocument();
    expect(screen.getByText('categoryType')).toBeInTheDocument();
    expect(screen.getByText('description')).toBeInTheDocument();
  });

  it('renders table data correctly', () => {
    render(<ImportPreview {...defaultProps} data={sampleData} />);
    
    expect(screen.getByText('Test Entry 1')).toBeInTheDocument();
    expect(screen.getByText('Test Entry 2')).toBeInTheDocument();
    expect(screen.getByText('10000')).toBeInTheDocument();
    expect(screen.getByText('20000')).toBeInTheDocument();
    expect(screen.getByText('2024-01-01')).toBeInTheDocument();
    expect(screen.getByText('2024-01-02')).toBeInTheDocument();
    expect(screen.getByText('Category 1')).toBeInTheDocument();
    expect(screen.getByText('Category 2')).toBeInTheDocument();
    expect(screen.getByText('Expense')).toBeInTheDocument();
    expect(screen.getByText('Income')).toBeInTheDocument();
  });
}); 