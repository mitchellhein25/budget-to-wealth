import { render, screen } from '@testing-library/react';
import { CashFlowPage } from './CashFlowPage';
import { INCOME_ITEM_NAME, EXPENSE_ITEM_NAME } from './components/constants';

describe('CashFlowPage', () => {
  it('renders the page correctly', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByText(`${INCOME_ITEM_NAME} Page`)).toBeInTheDocument();
  });

  it('renders different cash flow types', () => {
    render(<CashFlowPage cashFlowType={EXPENSE_ITEM_NAME} />);
    
    expect(screen.getByText(`${EXPENSE_ITEM_NAME} Page`)).toBeInTheDocument();
  });

  it('renders with custom cash flow type', () => {
    const customType = 'Custom Type';
    render(<CashFlowPage cashFlowType={customType} />);
    
    expect(screen.getByText(`${customType} Page`)).toBeInTheDocument();
  });
}); 