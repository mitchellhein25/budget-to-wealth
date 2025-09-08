import { render, screen } from '@testing-library/react';
import { EXPENSE_ITEM_NAME } from '@/app/cashflow';
import { ExpensesPage } from '@/app/cashflow/expenses/page';

const cashFlowPageTestId = 'cash-flow-page';
const cashFlowPageText = 'Cash Flow Page';
const cashFlowTypeTestId = 'cash-flow-type';

jest.mock('@/app/cashflow', () => ({
  ...jest.requireActual('@/app/cashflow'),
  CashFlowPage: ({ cashFlowType }: { cashFlowType: string }) => (
    <div data-testid={cashFlowPageTestId}>
      <div>{cashFlowPageText}</div>
      <div data-testid={cashFlowTypeTestId}>{cashFlowType}</div>
    </div>
  ),
  RecurrenceFrequency: {  },
}));

describe('Expenses', () => {
  it('renders the page correctly', () => {
    render(<ExpensesPage />);
    
    expect(screen.getByTestId(cashFlowPageTestId)).toBeInTheDocument();
  });

  it('passes correct cashFlowType to CashFlowPage', () => {
    render(<ExpensesPage />);
    
    expect(screen.getByTestId(cashFlowTypeTestId)).toHaveTextContent(EXPENSE_ITEM_NAME);
  });
}); 