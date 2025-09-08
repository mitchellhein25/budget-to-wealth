import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { getCategoriesList } from '@/app/lib/api';
import { CashFlowCategory, CashFlowType, RecurrenceFrequency, INCOME_ITEM_NAME, EXPENSE_ITEM_NAME } from '@/app/cashflow';
import { CashFlowEntriesInputs } from '@/app/cashflow/components/form/CashFlowEntriesInputs';

interface MockLinkProps {
  children: React.ReactNode;
  href: string;
  [key: string]: unknown;
}

jest.mock('@/app/lib/api', () => ({
  getCategoriesList: jest.fn(),
}));

jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: MockLinkProps) {
    return <a href={href} {...props}>{children}</a>;
  };
});

jest.mock('@/app/cashflow', () => ({
  RecurrenceFrequency: {  },
}));

const mockGetCategoriesList = getCategoriesList as jest.MockedFunction<typeof getCategoriesList>;

const mockCategories: CashFlowCategory[] = [
  { id: 1, name: 'Salary', categoryType: 'Income' },
  { id: 2, name: 'Freelance', categoryType: 'Income' },
  { id: 3, name: 'Investment', categoryType: 'Income' },
];

const defaultProps = {
  editingFormData: {},
  onChange: jest.fn(),
  cashFlowType: INCOME_ITEM_NAME as CashFlowType,
  setIsLoading: jest.fn(),
};

describe('CashFlowEntriesInputs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetCategoriesList.mockResolvedValue({
      successful: true,
      data: mockCategories,
      responseMessage: 'Success',
    });
  });

  it('renders all required form fields', async () => {
    await act(async () => {
      render(<CashFlowEntriesInputs {...defaultProps} />);
    });

    expect(screen.getByText('Amount*')).toBeInTheDocument();
    expect(screen.getByText('Date*')).toBeInTheDocument();
    expect(screen.getByText('Category*')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Recurrence Frequency')).toBeInTheDocument();
  });

  it('renders hidden id input when editingFormData has id', async () => {
    const editingFormData = { id: 'test-id-123' };
    await act(async () => {
      render(<CashFlowEntriesInputs {...defaultProps} editingFormData={editingFormData} />);
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
      date: new Date('2024-01-15'),
      categoryId: '2',
      description: 'Test description'
    };
    await act(async () => {
      render(<CashFlowEntriesInputs {...defaultProps} editingFormData={editingFormData} />);
    });

    expect(screen.getByDisplayValue('test-id-123')).toBeInTheDocument();
    expect(screen.getByDisplayValue('150.75')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    
    await waitFor(() => {
      const categorySelect = screen.getByDisplayValue('Freelance').closest('select') as HTMLSelectElement;
      expect(categorySelect.value).toBe('2');
    });
  });

  it('fetches and displays categories', async () => {
    await act(async () => {
      render(<CashFlowEntriesInputs {...defaultProps} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Salary')).toBeInTheDocument();
      expect(screen.getByText('Freelance')).toBeInTheDocument();
      expect(screen.getByText('Investment')).toBeInTheDocument();
    });
  });

  it('renders edit categories link for income', async () => {
    await act(async () => {
      render(<CashFlowEntriesInputs {...defaultProps} />);
    });

    await waitFor(() => {
      const editLink = screen.getByTitle('Edit Income Categories');
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', '/cashflow/income/income-categories');
    });
  });

  it('renders edit categories link for expense', async () => {
    const expenseProps = {
      ...defaultProps,
      cashFlowType: EXPENSE_ITEM_NAME as CashFlowType,
    };

    await act(async () => {
      render(<CashFlowEntriesInputs {...expenseProps} />);
    });

    await waitFor(() => {
      const editLink = screen.getByTitle('Edit Expense Categories');
      expect(editLink).toBeInTheDocument();
      expect(editLink).toHaveAttribute('href', '/cashflow/expenses/expense-categories');
    });
  });

  it('handles API error gracefully', async () => {
    mockGetCategoriesList.mockResolvedValue({
      successful: false,
      data: null,
      responseMessage: 'Error fetching categories',
    });

    await act(async () => {
      render(<CashFlowEntriesInputs {...defaultProps} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Pick a category')).toBeInTheDocument();
    });
  });

  it('shows recurrence end date when recurrence frequency is selected', async () => {
    const editingFormData = { 
      recurrenceFrequency: RecurrenceFrequency.MONTHLY
    };
    await act(async () => {
      render(<CashFlowEntriesInputs {...defaultProps} editingFormData={editingFormData} />);
    });

    await waitFor(() => {
      expect(screen.getByText('Recurrence End Date')).toBeInTheDocument();
      expect(screen.getByText('No end date')).toBeInTheDocument();
    });
  });

  it('does not show recurrence end date when no recurrence frequency', async () => {
    await act(async () => {
      render(<CashFlowEntriesInputs {...defaultProps} />);
    });

    expect(screen.queryByText('Recurrence End Date')).not.toBeInTheDocument();
    expect(screen.queryByText('No end date')).not.toBeInTheDocument();
  });
}); 