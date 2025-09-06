import { render, screen, fireEvent } from '@testing-library/react';
import { EXPENSE_ITEM_NAME_PLURAL, INCOME_ITEM_NAME } from '@/app/cashflow';
import { RecurringCashFlowPage } from '@/app/cashflow/recurring';

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
}));

describe('RecurringCashFlowPage', () => {
  it('renders the page correctly', () => {
    render(<RecurringCashFlowPage />);
    
    expect(screen.getByTestId(cashFlowPageTestId)).toBeInTheDocument();
  });

  it('shows radio buttons for Income and Expense', () => {
    render(<RecurringCashFlowPage />);
    
    expect(screen.getByLabelText(INCOME_ITEM_NAME)).toBeInTheDocument();
    expect(screen.getByLabelText(EXPENSE_ITEM_NAME_PLURAL)).toBeInTheDocument();
  });

  it('switches back to Income when Income radio is selected', () => {
    render(<RecurringCashFlowPage />);
    
    const incomeRadio = screen.getByLabelText(INCOME_ITEM_NAME);
    const expenseRadio = screen.getByLabelText(EXPENSE_ITEM_NAME_PLURAL);
    
    // First switch to Expense
    fireEvent.click(expenseRadio);
    expect(expenseRadio).toBeChecked();
    
    // Then switch back to Income
    fireEvent.click(incomeRadio);
    expect(incomeRadio).toBeChecked();
    expect(screen.getByTestId(cashFlowTypeTestId)).toHaveTextContent(INCOME_ITEM_NAME);
  });

  it('has proper radio button grouping', () => {
    render(<RecurringCashFlowPage />);
    
    const incomeRadio = screen.getByLabelText(INCOME_ITEM_NAME) as HTMLInputElement;
    const expenseRadio = screen.getByLabelText(EXPENSE_ITEM_NAME_PLURAL) as HTMLInputElement;
    
    expect(incomeRadio.name).toBe('cashflow-type');
    expect(expenseRadio.name).toBe('cashflow-type');
  });
});
