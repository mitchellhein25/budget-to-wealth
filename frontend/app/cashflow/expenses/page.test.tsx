import { render, screen } from '@testing-library/react';
import Expenses from './page';
import { EXPENSE_ITEM_NAME } from '@/app/cashflow/components';

const cashFlowPageTestId = 'cash-flow-page';
const cashFlowPageText = 'Cash Flow Page';
const cashFlowTypeTestId = 'cash-flow-type';

jest.mock('@/app/cashflow/components', () => ({
  ...jest.requireActual('@/app/cashflow/components'),
  CashFlowPage: ({ cashFlowType }: { cashFlowType: string }) => (
    <div data-testid={cashFlowPageTestId}>
      <div>{cashFlowPageText}</div>
      <div data-testid={cashFlowTypeTestId}>{cashFlowType}</div>
    </div>
  ),
}));

describe('Expenses', () => {
  it('renders the page correctly', () => {
    render(<Expenses />);
    
    expect(screen.getByTestId(cashFlowPageTestId)).toBeInTheDocument();
  });

  it('passes correct cashFlowType to CashFlowPage', () => {
    render(<Expenses />);
    
    expect(screen.getByTestId(cashFlowTypeTestId)).toHaveTextContent(EXPENSE_ITEM_NAME);
  });
}); 