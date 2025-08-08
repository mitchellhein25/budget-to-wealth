import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HoldingsList } from '../HoldingsList';
import { Holding } from '../../Holding';
import { deleteHolding } from '@/app/lib/api/data-methods';
import { HOLDING_ITEM_NAME } from '../../constants';

jest.mock('@/app/hooks/useMobileDetection', () => ({
  useMobileDetection: () => ({ isMobile: false, isDesktop: true }),
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  deleteHolding: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  DesktopListItemRow: ({ children, onEdit, onDelete }: { children: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <tr>
      {children}
      <td>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </td>
    </tr>
  ),
  DesktopListItemCell: ({ children, title }: { children: React.ReactNode; title?: string }) => (
    <td title={title}>{children}</td>
  ),
  MobileListItemCard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card">
      {children}
    </div>
  ),
  MobileListItemCardHeader: ({ leftContent, rightContent }: { leftContent: React.ReactNode; rightContent?: React.ReactNode }) => (
    <div data-testid="mobile-list-item-card-header">
      <div>{leftContent}</div>
      <div>{rightContent}</div>
    </div>
  ),
  MobileListItemCardContent: ({ description, onEdit, onDelete }: { description: React.ReactNode; onEdit: () => void; onDelete: () => void }) => (
    <div data-testid="mobile-list-item-card-content">
      {description}
      <div>
        <button onClick={onEdit}>Edit</button>
        <button onClick={onDelete}>Delete</button>
      </div>
    </div>
  ),
}));

const mockDeleteHolding = deleteHolding as jest.MockedFunction<typeof deleteHolding>;

