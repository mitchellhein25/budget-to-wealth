import { render, screen } from '@testing-library/react';
import Income from './page';
import { INCOME_ITEM_NAME } from '@/app/cashflow';

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

describe('Income', () => {
  it('renders the page correctly', () => {
    render(<Income />);
    
    expect(screen.getByTestId(cashFlowPageTestId)).toBeInTheDocument();
  });

  it('passes correct cashFlowType to CashFlowPage', () => {
    render(<Income />);
    
    expect(screen.getByTestId(cashFlowTypeTestId)).toHaveTextContent(INCOME_ITEM_NAME);
  });
}); 