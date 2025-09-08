import React from 'react';
import { render, screen } from '@testing-library/react';
import { HoldingInvestmentReturn } from '@/app/net-worth/investment-returns';
import { HoldingInvestmentReturnList } from '@/app/net-worth/investment-returns/components/list/holding-investment-return-list/HoldingInvestmentReturnList';


const mockOnHoldingInvestmentReturnDeleted = jest.fn();
const mockOnHoldingInvestmentReturnIsEditing = jest.fn();
const mockHandleDelete = jest.fn();

jest.mock('@/app/components', () => ({
  ListTable: ({ title, headerRow, bodyRow, mobileRow, items, isError, isLoading }: { 
    title: string; 
    headerRow: React.ReactNode; 
    bodyRow: (item: HoldingInvestmentReturn) => React.ReactNode;
    mobileRow: (item: HoldingInvestmentReturn) => React.ReactNode;
    items: HoldingInvestmentReturn[]; 
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
              {items.map((item: HoldingInvestmentReturn) => bodyRow(item))}
            </tbody>
          </table>
          <div data-testid="mobile-rows">
            {items.map((item: HoldingInvestmentReturn) => mobileRow(item))}
          </div>
        </>
      )}
    </div>
  )
}));

jest.mock('@/app/net-worth/investment-returns', () => ({
  DesktopHoldingInvestmentReturnRow: ({ 
    investmentReturn, 
    onEdit, 
    onDelete 
  }: { 
    investmentReturn: HoldingInvestmentReturn; 
    onEdit: (investmentReturn: HoldingInvestmentReturn) => void; 
    onDelete: (id: number) => void; 
  }) => (
    <tr data-testid={`desktop-row-${investmentReturn.id}`}>
      <td>{investmentReturn.name}</td>
      <td>{investmentReturn.returnPercentage !== undefined ? `${investmentReturn.returnPercentage.toFixed(2)}%` : 'undefined'}</td>
      <td>{investmentReturn.totalContributions}</td>
      <td>{investmentReturn.totalWithdrawals}</td>
      <td>
        <button onClick={() => onEdit(investmentReturn)} data-testid={`edit-${investmentReturn.id}`}>Edit</button>
        <button onClick={() => onDelete(investmentReturn.id!)} data-testid={`delete-${investmentReturn.id}`}>Delete</button>
      </td>
    </tr>
  ),
  
  MobileHoldingInvestmentReturnCard: ({ 
    investmentReturn, 
    onEdit, 
    onDelete 
  }: { 
    investmentReturn: HoldingInvestmentReturn; 
    onEdit: (investmentReturn: HoldingInvestmentReturn) => void; 
    onDelete: (id: number) => void; 
  }) => (
    <div data-testid={`mobile-card-${investmentReturn.id}`}>
      <div>{investmentReturn.name}</div>
      <div>{investmentReturn.returnPercentage !== undefined ? `${investmentReturn.returnPercentage.toFixed(2)}%` : 'undefined'}</div>
      <div>{investmentReturn.totalContributions}</div>
      <div>{investmentReturn.totalWithdrawals}</div>
      <button onClick={() => onEdit(investmentReturn)} data-testid={`mobile-edit-${investmentReturn.id}`}>Edit</button>
      <button onClick={() => onDelete(investmentReturn.id!)} data-testid={`mobile-delete-${investmentReturn.id}`}>Delete</button>
    </div>
  )
}));

