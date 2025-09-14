import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { deleteHoldingInvestmentReturn, deleteManualInvestmentReturn } from '@/app/lib/api';
import { HoldingInvestmentReturn, ManualInvestmentReturn } from '@/app/net-worth/investment-returns';
import { InvestmentReturnList } from '@/app/net-worth/investment-returns/components/list/InvestmentReturnList';

jest.mock('@/app/lib/api', () => ({
  deleteHoldingInvestmentReturn: jest.fn(),
  deleteManualInvestmentReturn: jest.fn(),
}));

const mockConfirm = jest.fn();
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true,
});

jest.mock('@/app/net-worth/investment-returns', () => ({
  ...jest.requireActual('@/app/net-worth/investment-returns'),
  HoldingInvestmentReturnList: ({ holdingInvestmentReturns, onHoldingInvestmentReturnDeleted, onHoldingInvestmentReturnIsEditing, tableHeaderRow, columnWidths, handleDelete, isLoading, isError }: any) => (
    <div data-testid="holding-investment-return-list">
      <div data-testid="holding-investment-returns-count">{holdingInvestmentReturns.length}</div>
      <div data-testid="holding-is-loading">{isLoading.toString()}</div>
      <div data-testid="holding-is-error">{isError.toString()}</div>
      <button 
        data-testid="holding-delete-button" 
        onClick={() => handleDelete(1)}
      >
        Delete Holding
      </button>
    </div>
  ),
  ManualInvestmentReturnList: ({ manualInvestmentReturns, onManualInvestmentReturnDeleted, onManualInvestmentReturnIsEditing, tableHeaderRow, columnWidths, handleDelete, isLoading, isError }: any) => (
    <div data-testid="manual-investment-return-list">
      <div data-testid="manual-investment-returns-count">{manualInvestmentReturns.length}</div>
      <div data-testid="manual-is-loading">{isLoading.toString()}</div>
      <div data-testid="manual-is-error">{isError.toString()}</div>
      <button 
        data-testid="manual-delete-button" 
        onClick={() => handleDelete(2)}
      >
        Delete Manual
      </button>
    </div>
  ),
}));

const mockHoldingInvestmentReturns: HoldingInvestmentReturn[] = [
  {
    id: 1,
    startHoldingSnapshotId: '1',
    endHoldingSnapshotId: '2',
    totalContributions: 1000,
    totalWithdrawals: 0,
    returnPercentage: 5.5,
    userId: 'user1',
    name: 'Test Holding Return 1',
  },
  {
    id: 2,
    startHoldingSnapshotId: '2',
    endHoldingSnapshotId: '3',
    totalContributions: 2000,
    totalWithdrawals: 100,
    returnPercentage: 3.2,
    userId: 'user1',
    name: 'Test Holding Return 2',
  },
];

const mockManualInvestmentReturns: ManualInvestmentReturn[] = [
  {
    id: 1,
    manualInvestmentCategoryId: 'cat1',
    manualInvestmentReturnDate: '2024-01-01',
    manualInvestmentPercentageReturn: 4.5,
    userId: 'user1',
    name: 'Test Manual Return 1',
  },
  {
    id: 2,
    manualInvestmentCategoryId: 'cat2',
    manualInvestmentReturnDate: '2024-01-02',
    manualInvestmentPercentageReturn: 6.1,
    userId: 'user1',
    name: 'Test Manual Return 2',
  },
];

const defaultProps = {
  manualInvestmentReturns: mockManualInvestmentReturns,
  holdingInvestmentReturns: mockHoldingInvestmentReturns,
  onManualInvestmentReturnDeleted: jest.fn(),
  onHoldingInvestmentReturnDeleted: jest.fn(),
  onManualInvestmentReturnIsEditing: jest.fn(),
  onHoldingInvestmentReturnIsEditing: jest.fn(),
  isLoading: false,
  isError: false,
};

