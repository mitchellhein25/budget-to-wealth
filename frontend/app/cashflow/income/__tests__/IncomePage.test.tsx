import { render, screen } from '@testing-library/react';
import { INCOME_ITEM_NAME } from '@/app/cashflow';
import IncomePage from '@/app/cashflow/income/page';

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

describe('Income', () => {
  it('renders the page correctly', () => {
    render(<IncomePage />);
    
    expect(screen.getByTestId(cashFlowPageTestId)).toBeInTheDocument();
  });

  it('passes correct cashFlowType to CashFlowPage', () => {
    render(<IncomePage />);
    
    expect(screen.getByTestId(cashFlowTypeTestId)).toHaveTextContent(INCOME_ITEM_NAME);
  });
}); 