describe('HoldingInvestmentReturnList', () => {
  const mockTableHeaderRow = (
    <tr>
      <th>Holding</th>
      <th>Return %</th>
      <th>Contributions</th>
      <th>Withdrawals</th>
      <th>Actions</th>
    </tr>
  );

  const mockHoldingInvestmentReturns: HoldingInvestmentReturn[] = [
    {
      id: 1,
      date: '2024-01-15',
      startHoldingSnapshotId: 'snapshot-1',
      endHoldingSnapshotId: 'snapshot-2',
      startHoldingSnapshot: {
        id: 1,
        date: '2024-01-01',
        balance: 10000,
        holdingId: 'holding-1',
        holding: {
          id: 1,
          name: 'Vanguard 500',
          institution: 'Vanguard',
          type: 'Asset' as const,
          holdingCategoryId: '1',
          holdingCategory: {
            id: 1,
            name: 'Stocks',
            date: '2024-01-01'
          },
          date: '2024-01-01'
        }
      },
      endHoldingSnapshot: {
        id: 2,
        date: '2024-01-15',
        balance: 11000,
        holdingId: 'holding-1',
        holding: {
          id: 1,
          name: 'Vanguard 500',
          institution: 'Vanguard',
          type: 'Asset' as const,
          holdingCategoryId: '1',
          holdingCategory: {
            id: 1,
            name: 'Stocks',
            date: '2024-01-01'
          },
          date: '2024-01-01'
        }
      },
      totalContributions: 1000,
      totalWithdrawals: 0,
      returnPercentage: 10.0
    },
    {
      id: 2,
      date: '2024-01-16',
      startHoldingSnapshotId: 'snapshot-3',
      endHoldingSnapshotId: 'snapshot-4',
      startHoldingSnapshot: {
        id: 3,
        date: '2024-01-01',
        balance: 5000,
        holdingId: 'holding-2',
        holding: {
          id: 2,
          name: 'Bond Fund',
          institution: 'Fidelity',
          type: 'Asset' as const,
          holdingCategoryId: '2',
          holdingCategory: {
            id: 2,
            name: 'Bonds',
            date: '2024-01-01'
          },
          date: '2024-01-01'
        }
      },
      endHoldingSnapshot: {
        id: 4,
        date: '2024-01-16',
        balance: 5200,
        holdingId: 'holding-2',
        holding: {
          id: 2,
          name: 'Bond Fund',
          institution: 'Fidelity',
          type: 'Asset' as const,
          holdingCategoryId: '2',
          holdingCategory: {
            id: 2,
            name: 'Bonds',
            date: '2024-01-01'
          },
          date: '2024-01-01'
        }
      },
      totalContributions: 200,
      totalWithdrawals: 0,
      returnPercentage: 4.0
    },
    {
      id: 3,
      date: '2024-01-17',
      startHoldingSnapshotId: 'snapshot-5',
      endHoldingSnapshotId: 'snapshot-6',
      startHoldingSnapshot: {
        id: 5,
        date: '2024-01-01',
        balance: 8000,
        holdingId: 'holding-3',
        holding: {
          id: 3,
          name: 'Real Estate Fund',
          institution: 'Schwab',
          type: 'Asset' as const,
          holdingCategoryId: '3',
          holdingCategory: {
            id: 3,
            name: 'Real Estate',
            date: '2024-01-01'
          },
          date: '2024-01-01'
        }
      },
      endHoldingSnapshot: {
        id: 6,
        date: '2024-01-17',
        balance: 8400,
        holdingId: 'holding-3',
        holding: {
          id: 3,
          name: 'Real Estate Fund',
          institution: 'Schwab',
          type: 'Asset' as const,
          holdingCategoryId: '3',
          holdingCategory: {
            id: 3,
            name: 'Real Estate',
            date: '2024-01-01'
          },
          date: '2024-01-01'
        }
      },
      totalContributions: 400,
      totalWithdrawals: 0,
      returnPercentage: 5.0
    }
  ];

  const defaultProps = {
    holdingInvestmentReturns: mockHoldingInvestmentReturns,
    onHoldingInvestmentReturnDeleted: mockOnHoldingInvestmentReturnDeleted,
    onHoldingInvestmentReturnIsEditing: mockOnHoldingInvestmentReturnIsEditing,
    tableHeaderRow: mockTableHeaderRow,
    handleDelete: mockHandleDelete,
    isLoading: false,
    isError: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders component with correct title', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    expect(screen.getByText('Holding Investment Returns')).toBeInTheDocument();
  });

  it('renders ListTable with correct props', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    const listTable = screen.getByTestId('list-table');
    expect(listTable).toBeInTheDocument();
  });

  it('renders desktop rows for each investment return', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    expect(screen.getByTestId('desktop-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-row-3')).toBeInTheDocument();
  });

  it('renders mobile cards for each investment return', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    expect(screen.getByTestId('mobile-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-3')).toBeInTheDocument();
  });

  it('displays investment return data correctly in desktop rows', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    const desktopRow1 = screen.getByTestId('desktop-row-1');
    expect(desktopRow1).toHaveTextContent('Vanguard 500 - Stocks');
    expect(desktopRow1).toHaveTextContent('10.00%');
    expect(desktopRow1).toHaveTextContent('1000');
    expect(desktopRow1).toHaveTextContent('0');
    
    const desktopRow2 = screen.getByTestId('desktop-row-2');
    expect(desktopRow2).toHaveTextContent('Bond Fund - Bonds');
    expect(desktopRow2).toHaveTextContent('4.00%');
    expect(desktopRow2).toHaveTextContent('200');
    expect(desktopRow2).toHaveTextContent('0');
  });

  it('displays investment return data correctly in mobile cards', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    const mobileCard1 = screen.getByTestId('mobile-card-1');
    expect(mobileCard1).toHaveTextContent('Vanguard 500 - Stocks');
    expect(mobileCard1).toHaveTextContent('10.00%');
    expect(mobileCard1).toHaveTextContent('1000');
    expect(mobileCard1).toHaveTextContent('0');
    
    const mobileCard2 = screen.getByTestId('mobile-card-2');
    expect(mobileCard2).toHaveTextContent('Bond Fund - Bonds');
    expect(mobileCard2).toHaveTextContent('4.00%');
    expect(mobileCard2).toHaveTextContent('200');
    expect(mobileCard2).toHaveTextContent('0');
  });

  it('generates display names for investment returns without names', () => {
    const returnsWithoutNames = mockHoldingInvestmentReturns.map(returnItem => ({
      ...returnItem,
      name: undefined,
      date: '2024-01-15'
    }));

    render(
      <HoldingInvestmentReturnList 
        {...defaultProps} 
        holdingInvestmentReturns={returnsWithoutNames} 
      />
    );

    const desktopRow1 = screen.getByTestId('desktop-row-1');
    expect(desktopRow1).toHaveTextContent('Vanguard 500 - Stocks');
    
    const desktopRow2 = screen.getByTestId('desktop-row-2');
    expect(desktopRow2).toHaveTextContent('Bond Fund - Bonds');
    
    const desktopRow3 = screen.getByTestId('desktop-row-3');
    expect(desktopRow3).toHaveTextContent('Real Estate Fund - Real Estate');
  });

  it('handles empty investment returns array', () => {
    render(
      <HoldingInvestmentReturnList 
        {...defaultProps} 
        holdingInvestmentReturns={[]} 
      />
    );

    const listTable = screen.getByTestId('list-table');
    expect(listTable).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-row-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-card-1')).not.toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    render(
      <HoldingInvestmentReturnList 
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
      <HoldingInvestmentReturnList 
        {...defaultProps} 
        isError={true} 
      />
    );

    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-row-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('mobile-card-1')).not.toBeInTheDocument();
  });

  it('passes correct props to desktop rows', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    const editButton1 = screen.getByTestId('edit-1');
    const deleteButton1 = screen.getByTestId('delete-1');

    expect(editButton1).toBeInTheDocument();
    expect(deleteButton1).toBeInTheDocument();
  });

  it('passes correct props to mobile cards', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    const mobileEditButton1 = screen.getByTestId('mobile-edit-1');
    const mobileDeleteButton1 = screen.getByTestId('mobile-delete-1');

    expect(mobileEditButton1).toBeInTheDocument();
    expect(mobileDeleteButton1).toBeInTheDocument();
  });

  it('handles investment returns with missing optional fields', () => {
    const returnsWithMissingFields: HoldingInvestmentReturn[] = [
      {
        id: 4,
        date: '2024-01-18',
        startHoldingSnapshotId: 'snapshot-7',
        endHoldingSnapshotId: 'snapshot-8',
        startHoldingSnapshot: {
          id: 7,
          date: '2024-01-01',
          balance: 3000,
          holdingId: 'holding-4',
          holding: {
            id: 4,
            name: 'Commodities Fund',
            institution: 'BlackRock',
            type: 'Asset' as const,
            holdingCategoryId: '4',
            holdingCategory: {
              id: 4,
              name: 'Commodities',
              date: '2024-01-01'
            },
            date: '2024-01-01'
          }
        },
        endHoldingSnapshot: {
          id: 8,
          date: '2024-01-18',
          balance: 3150,
          holdingId: 'holding-4',
          holding: {
            id: 4,
            name: 'Commodities Fund',
            institution: 'BlackRock',
            type: 'Asset' as const,
            holdingCategoryId: '4',
            holdingCategory: {
              id: 4,
              name: 'Commodities',
              date: '2024-01-01'
            },
            date: '2024-01-01'
          }
        },
        totalContributions: 150,
        totalWithdrawals: 0
      }
    ];

    render(
      <HoldingInvestmentReturnList 
        {...defaultProps} 
        holdingInvestmentReturns={returnsWithMissingFields} 
      />
    );

    const desktopRow4 = screen.getByTestId('desktop-row-4');
    expect(desktopRow4).toHaveTextContent('Commodities Fund - Commodities');
    expect(desktopRow4).toHaveTextContent('undefined');
    expect(desktopRow4).toHaveTextContent('150');
    expect(desktopRow4).toHaveTextContent('0');
  });

  it('handles investment returns with zero return percentage', () => {
    const returnsWithZeroReturn: HoldingInvestmentReturn[] = [
      {
        id: 5,
        date: '2024-01-19',
        startHoldingSnapshotId: 'snapshot-9',
        endHoldingSnapshotId: 'snapshot-10',
        startHoldingSnapshot: {
          id: 9,
          date: '2024-01-01',
          balance: 10000,
          holdingId: 'holding-5',
          holding: {
            id: 5,
            name: 'Cash Fund',
            institution: 'Vanguard',
            type: 'Asset' as const,
            holdingCategoryId: '5',
            holdingCategory: {
              id: 5,
              name: 'Cash',
              date: '2024-01-01'
            },
            date: '2024-01-01'
          }
        },
        endHoldingSnapshot: {
          id: 10,
          date: '2024-01-19',
          balance: 10000,
          holdingId: 'holding-5',
          holding: {
            id: 5,
            name: 'Cash Fund',
            institution: 'Vanguard',
            type: 'Asset' as const,
            holdingCategoryId: '5',
            holdingCategory: {
              id: 5,
              name: 'Cash',
              date: '2024-01-01'
            },
            date: '2024-01-01'
          }
        },
        totalContributions: 0,
        totalWithdrawals: 0,
        returnPercentage: 0
      }
    ];

    render(
      <HoldingInvestmentReturnList 
        {...defaultProps} 
        holdingInvestmentReturns={returnsWithZeroReturn} 
      />
    );

    const desktopRow5 = screen.getByTestId('desktop-row-5');
    expect(desktopRow5).toHaveTextContent('Cash Fund - Cash');
    expect(desktopRow5).toHaveTextContent('0.00%');
    expect(desktopRow5).toHaveTextContent('0');
    expect(desktopRow5).toHaveTextContent('0');
  });
});
