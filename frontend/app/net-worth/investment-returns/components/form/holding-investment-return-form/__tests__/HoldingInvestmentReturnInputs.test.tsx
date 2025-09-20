import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { HoldingInvestmentReturnInputs } from '@/app/net-worth/investment-returns/components/form/holding-investment-return-form/HoldingInvestmentReturnInputs';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK } from '@/app/net-worth/investment-returns';
import { HOLDING_SNAPSHOT_ITEM_NAME_LINK, NET_WORTH_ITEM_NAME_LINK } from '@/app/net-worth/holding-snapshots';
import { HOLDING_ITEM_NAME_LOWERCASE_PLURAL } from '@/app/net-worth/holding-snapshots/holdings';


const editHoldingsLinkTestId = 'edit-holdings-link';

jest.mock('@/app/components', () => ({
  InputFieldSetTemplate: ({ label, isRequired, inputChild }: { label: string, isRequired: boolean, inputChild: React.ReactNode }) => (
    <div data-testid={`field-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <label>{label}</label>
      <div data-testid={`required-${label.toLowerCase().replace(/\s+/g, '-')}`}>{isRequired.toString()}</div>
      {inputChild}
    </div>
  ),
  CurrencyInputField: ({ id, name, value, onChange, placeholder, className }: { 
    id: string; 
    name: string; 
    value: string; 
    onChange: React.ChangeEventHandler; 
    placeholder: string; 
    className: string; 
  }) => (
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
      data-testid={`currency-input-${name}`}
    />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, className, title }: { children: React.ReactNode, href: string, className: string, title: string }) => (
    <a data-testid={editHoldingsLinkTestId} href={href} className={className} title={title}>
      {children}
    </a>
  ),
}));

jest.mock('lucide-react', () => ({
  Edit: () => <span data-testid="edit-icon">Edit</span>,
}));

jest.mock('@/app/lib/utils', () => ({
  convertDateToISOString: (date: Date) => date.toISOString().split('T')[0],
  convertToDate: (dateString: string) => new Date(dateString),
  formatDate: (date: Date) => date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }),
  replaceSpacesWithDashes: (str: string) => str.replace(/\s+/g, '-'),
}));

describe('HoldingInvestmentReturnInputs', () => {
  const mockOnChange = jest.fn();
  const formId = HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;

  const mockStartSnapshots = [
    {
      id: 1,
      date: '2024-01-01',
      balance: 10000,
      holdingId: 'holding-1',
      holding: { 
        id: 1,
        name: 'Vanguard 500', 
        institution: 'Vanguard',
        type: 'Asset' as const,
        holdingCategoryId: '1',
        date: '2024-01-01'
      }
    },
    {
      id: 2,
      date: '2024-01-02',
      balance: 15000,
      holdingId: 'holding-2',
      holding: { 
        id: 2,
        name: 'Fidelity Fund', 
        institution: 'Fidelity',
        type: 'Asset' as const,
        holdingCategoryId: '2',
        date: '2024-01-02'
      }
    }
  ];

  const mockHoldings = [
    {
      id: 1,
      name: 'Vanguard 500',
      institution: 'Vanguard',
      type: 'Asset' as const,
      holdingCategoryId: '1',
      holdingCategory: { name: 'Stocks' },
      date: '2024-01-01'
    },
    {
      id: 2,
      name: 'Fidelity Fund',
      institution: 'Fidelity',
      type: 'Asset' as const,
      holdingCategoryId: '2',
      holdingCategory: { name: 'Bonds' },
      date: '2024-01-02'
    }
  ];

  const defaultProps = {
    editingFormData: {
      startHoldingSnapshotDate: new Date(),
      startHoldingSnapshotId: '',
      endHoldingSnapshotId: '',
      endHoldingSnapshotHoldingId: '',
      endHoldingSnapshotDate: new Date(),
      endHoldingSnapshotBalance: '',
      totalContributions: '',
      totalWithdrawals: ''
    },
    onChange: mockOnChange,
    startSnapshots: mockStartSnapshots,
    holdings: mockHoldings,
    isEndHoldingLocked: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields with correct labels and requirements', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    expect(screen.getByTestId('field-start-snapshot-date')).toBeInTheDocument();
    expect(screen.getByTestId('field-start-snapshot')).toBeInTheDocument();
    expect(screen.getByTestId('field-holding')).toBeInTheDocument();
    expect(screen.getByTestId('field-date')).toBeInTheDocument();
    expect(screen.getByTestId('field-balance')).toBeInTheDocument();
    expect(screen.getByTestId('field-total-contributions')).toBeInTheDocument();
    expect(screen.getByTestId('field-total-withdrawals')).toBeInTheDocument();

    expect(screen.getByTestId('required-start-snapshot-date')).toHaveTextContent('true');
    expect(screen.getByTestId('required-start-snapshot')).toHaveTextContent('true');
    expect(screen.getByTestId('required-holding')).toHaveTextContent('true');
    expect(screen.getByTestId('required-date')).toHaveTextContent('true');
    expect(screen.getByTestId('required-balance')).toHaveTextContent('true');
    expect(screen.getByTestId('required-total-contributions')).toHaveTextContent('false');
    expect(screen.getByTestId('required-total-withdrawals')).toHaveTextContent('false');
  });


  it('displays provided values in form fields', () => {
    const editingFormData = {
      id: '123',
      startHoldingSnapshotDate: new Date('2024-01-01'),
      startHoldingSnapshotId: '1',
      endHoldingSnapshotHoldingId: '1',
      endHoldingSnapshotDate: new Date('2024-01-31'),
      endHoldingSnapshotBalance: '12000.00',
      totalContributions: '2000.00',
      totalWithdrawals: '500.00',
      endHoldingSnapshotId: '456'
    };

    render(<HoldingInvestmentReturnInputs {...defaultProps} editingFormData={editingFormData} />);

    const balanceInput = screen.getByTestId('currency-input-holding-investment-return-endHoldingSnapshotBalance');
    expect(balanceInput).toHaveDisplayValue('12000.00');

    const contributionsInput = screen.getByTestId('currency-input-holding-investment-return-totalContributions');
    expect(contributionsInput).toHaveDisplayValue('2000.00');

    const withdrawalsInput = screen.getByTestId('currency-input-holding-investment-return-totalWithdrawals');
    expect(withdrawalsInput).toHaveDisplayValue('500.00');
  });

  it('displays edit holdings link with correct attributes', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const editLink = screen.getByTestId(editHoldingsLinkTestId);
    expect(editLink).toHaveAttribute('href', `/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_SNAPSHOT_ITEM_NAME_LINK}/${HOLDING_ITEM_NAME_LOWERCASE_PLURAL}?returnUrl=/${NET_WORTH_ITEM_NAME_LINK}/${INVESTMENT_RETURN_ITEM_NAME_PLURAL_LINK}`);
    expect(editLink).toHaveAttribute('title', 'Edit Holdings');
    expect(editLink).toHaveClass('btn', 'btn-ghost', 'btn-sm', 'btn-circle');
  });

  it('displays edit icon', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('calls onChange when form fields are modified', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const balanceInput = screen.getByTestId('currency-input-holding-investment-return-endHoldingSnapshotBalance');
    fireEvent.change(balanceInput, { target: { value: '15000.00' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        name: `${formId}-endHoldingSnapshotBalance`
      })
    }));
  });

  it('automatically sets end holding when start snapshot is selected', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const startSnapshotSelect = screen.getByTestId('field-start-snapshot').querySelector('select') as HTMLSelectElement;
    fireEvent.change(startSnapshotSelect, { target: { value: '1' } });

    expect(mockOnChange).toHaveBeenCalledTimes(2);
    expect(mockOnChange).toHaveBeenLastCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        name: `${formId}-endHoldingSnapshotHoldingId`,
        value: 'holding-1'
      })
    }));
  });

  it('handles empty editingFormData gracefully', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const balanceInput = screen.getByTestId('currency-input-holding-investment-return-endHoldingSnapshotBalance');
    expect(balanceInput).toHaveDisplayValue('');

    const contributionsInput = screen.getByTestId('currency-input-holding-investment-return-totalContributions');
    expect(contributionsInput).toHaveDisplayValue('');
  });

  it('disables end holding select when isEndHoldingLocked is true', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} isEndHoldingLocked={true} />);

    const holdingSelect = screen.getByTestId('field-holding').querySelector('select') as HTMLSelectElement;
    expect(holdingSelect).toBeDisabled();
  });

  it('enables end holding select when isEndHoldingLocked is false', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} isEndHoldingLocked={false} />);

    const holdingSelect = screen.getByTestId('field-holding').querySelector('select') as HTMLSelectElement;
    expect(holdingSelect).not.toBeDisabled();
  });

});
