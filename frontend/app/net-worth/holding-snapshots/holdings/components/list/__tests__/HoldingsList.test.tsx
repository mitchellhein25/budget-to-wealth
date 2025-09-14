import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HOLDING_ITEM_NAME, Holding } from '@/app/net-worth/holding-snapshots/holdings';
import { HoldingsList } from '@/app/net-worth/holding-snapshots/holdings/components/list/HoldingsList';

jest.mock('@/app/hooks', () => ({
  useMobileDetection: () => ({ isMobile: false, isDesktop: true }),
}));

jest.mock('@/app/lib/api', () => ({
  deleteHolding: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  ListTable: jest.fn(({ title, headerRow, bodyRow, mobileRow, items, isError, isLoading }: {
    title: string;
    headerRow: React.ReactNode;
    bodyRow: (item: Holding) => React.ReactNode;
    mobileRow: (item: Holding) => React.ReactNode;
    items: Holding[];
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
              {items.map((item: Holding) => bodyRow(item))}
            </tbody>
          </table>
          <div data-testid="mobile-rows">
            {items.map((item: Holding) => mobileRow(item))}
          </div>
        </>
      )}
    </div>
  ))
}));

jest.mock('@/app/net-worth/holding-snapshots/holdings', () => ({
  DesktopHoldingRow: jest.fn(({ holding, onEdit, onDelete }) => (
    <tr data-testid={`desktop-row-${holding.id}`}>
      <td>{holding.name}</td>
      <td>{holding.institution}</td>
      <td>{holding.holdingCategory?.name}</td>
      <td>{holding.type}</td>
      <td>
        <button onClick={() => onEdit(holding)} data-testid={`edit-${holding.id}`}>Edit</button>
        <button onClick={() => onDelete(holding.id!)} data-testid={`delete-${holding.id}`}>Delete</button>
      </td>
    </tr>
  )),
  MobileHoldingCard: jest.fn(({ holding, onEdit, onDelete }) => (
    <div data-testid={`mobile-card-${holding.id}`}>
      <div>{holding.name}</div>
      <div>{holding.institution}</div>
      <div>{holding.holdingCategory?.name}</div>
      <div>{holding.type}</div>
      <button onClick={() => onEdit(holding)} data-testid={`mobile-edit-${holding.id}`}>Edit</button>
      <button onClick={() => onDelete(holding.id!)} data-testid={`mobile-delete-${holding.id}`}>Delete</button>
    </div>
  )),
  HOLDING_ITEM_NAME: 'Holding'
}));

describe('HoldingsList', () => {
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

  it('passes correct title to ListTable', () => {
    render(<HoldingsList {...mockProps} />);

    expect(screen.getByText(`${HOLDING_ITEM_NAME}s`)).toBeInTheDocument();
  });

  it('renders desktop and mobile components for each holding', () => {
    render(<HoldingsList {...mockProps} />);

    expect(screen.getByTestId('desktop-row-1')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-row-2')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('mobile-card-2')).toBeInTheDocument();
  });

  it('calls onHoldingIsEditing when edit button is clicked', () => {
    render(<HoldingsList {...mockProps} />);
    
    const editButton = screen.getByTestId('edit-1');
    fireEvent.click(editButton);
    
    expect(mockProps.onHoldingIsEditing).toHaveBeenCalledWith(mockHoldings[0]);
  });

  it('shows confirmation dialog when delete button is clicked', () => {
    render(<HoldingsList {...mockProps} />);
    
    const deleteButton = screen.getByTestId('delete-1');
    fireEvent.click(deleteButton);
    
    expect(global.confirm).toHaveBeenCalledWith('Are you sure you want to delete this?');
  });
}); 