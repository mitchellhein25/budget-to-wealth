import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { getExpenseCategoriesList } from '@/app/lib/api/data-methods';
import { CashFlowCategory } from '@/app/cashflow/components';
import { BudgetInputs } from '../';

jest.mock('@/app/lib/api/data-methods', () => ({
  getExpenseCategoriesList: jest.fn(),
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>;
  };
});

const mockGetExpenseCategoriesList = getExpenseCategoriesList as jest.MockedFunction<typeof getExpenseCategoriesList>;

const mockCategories: CashFlowCategory[] = [
  { id: 1, name: 'Groceries', categoryType: 'Expense' },
  { id: 2, name: 'Transportation', categoryType: 'Expense' },
  { id: 3, name: 'Entertainment', categoryType: 'Expense' },
];

const defaultProps = {
  editingFormData: {},
  onChange: jest.fn(),
  setIsLoading: jest.fn(),
};

describe('BudgetInputs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetExpenseCategoriesList.mockResolvedValue({
      successful: true,
      data: mockCategories,
      responseMessage: 'Success',
    });
  });

  it('renders all required form fields', async () => {
    await act(async () => {
      render(<BudgetInputs {...defaultProps} />);
    });

    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders hidden id input when editingFormData has id', async () => {
    const editingFormData = { id: 'test-id-123' };
    await act(async () => {
      render(<BudgetInputs {...defaultProps} editingFormData={editingFormData} />);
    });

    const idInput = screen.getByDisplayValue('test-id-123');
    expect(idInput).toBeInTheDocument();
    expect(idInput).toHaveAttribute('type', 'text');
    expect(idInput).toHaveAttribute('readonly');
  });

  it('displays form data values correctly', async () => {
    const editingFormData = { 
      id: 'test-id-123',
      amount: '150.75',
      categoryId: '2'
    };
    await act(async () => {
      render(<BudgetInputs {...defaultProps} editingFormData={editingFormData} />);
    });

    expect(screen.getByDisplayValue('test-id-123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('150.75')).toBeInTheDocument();
    
    await waitFor(() => {
      const categorySelect = screen.getByRole('combobox') as HTMLSelectElement;
      expect(categorySelect.value).toBe('2');
    });
  });

  it('fetches and displays categories', async () => {
    await act(async () => {
      render(<BudgetInputs {...defaultProps} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
      expect(screen.getByText('Entertainment')).toBeInTheDocument();
    });
  });

  it('renders edit categories link', async () => {
    await act(async () => {
      render(<BudgetInputs {...defaultProps} />);
    });

    await waitFor(() => {
      const editLink = screen.getByTitle('Edit Expense Categories');
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', '/cashflow/expenses/expense-categories?returnUrl=/cashflow/budget');
    });
  });

  it('handles API error gracefully', async () => {
    mockGetExpenseCategoriesList.mockResolvedValue({
      successful: false,
      data: null,
      responseMessage: 'Error fetching categories',
    });

    await act(async () => {
      render(<BudgetInputs {...defaultProps} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Pick a category')).toBeInTheDocument();
    });
  });
}); 