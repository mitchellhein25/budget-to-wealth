import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { getCategoriesList } from '@/app/lib/api';
import { CashFlowCategory, CashFlowType, RecurrenceFrequency } from '@/app/cashflow';
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
  RecurrenceFrequency: { 
    DAILY: 'Daily',
    WEEKLY: 'Weekly',
    EVERY_2_WEEKS: 'Every 2 Weeks',
    MONTHLY: 'Monthly',
    QUARTERLY: 'Quarterly',
    YEARLY: 'Yearly'
  },
  CashFlowType: { 
    INCOME: 'Income',
    EXPENSE: 'Expense'
  },
  INCOME_ITEM_NAME_LOWERCASE: 'income',
  EXPENSE_ITEM_NAME_LOWERCASE_PLURAL: 'expenses',
  CASHFLOW_ITEM_NAME_LOWERCASE: 'cashflow'
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
  cashFlowType: CashFlowType.INCOME,
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

    await waitFor(() => {
      expect(screen.getByText('Amount*')).toBeInTheDocument();
      expect(screen.getByText('Date*')).toBeInTheDocument();
      expect(screen.getByText('Category*')).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Recurrence Frequency')).toBeInTheDocument();
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
      cashFlowType: CashFlowType.EXPENSE,
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