describe('HoldingsList', () => {
  const testTexts = {
    confirmDeleteMessage: 'Are you sure you want to delete this?',
    loadingText: 'Loading...',
    errorText: 'Failed to load data. Please try again.',
    tableHeaders: {
      name: 'Name',
      institution: 'Institution',
      category: 'Category',
      type: 'Type',
    },
    ariaLabels: {
      edit: 'Edit',
      delete: 'Delete',
    },
  };

  const mockHoldings: Holding[] = [
    {
      id: 1,
      name: 'Test Holding 1',
      type: 'Asset',
      holdingCategoryId: '1',
      holdingCategory: {
        id: 1,
        name: 'Test Category 1',
      },
      institution: 'Test Bank 1',
    },
    {
      id: 2,
      name: 'Test Holding 2',
      type: 'Debt',
      holdingCategoryId: '2',
      holdingCategory: {
        id: 2,
        name: 'Test Category 2',
      },
      institution: 'Test Bank 2',
    },
  ];

  const mockProps = {
    holdings: mockHoldings,
    onHoldingDeleted: jest.fn(),
    onHoldingIsEditing: jest.fn(),
    isLoading: false,
    isError: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    global.confirm = jest.fn();
  });

  describe('rendering', () => {
    it('should render the table with correct title', () => {
      render(<HoldingsList {...mockProps} />);
      
      expect(screen.getByText(`${HOLDING_ITEM_NAME}s`)).toBeInTheDocument();
    });



    it('should render holdings data correctly', () => {
      render(<HoldingsList {...mockProps} />);
      
      expect(screen.getByText('Test Holding 1')).toBeInTheDocument();
      expect(screen.getByText('Test Bank 1')).toBeInTheDocument();
      expect(screen.getByText('Test Category 1')).toBeInTheDocument();
      expect(screen.getByText('Asset')).toBeInTheDocument();
      
      expect(screen.getByText('Test Holding 2')).toBeInTheDocument();
      expect(screen.getByText('Test Bank 2')).toBeInTheDocument();
      expect(screen.getByText('Test Category 2')).toBeInTheDocument();
      expect(screen.getByText('Debt')).toBeInTheDocument();
    });

    it('should render edit and delete buttons for each holding', () => {
      render(<HoldingsList {...mockProps} />);
      
      const editButtons = screen.getAllByText('Edit');
      const deleteButtons = screen.getAllByText('Delete');
      
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });

    it('should render buttons with correct aria labels', () => {
      render(<HoldingsList {...mockProps} />);
      
      const editButtons = screen.getAllByText('Edit');
      const deleteButtons = screen.getAllByText('Delete');
      
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });

  describe('loading state', () => {
    it('should show loading spinner when isLoading is true', () => {
      render(<HoldingsList {...mockProps} isLoading={true} />);
      
      expect(screen.getByText(testTexts.loadingText)).toBeInTheDocument();
    });

    it('should not show table content when loading', () => {
      render(<HoldingsList {...mockProps} isLoading={true} />);
      
      expect(screen.queryByText('Test Holding 1')).not.toBeInTheDocument();
      expect(screen.queryByText(testTexts.tableHeaders.name)).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error message when isError is true', () => {
      render(<HoldingsList {...mockProps} isError={true} />);
      
      expect(screen.getByText(testTexts.errorText)).toBeInTheDocument();
    });

    it('should not show table content when error', () => {
      render(<HoldingsList {...mockProps} isError={true} />);
      
      expect(screen.queryByText('Test Holding 1')).not.toBeInTheDocument();
      expect(screen.queryByText(testTexts.tableHeaders.name)).not.toBeInTheDocument();
    });
  });

  describe('edit functionality', () => {
    it('should call onHoldingIsEditing when edit button is clicked', () => {
      render(<HoldingsList {...mockProps} />);
      
      const editButtons = screen.getAllByText('Edit');
      fireEvent.click(editButtons[0]);
      
      expect(mockProps.onHoldingIsEditing).toHaveBeenCalledWith(mockHoldings[0]);
    });

    it('should call onHoldingIsEditing with correct holding for each edit button', () => {
      render(<HoldingsList {...mockProps} />);
      
      const editButtons = screen.getAllByText('Edit');
      
      fireEvent.click(editButtons[0]);
      expect(mockProps.onHoldingIsEditing).toHaveBeenCalledWith(mockHoldings[0]);
      
      fireEvent.click(editButtons[1]);
      expect(mockProps.onHoldingIsEditing).toHaveBeenCalledWith(mockHoldings[1]);
    });
  });

  describe('delete functionality', () => {
    it('should show confirmation dialog when delete button is clicked', () => {
      render(<HoldingsList {...mockProps} />);
      
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      expect(global.confirm).toHaveBeenCalledWith(testTexts.confirmDeleteMessage);
    });

    it('should call deleteHolding API when user confirms deletion', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);
      mockDeleteHolding.mockResolvedValue({ data: null, responseMessage: 'Deleted successfully', successful: true });
      
      render(<HoldingsList {...mockProps} />);
      
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(mockDeleteHolding).toHaveBeenCalledWith(mockHoldings[0].id);
      });
    });

    it('should call onHoldingDeleted when deletion is successful', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);
      mockDeleteHolding.mockResolvedValue({ data: null, responseMessage: 'Deleted successfully', successful: true });
      
      render(<HoldingsList {...mockProps} />);
      
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(mockProps.onHoldingDeleted).toHaveBeenCalled();
      });
    });

    it('should not call onHoldingDeleted when deletion fails', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);
      mockDeleteHolding.mockResolvedValue({ data: null, responseMessage: 'Deletion failed', successful: false });
      
      render(<HoldingsList {...mockProps} />);
      
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(mockDeleteHolding).toHaveBeenCalledWith(mockHoldings[0].id);
      });
      
      expect(mockProps.onHoldingDeleted).not.toHaveBeenCalled();
    });

    it('should not call deleteHolding when user cancels confirmation', () => {
      (global.confirm as jest.Mock).mockReturnValue(false);
      
      render(<HoldingsList {...mockProps} />);
      
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      expect(mockDeleteHolding).not.toHaveBeenCalled();
    });

    it('should call deleteHolding with correct holding ID for each delete button', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);
      mockDeleteHolding.mockResolvedValue({ data: null, responseMessage: 'Deleted successfully', successful: true });
      
      render(<HoldingsList {...mockProps} />);
      
      const deleteButtons = screen.getAllByText('Delete');
      
      fireEvent.click(deleteButtons[0]);
      await waitFor(() => {
        expect(mockDeleteHolding).toHaveBeenCalledWith(mockHoldings[0].id);
      });
      
      fireEvent.click(deleteButtons[1]);
      await waitFor(() => {
        expect(mockDeleteHolding).toHaveBeenCalledWith(mockHoldings[1].id);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty holdings array', () => {
      render(<HoldingsList {...mockProps} holdings={[]} />);
      
      expect(screen.getByText(`${HOLDING_ITEM_NAME}s`)).toBeInTheDocument();
    });

    it('should handle holdings without holdingCategory', () => {
      const holdingsWithoutCategory: Holding[] = [
        {
          id: 1,
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: '1',
          institution: 'Test Bank',
        },
      ];
      
      render(<HoldingsList {...mockProps} holdings={holdingsWithoutCategory} />);
      
      expect(screen.getByText('Test Holding')).toBeInTheDocument();
      expect(screen.getByText('Test Bank')).toBeInTheDocument();
      expect(screen.getByText('Asset')).toBeInTheDocument();
    });

    it('should handle holdings without institution', () => {
      const holdingsWithoutInstitution: Holding[] = [
        {
          id: 1,
          name: 'Test Holding',
          type: 'Asset',
          holdingCategoryId: '1',
          holdingCategory: {
            id: 1,
            name: 'Test Category',
          },
        },
      ];
      
      render(<HoldingsList {...mockProps} holdings={holdingsWithoutInstitution} />);
      
      expect(screen.getByText('Test Holding')).toBeInTheDocument();
      expect(screen.getByText('Test Category')).toBeInTheDocument();
      expect(screen.getByText('Asset')).toBeInTheDocument();
    });

    it('should not call onHoldingDeleted when API call fails', async () => {
      (global.confirm as jest.Mock).mockReturnValue(true);
      mockDeleteHolding.mockResolvedValue({ data: null, responseMessage: 'API Error', successful: false });
      
      render(<HoldingsList {...mockProps} />);
      
      const deleteButtons = screen.getAllByText('Delete');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        expect(mockDeleteHolding).toHaveBeenCalledWith(mockHoldings[0].id);
      });
      
      expect(mockProps.onHoldingDeleted).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('should have proper button accessibility attributes', () => {
      render(<HoldingsList {...mockProps} />);
      
      const editButtons = screen.getAllByText('Edit');
      const deleteButtons = screen.getAllByText('Delete');
      
      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });
  });
}); 