import React from 'react';
import { render, screen } from '@testing-library/react';
import { RecurrenceFrequency } from '@/app/cashflow';
import { ManualInvestmentReturnList, ManualInvestmentReturn } from '@/app/net-worth/investment-returns';

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
  DesktopManualInvestmentReturnRow: ({ 
    investmentReturn, 
    onEdit, 
    onDelete 
  }: { 
    investmentReturn: ManualInvestmentReturn; 
    onEdit: (investmentReturn: ManualInvestmentReturn) => void; 
    onDelete: (id: number) => void; 
  }) => (
    <tr data-testid={`desktop-row-${investmentReturn.id}`}>
      <td>{investmentReturn.name}</td>
      <td>{investmentReturn.manualInvestmentPercentageReturn.toFixed(2)}%</td>
      <td>{investmentReturn.manualInvestmentReturnDate}</td>
      <td>
        <button onClick={() => onEdit(investmentReturn)} data-testid={`edit-${investmentReturn.id}`}>Edit</button>
        <button onClick={() => onDelete(investmentReturn.id!)} data-testid={`delete-${investmentReturn.id}`}>Delete</button>
      </td>
    </tr>
  ),
  MobileManualInvestmentReturnCard: ({ 
    investmentReturn, 
    onEdit, 
    onDelete 
  }: { 
    investmentReturn: ManualInvestmentReturn; 
    onEdit: (investmentReturn: ManualInvestmentReturn) => void; 
    onDelete: (id: number) => void; 
  }) => (
    <div data-testid={`mobile-card-${investmentReturn.id}`}>
      <div>{investmentReturn.name}</div>
      <div>{investmentReturn.manualInvestmentPercentageReturn.toFixed(2)}%</div>
      <div>{investmentReturn.manualInvestmentReturnDate}</div>
      <button onClick={() => onEdit(investmentReturn)} data-testid={`mobile-edit-${investmentReturn.id}`}>Edit</button>
      <button onClick={() => onDelete(investmentReturn.id!)} data-testid={`mobile-delete-${investmentReturn.id}`}>Delete</button>
    </div>
  )
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
      manualInvestmentCategoryId: '2',
      manualInvestmentCategory: {
        id: 2,
        name: 'Bonds',
        date: '2024-01-01'
      },
      manualInvestmentReturnDate: '2024-01-16',
      manualInvestmentPercentageReturn: 3.25,
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY
    },
    {
      id: 3,
      date: '2024-01-17',
      manualInvestmentCategoryId: '3',
      manualInvestmentCategory: {
        id: 3,
        name: 'Real Estate',
        date: '2024-01-01'
      },
      manualInvestmentReturnDate: '2024-01-17',
      manualInvestmentPercentageReturn: 8.50
    }
  ];

  const defaultProps = {
    manualInvestmentReturns: mockManualInvestmentReturns,
    onManualInvestmentReturnDeleted: mockOnManualInvestmentReturnDeleted,
    onManualInvestmentReturnIsEditing: mockOnManualInvestmentReturnIsEditing,
    tableHeaderRow: mockTableHeaderRow,
    handleDelete: mockHandleDelete,
    isLoading: false,
    isError: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with correct title', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    expect(screen.getByText('Manual Investment Returns')).toBeInTheDocument();
  });

  it('renders ListTable with correct props', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    const listTable = screen.getByTestId('list-table');
    expect(listTable).toBeInTheDocument();
  });

  it('renders desktop rows for each investment return', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    expect(screen.getByTestId('desktop-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-row-3')).toBeInTheDocument();
  });

  it('renders mobile cards for each investment return', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    expect(screen.getByTestId('mobile-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-3')).toBeInTheDocument();
  });

  it('displays investment return data correctly in desktop rows', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    const desktopRow1 = screen.getByTestId('desktop-row-1');
    expect(desktopRow1).toHaveTextContent('Stocks');
    expect(desktopRow1).toHaveTextContent('5.75%');
    expect(desktopRow1).toHaveTextContent('2024-01-15');
    
    const desktopRow2 = screen.getByTestId('desktop-row-2');
    expect(desktopRow2).toHaveTextContent('Bonds');
    expect(desktopRow2).toHaveTextContent('3.25%');
    expect(desktopRow2).toHaveTextContent('2024-01-16');
  });

  it('displays investment return data correctly in mobile cards', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    const mobileCard1 = screen.getByTestId('mobile-card-1');
    expect(mobileCard1).toHaveTextContent('Stocks');
    expect(mobileCard1).toHaveTextContent('5.75%');
    expect(mobileCard1).toHaveTextContent('2024-01-15');
    
    const mobileCard2 = screen.getByTestId('mobile-card-2');
    expect(mobileCard2).toHaveTextContent('Bonds');
    expect(mobileCard2).toHaveTextContent('3.25%');
    expect(mobileCard2).toHaveTextContent('2024-01-16');
  });

  it('generates display names for investment returns without names', () => {
    const returnsWithoutNames = mockManualInvestmentReturns.map(returnItem => ({
      ...returnItem,
      name: undefined,
      date: returnItem.manualInvestmentReturnDate
    }));

    render(
      <ManualInvestmentReturnList 
        {...defaultProps} 
        manualInvestmentReturns={returnsWithoutNames} 
      />
    );

    const desktopRow1 = screen.getByTestId('desktop-row-1');
    expect(desktopRow1).toHaveTextContent('Stocks');
    
    const desktopRow2 = screen.getByTestId('desktop-row-2');
    expect(desktopRow2).toHaveTextContent('Bonds');
    
    const desktopRow3 = screen.getByTestId('desktop-row-3');
    expect(desktopRow3).toHaveTextContent('Real Estate');
  });

  it('handles empty investment returns array', () => {
    render(
      <ManualInvestmentReturnList 
        {...defaultProps} 
        manualInvestmentReturns={[]} 
      />
    );

    const listTable = screen.getByTestId('list-table');
    expect(listTable).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-row-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-card-1')).not.toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <ManualInvestmentReturnList 
        {...defaultProps} 
        isLoading={true} 
      />
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-row-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-card-1')).not.toBeInTheDocument();
  });

  it('shows error state when isError is true', () => {
    render(
      <ManualInvestmentReturnList 
        {...defaultProps} 
        isError={true} 
      />
    );

    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-row-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-card-1')).not.toBeInTheDocument();
  });

  it('passes correct props to desktop rows', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    const editButton1 = screen.getByTestId('edit-1');
    const deleteButton1 = screen.getByTestId('delete-1');

    expect(editButton1).toBeInTheDocument();
    expect(deleteButton1).toBeInTheDocument();
  });

  it('passes correct props to mobile cards', () => {
    render(<ManualInvestmentReturnList {...defaultProps} />);

    const mobileEditButton1 = screen.getByTestId('mobile-edit-1');
    const mobileDeleteButton1 = screen.getByTestId('mobile-delete-1');

    expect(mobileEditButton1).toBeInTheDocument();
    expect(mobileDeleteButton1).toBeInTheDocument();
  });

  it('handles investment returns with missing optional fields', () => {
    const returnsWithMissingFields: ManualInvestmentReturn[] = [
      {
        id: 4,
        date: '2024-01-18',
        manualInvestmentCategoryId: '4',
        manualInvestmentCategory: {
          id: 4,
          name: 'Commodities',
          date: '2024-01-01'
        },
        manualInvestmentReturnDate: '2024-01-18',
        manualInvestmentPercentageReturn: 12.75
      }
    ];

    render(
      <ManualInvestmentReturnList 
        {...defaultProps} 
        manualInvestmentReturns={returnsWithMissingFields} 
      />
    );

    const desktopRow4 = screen.getByTestId('desktop-row-4');
    expect(desktopRow4).toHaveTextContent('Commodities');
    expect(desktopRow4).toHaveTextContent('12.75%');
    expect(desktopRow4).toHaveTextContent('2024-01-18');
  });

  it('handles investment returns with recurrence frequency and end date', () => {
    const returnsWithRecurrence: ManualInvestmentReturn[] = [
      {
        id: 5,
        date: '2024-01-19',
        manualInvestmentCategoryId: '5',
        manualInvestmentCategory: {
          id: 5,
          name: 'Crypto',
          date: '2024-01-01'
        },
        manualInvestmentReturnDate: '2024-01-19',
        manualInvestmentPercentageReturn: 25.50,
        manualInvestmentRecurrenceFrequency: RecurrenceFrequency.WEEKLY,
        manualInvestmentRecurrenceEndDate: '2024-06-30'
      }
    ];

    render(
      <ManualInvestmentReturnList 
        {...defaultProps} 
        manualInvestmentReturns={returnsWithRecurrence} 
      />
    );

    const desktopRow5 = screen.getByTestId('desktop-row-5');
    expect(desktopRow5).toHaveTextContent('Crypto');
    expect(desktopRow5).toHaveTextContent('25.50%');
    expect(desktopRow5).toHaveTextContent('2024-01-19');
  });
});
