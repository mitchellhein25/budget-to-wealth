import React from 'react';
import { render, screen } from '@testing-library/react';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_PLURAL, HoldingInvestmentReturn } from '@/app/net-worth/investment-returns';
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
  DesktopHoldingInvestmentReturnRow: jest.fn(({ investmentReturn, onEdit, onDelete }) => (
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
  )),
  
  MobileHoldingInvestmentReturnCard: jest.fn(({ investmentReturn, onEdit, onDelete }) => (
    <div data-testid={`mobile-card-${investmentReturn.id}`}>
      <div>{investmentReturn.name}</div>
      <div>{investmentReturn.returnPercentage !== undefined ? `${investmentReturn.returnPercentage.toFixed(2)}%` : 'undefined'}</div>
      <div>{investmentReturn.totalContributions}</div>
      <div>{investmentReturn.totalWithdrawals}</div>
      <button onClick={() => onEdit(investmentReturn)} data-testid={`mobile-edit-${investmentReturn.id}`}>Edit</button>
      <button onClick={() => onDelete(investmentReturn.id!)} data-testid={`mobile-delete-${investmentReturn.id}`}>Delete</button>
    </div>
  )),
  getHoldingInvestmentReturnDisplayName: jest.fn((investmentReturn: HoldingInvestmentReturn) => 
    `${investmentReturn.endHoldingSnapshot?.holding?.name} - ${investmentReturn.endHoldingSnapshot?.holding?.holdingCategory?.name}`
  ),
  HOLDING_INVESTMENT_RETURN_ITEM_NAME_PLURAL: 'Holding Investment Returns'
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
      name: 'Vanguard 500 - Stocks',
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
      name: undefined, // This should trigger auto-generation
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
    }
  ];

  const defaultProps = {
    holdingInvestmentReturns: mockHoldingInvestmentReturns,
    onHoldingInvestmentReturnDeleted: mockOnHoldingInvestmentReturnDeleted,
    onHoldingInvestmentReturnIsEditing: mockOnHoldingInvestmentReturnIsEditing,
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
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    expect(screen.getByText(HOLDING_INVESTMENT_RETURN_ITEM_NAME_PLURAL)).toBeInTheDocument();
  });

  it('auto-generates display names for investment returns without names', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    // The second item should have its name auto-generated from the holding data
    const desktopRow2 = screen.getByTestId('desktop-row-2');
    expect(desktopRow2).toHaveTextContent('Bond Fund - Bonds');
  });

  it('renders desktop and mobile components for each investment return', () => {
    render(<HoldingInvestmentReturnList {...defaultProps} />);

    expect(screen.getByTestId('desktop-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-2')).toBeInTheDocument();
  });
});
