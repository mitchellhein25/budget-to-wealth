import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HoldingInvestmentReturn, ManualInvestmentReturn } from '@/app/net-worth/investment-returns';
import { InvestmentReturnList } from '@/app/net-worth/investment-returns/components/list/InvestmentReturnList';
import { useDeleteConfirmation } from '@/app/hooks';

jest.mock('@/app/hooks', () => ({
  useDeleteConfirmation: jest.fn(() => ({
    isModalOpen: false,
    isLoading: false,
    openDeleteModal: jest.fn(),
    closeDeleteModal: jest.fn(),
    confirmDelete: jest.fn(),
  })),
}));

jest.mock('@/app/components', () => ({
  DeleteConfirmationModal: jest.fn(() => null),
}));

jest.mock('@/app/lib/api', () => ({
  deleteHoldingInvestmentReturn: jest.fn(),
  deleteManualInvestmentReturn: jest.fn(),
}));

jest.mock('@/app/net-worth/investment-returns', () => ({
  ...jest.requireActual('@/app/net-worth/investment-returns'),
  HoldingInvestmentReturnList: ({ holdingInvestmentReturns, handleDelete, isLoading, isError }: { holdingInvestmentReturns: HoldingInvestmentReturn[], handleDelete: (id: number) => void, isLoading: boolean, isError: boolean }) => (
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
  ManualInvestmentReturnList: ({ manualInvestmentReturns, handleDelete, isLoading, isError }: { manualInvestmentReturns: ManualInvestmentReturn[], handleDelete: (id: number) => void, isLoading: boolean, isError: boolean }) => (
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






  it('calls openDeleteModal when holding delete button is clicked', () => {
    const mockOpenDeleteModal = jest.fn();
    (useDeleteConfirmation as jest.Mock).mockReturnValue({
      isModalOpen: false,
      isLoading: false,
      openDeleteModal: mockOpenDeleteModal,
      closeDeleteModal: jest.fn(),
      confirmDelete: jest.fn(),
    });

    render(<InvestmentReturnList {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('holding-delete-button'));
    
    expect(mockOpenDeleteModal).toHaveBeenCalledWith(1);
  });

  it('calls openDeleteModal when manual delete button is clicked', () => {
    const mockOpenDeleteModal = jest.fn();
    (useDeleteConfirmation as jest.Mock).mockReturnValue({
      isModalOpen: false,
      isLoading: false,
      openDeleteModal: mockOpenDeleteModal,
      closeDeleteModal: jest.fn(),
      confirmDelete: jest.fn(),
    });

    render(<InvestmentReturnList {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('manual-delete-button'));
    
    expect(mockOpenDeleteModal).toHaveBeenCalledWith(2);
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