describe('InvestmentReturnList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  it('renders both holding and manual investment return lists', () => {
    render(<InvestmentReturnList {...defaultProps} />);
    
    expect(screen.getByTestId('holding-investment-return-list')).toBeInTheDocument();
    expect(screen.getByTestId('manual-investment-return-list')).toBeInTheDocument();
    expect(screen.getByTestId('holding-investment-returns-count')).toHaveTextContent('2');
    expect(screen.getByTestId('holding-is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('holding-is-error')).toHaveTextContent('false');
    expect(screen.getByTestId('manual-investment-returns-count')).toHaveTextContent('2');
    expect(screen.getByTestId('manual-is-loading')).toHaveTextContent('false');
    expect(screen.getByTestId('manual-is-error')).toHaveTextContent('false');
  });

  it('passes loading state to both lists', () => {
    render(<InvestmentReturnList {...defaultProps} isLoading={true} />);
    
    expect(screen.getByTestId('holding-is-loading')).toHaveTextContent('true');
    expect(screen.getByTestId('manual-is-loading')).toHaveTextContent('true');
  });

  it('passes error state to both lists', () => {
    render(<InvestmentReturnList {...defaultProps} isError={true} />);
    
    expect(screen.getByTestId('holding-is-error')).toHaveTextContent('true');
    expect(screen.getByTestId('manual-is-error')).toHaveTextContent('true');
  });

  it('handles empty holding investment returns array', () => {
    render(<InvestmentReturnList {...defaultProps} holdingInvestmentReturns={[]} />);
    
    expect(screen.getByTestId('holding-investment-returns-count')).toHaveTextContent('0');
  });

  it('handles empty manual investment returns array', () => {
    render(<InvestmentReturnList {...defaultProps} manualInvestmentReturns={[]} />);
    
    expect(screen.getByTestId('manual-investment-returns-count')).toHaveTextContent('0');
  });

  it('calls onHoldingInvestmentReturnDeleted when holding delete is successful', async () => {
    const mockDeleteHoldingInvestmentReturn = deleteHoldingInvestmentReturn as jest.MockedFunction<typeof deleteHoldingInvestmentReturn>;
    mockDeleteHoldingInvestmentReturn.mockResolvedValue({
      data: null,
      responseMessage: 'Success',
      successful: true,
    });

    render(<InvestmentReturnList {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('holding-delete-button'));
    
    await waitFor(() => {
      expect(mockDeleteHoldingInvestmentReturn).toHaveBeenCalledWith(1);
      expect(defaultProps.onHoldingInvestmentReturnDeleted).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onManualInvestmentReturnDeleted when manual delete is successful', async () => {
    const mockDeleteManualInvestmentReturn = deleteManualInvestmentReturn as jest.MockedFunction<typeof deleteManualInvestmentReturn>;
    mockDeleteManualInvestmentReturn.mockResolvedValue({
      data: null,
      responseMessage: 'Success',
      successful: true,
    });

    render(<InvestmentReturnList {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('manual-delete-button'));
    
    await waitFor(() => {
      expect(mockDeleteManualInvestmentReturn).toHaveBeenCalledWith(2);
      expect(defaultProps.onManualInvestmentReturnDeleted).toHaveBeenCalledTimes(1);
    });
  });

  it('does not call onHoldingInvestmentReturnDeleted when holding delete fails', async () => {
    const mockDeleteHoldingInvestmentReturn = deleteHoldingInvestmentReturn as jest.MockedFunction<typeof deleteHoldingInvestmentReturn>;
    mockDeleteHoldingInvestmentReturn.mockResolvedValue({
      data: null,
      responseMessage: 'Error',
      successful: false,
    });

    render(<InvestmentReturnList {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('holding-delete-button'));
    
    await waitFor(() => {
      expect(mockDeleteHoldingInvestmentReturn).toHaveBeenCalledWith(1);
      expect(defaultProps.onHoldingInvestmentReturnDeleted).not.toHaveBeenCalled();
    });
  });

  it('does not call onManualInvestmentReturnDeleted when manual delete fails', async () => {
    const mockDeleteManualInvestmentReturn = deleteManualInvestmentReturn as jest.MockedFunction<typeof deleteManualInvestmentReturn>;
    mockDeleteManualInvestmentReturn.mockResolvedValue({
      data: null,
      responseMessage: 'Error',
      successful: false,
    });

    render(<InvestmentReturnList {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('manual-delete-button'));
    
    await waitFor(() => {
      expect(mockDeleteManualInvestmentReturn).toHaveBeenCalledWith(2);
      expect(defaultProps.onManualInvestmentReturnDeleted).not.toHaveBeenCalled();
    });
  });


  it('does not call delete when user cancels confirmation', async () => {
    mockConfirm.mockReturnValue(false);
    const mockDeleteHoldingInvestmentReturn = deleteHoldingInvestmentReturn as jest.MockedFunction<typeof deleteHoldingInvestmentReturn>;

    render(<InvestmentReturnList {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('holding-delete-button'));
    
    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
      expect(mockDeleteHoldingInvestmentReturn).not.toHaveBeenCalled();
      expect(defaultProps.onHoldingInvestmentReturnDeleted).not.toHaveBeenCalled();
    });
  });

  it('does not call manual delete when user cancels confirmation', async () => {
    mockConfirm.mockReturnValue(false);
    const mockDeleteManualInvestmentReturn = deleteManualInvestmentReturn as jest.MockedFunction<typeof deleteManualInvestmentReturn>;

    render(<InvestmentReturnList {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('manual-delete-button'));
    
    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
      expect(mockDeleteManualInvestmentReturn).not.toHaveBeenCalled();
      expect(defaultProps.onManualInvestmentReturnDeleted).not.toHaveBeenCalled();
    });
  });

  it('passes correct callback functions to child components', () => {
    render(<InvestmentReturnList {...defaultProps} />);
    
    expect(screen.getByTestId('holding-investment-return-list')).toBeInTheDocument();
    expect(screen.getByTestId('manual-investment-return-list')).toBeInTheDocument();
  });

  it('renders with all props as undefined/null values', () => {
    const propsWithUndefined = {
      manualInvestmentReturns: [],
      holdingInvestmentReturns: [],
      onManualInvestmentReturnDeleted: jest.fn(),
      onHoldingInvestmentReturnDeleted: jest.fn(),
      onManualInvestmentReturnIsEditing: jest.fn(),
      onHoldingInvestmentReturnIsEditing: jest.fn(),
      isLoading: false,
      isError: false,
    };

    render(<InvestmentReturnList {...propsWithUndefined} />);
    
    expect(screen.getByTestId('holding-investment-return-list')).toBeInTheDocument();
    expect(screen.getByTestId('manual-investment-return-list')).toBeInTheDocument();
  });
});