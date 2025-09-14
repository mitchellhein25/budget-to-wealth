import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecurrenceFrequency } from '@/app/cashflow';
import { ManualInvestmentReturn, MANUAL_INVESTMENT_RETURN_ITEM_NAME_PLURAL } from '@/app/net-worth/investment-returns';
import { ManualInvestmentReturnList } from '@/app/net-worth/investment-returns/components/list/manual-investment-return-list/ManualInvestmentReturnList';

const mockOnManualInvestmentReturnDeleted = jest.fn();
const mockOnManualInvestmentReturnIsEditing = jest.fn();
const mockHandleDelete = jest.fn();

jest.mock('@/app/components', () => ({
  ListTable: ({ title, headerRow, bodyRow, mobileRow, items, isError, isLoading }: { 
    title: string; 
    headerRow: React.ReactNode; 
    bodyRow: (item: ManualInvestmentReturn) => React.ReactNode;
    mobileRow: (item: ManualInvestmentReturn) => React.ReactNode;
    items: ManualInvestmentReturn[]; 
    isError: boolean; 
    isLoading: boolean 
  }) => (
    <div data-testid="list-table">
      <h2>{title}</h2>
      {isLoading && <div data-testid="loading">Loading...</div>}
      {isError && <div data-testid="error">Error loading data</div>}
      {!isLoading && !isError && (
        <>
          <table>
            <thead>{headerRow}</thead>
            <tbody>
              {items.map((item: ManualInvestmentReturn) => bodyRow(item))}
            </tbody>
          </table>
          <div data-testid="mobile-rows">
            {items.map((item: ManualInvestmentReturn) => mobileRow(item))}
          </div>
        </>
      )}
    </div>
  )
}));

jest.mock('@/app/net-worth/investment-returns', () => ({
  DesktopManualInvestmentReturnRow: jest.fn(({ investmentReturn, onEdit, onDelete }) => (
    <tr data-testid={`desktop-row-${investmentReturn.id}`}>
      <td>{investmentReturn.name}</td>
      <td>{investmentReturn.manualInvestmentPercentageReturn.toFixed(2)}%</td>
      <td>{investmentReturn.manualInvestmentReturnDate}</td>
      <td>
        <button onClick={() => onEdit(investmentReturn)} data-testid={`edit-${investmentReturn.id}`}>Edit</button>
        <button onClick={() => onDelete(investmentReturn.id!)} data-testid={`delete-${investmentReturn.id}`}>Delete</button>
      </td>
    </tr>
  )),
  MobileManualInvestmentReturnCard: jest.fn(({ investmentReturn, onEdit, onDelete }) => (
    <div data-testid={`mobile-card-${investmentReturn.id}`}>
      <div>{investmentReturn.name}</div>
      <div>{investmentReturn.manualInvestmentPercentageReturn.toFixed(2)}%</div>
      <div>{investmentReturn.manualInvestmentReturnDate}</div>
      <button onClick={() => onEdit(investmentReturn)} data-testid={`mobile-edit-${investmentReturn.id}`}>Edit</button>
      <button onClick={() => onDelete(investmentReturn.id!)} data-testid={`mobile-delete-${investmentReturn.id}`}>Delete</button>
    </div>
  )),
  getManualInvestmentReturnDisplayName: jest.fn((investmentReturn: ManualInvestmentReturn) => 
    investmentReturn.manualInvestmentCategory?.name || 'Unknown Category'
  ),
  MANUAL_INVESTMENT_RETURN_ITEM_NAME_PLURAL: 'Manual Investment Returns'
}));

describe('ManualInvestmentReturnList', () => {
  const mockTableHeaderRow = (
    <tr>
      <th>Category</th>
      <th>Return %</th>
      <th>Date</th>
      <th>Actions</th>
    </tr>
  );

  const mockManualInvestmentReturns: ManualInvestmentReturn[] = [
    {
      id: 1,
      date: '2024-01-15',
      name: 'Stocks',
      manualInvestmentCategoryId: '1',
      manualInvestmentCategory: {
        id: 1,
        name: 'Stocks',
        date: '2024-01-01'
      },
      manualInvestmentReturnDate: '2024-01-15',
      manualInvestmentPercentageReturn: 5.75,
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY,
      manualInvestmentRecurrenceEndDate: '2024-12-31'
    },
    {
      id: 2,
      date: '2024-01-16',
      name: undefined, // This should trigger auto-generation
      manualInvestmentCategoryId: '2',
      manualInvestmentCategory: {
        id: 2,
        name: 'Bonds',
        date: '2024-01-01'
      },
      manualInvestmentReturnDate: '2024-01-16',
      manualInvestmentPercentageReturn: 3.25,
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY
    }
  ];

  const defaultProps = {
    manualInvestmentReturns: mockManualInvestmentReturns,
    onManualInvestmentReturnDeleted: mockOnManualInvestmentReturnDeleted,
    onManualInvestmentReturnIsEditing: mockOnManualInvestmentReturnIsEditing,
    tableHeaderRow: mockTableHeaderRow,
    columnWidths: {
      investment: '30%',
      return: '20%',
      month: '20%',
      actions: '30%'
    },
    handleDelete: mockHandleDelete,
    isLoading: false,
    isError: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('passes correct title to ListTable', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    expect(screen.getByText(MANUAL_INVESTMENT_RETURN_ITEM_NAME_PLURAL)).toBeInTheDocument();
  });

  it('auto-generates display names for investment returns without names', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    // The second item should have its name auto-generated from the category data
    const desktopRow2 = screen.getByTestId('desktop-row-2');
    expect(desktopRow2).toHaveTextContent('Bonds');
  });

  it('renders desktop and mobile components for each investment return', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    expect(screen.getByTestId('desktop-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-2')).toBeInTheDocument();
  });
});
