import { render, screen, fireEvent } from '@testing-library/react';
import { NET_WORTH_ITEM_NAME_LINK } from '@/app/net-worth/holding-snapshots';
import { HOLDING_ITEM_NAME_LOWERCASE_PLURAL } from '@/app/net-worth/holding-snapshots/holdings';
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, HoldingInvestmentReturnInputs } from '@/app/net-worth/investment-returns';

const editHoldingsLinkTestId = 'edit-holdings-link';

jest.mock('@/app/components', () => ({
  InputFieldSetTemplate: ({ label, isRequired, inputChild }: { label: string, isRequired: boolean, inputChild: React.ReactNode }) => (
    <div data-testid={`field-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <label>{label}</label>
      <div data-testid={`required-${label.toLowerCase().replace(/\s+/g, '-')}`}>{isRequired.toString()}</div>
      {inputChild}
    </div>
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

  it('renders hidden id input with correct attributes', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const idInput = screen.getByTestId('field-start-snapshot-date').parentElement?.querySelector('input[hidden]') as HTMLInputElement;
    expect(idInput).toHaveAttribute('id', `${formId}-id`);
    expect(idInput).toHaveAttribute('name', `${formId}-id`);
    expect(idInput).toHaveAttribute('readonly');
    expect(idInput).toHaveAttribute('hidden');
    expect(idInput).toHaveAttribute('type', 'text');
  });

  it('renders start snapshot date input with correct attributes', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const dateInput = screen.getByTestId('field-start-snapshot-date').querySelector('input') as HTMLInputElement;
    expect(dateInput).toHaveAttribute('id', `${formId}-startHoldingSnapshotDate`);
    expect(dateInput).toHaveAttribute('name', `${formId}-startHoldingSnapshotDate`);
    expect(dateInput).toHaveAttribute('type', 'date');
    expect(dateInput).toHaveClass('input', 'w-full');
  });

  it('renders start snapshot select with correct options', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const startSnapshotSelect = screen.getByTestId('field-start-snapshot').querySelector('select') as HTMLSelectElement;
    expect(startSnapshotSelect).toHaveAttribute('id', `${formId}-startHoldingSnapshotId`);
    expect(startSnapshotSelect).toHaveAttribute('name', `${formId}-startHoldingSnapshotId`);
    expect(startSnapshotSelect).toHaveClass('select', 'w-full');

    const options = startSnapshotSelect.querySelectorAll('option');
    expect(options).toHaveLength(3); // Including the disabled "Pick a snapshot" option
    expect(options[0]).toHaveTextContent('Pick a snapshot');
    expect(options[1]).toHaveTextContent('Vanguard 500 - Vanguard - January 1, 2024 ($100.00)');
    expect(options[2]).toHaveTextContent('Fidelity Fund - Fidelity - January 2, 2024 ($150.00)');
  });

  it('renders end holding select with correct options', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const holdingSelect = screen.getByTestId('field-holding').querySelector('select') as HTMLSelectElement;
    expect(holdingSelect).toHaveAttribute('id', `${formId}-endHoldingSnapshotHoldingId`);
    expect(holdingSelect).toHaveAttribute('name', `${formId}-endHoldingSnapshotHoldingId`);
    expect(holdingSelect).toHaveClass('select', 'flex-1');

    const options = holdingSelect.querySelectorAll('option');
    expect(options).toHaveLength(3); // Including the disabled "Pick a holding" option
    expect(options[0]).toHaveTextContent('Pick a holding');
    expect(options[1]).toHaveTextContent('Vanguard 500 - Vanguard - Stocks (Asset)');
    expect(options[2]).toHaveTextContent('Fidelity Fund - Fidelity - Bonds (Asset)');
  });

  it('renders end snapshot date input with correct attributes', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const dateInput = screen.getByTestId('field-date').querySelector('input') as HTMLInputElement;
    expect(dateInput).toHaveAttribute('id', `${formId}-endHoldingSnapshotDate`);
    expect(dateInput).toHaveAttribute('name', `${formId}-endHoldingSnapshotDate`);
    expect(dateInput).toHaveAttribute('type', 'date');
    expect(dateInput).toHaveClass('input', 'w-full');
  });

  it('renders balance input with correct attributes', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const balanceInput = screen.getByTestId('field-balance').querySelector('input') as HTMLInputElement;
    expect(balanceInput).toHaveAttribute('id', `${formId}-endHoldingSnapshotBalance`);
    expect(balanceInput).toHaveAttribute('name', `${formId}-endHoldingSnapshotBalance`);
    expect(balanceInput).toHaveAttribute('type', 'text');
    expect(balanceInput).toHaveAttribute('placeholder', '0.00');
    expect(balanceInput).toHaveClass('input', 'w-full');
  });

  it('renders total contributions input with correct attributes', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const contributionsInput = screen.getByTestId('field-total-contributions').querySelector('input') as HTMLInputElement;
    expect(contributionsInput).toHaveAttribute('id', `${formId}-totalContributions`);
    expect(contributionsInput).toHaveAttribute('name', `${formId}-totalContributions`);
    expect(contributionsInput).toHaveAttribute('type', 'text');
    expect(contributionsInput).toHaveAttribute('placeholder', '0.00');
    expect(contributionsInput).toHaveClass('input', 'w-full');
  });

  it('renders total withdrawals input with correct attributes', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const withdrawalsInput = screen.getByTestId('field-total-withdrawals').querySelector('input') as HTMLInputElement;
    expect(withdrawalsInput).toHaveAttribute('id', `${formId}-totalWithdrawals`);
    expect(withdrawalsInput).toHaveAttribute('name', `${formId}-totalWithdrawals`);
    expect(withdrawalsInput).toHaveAttribute('type', 'text');
    expect(withdrawalsInput).toHaveAttribute('placeholder', '0.00');
    expect(withdrawalsInput).toHaveClass('input', 'w-full');
  });

  it('renders hidden end snapshot id input with correct attributes', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const endSnapshotIdInput = screen.getByTestId('field-balance').parentElement?.parentElement?.querySelectorAll('input[hidden]')[1] as HTMLInputElement;
    expect(endSnapshotIdInput).toHaveAttribute('id', `${formId}-endHoldingSnapshotId`);
    expect(endSnapshotIdInput).toHaveAttribute('name', `${formId}-endHoldingSnapshotId`);
    expect(endSnapshotIdInput).toHaveAttribute('type', 'text');
    expect(endSnapshotIdInput).toHaveAttribute('readonly');
    expect(endSnapshotIdInput).toHaveAttribute('hidden');
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

    const idInput = screen.getByTestId('field-start-snapshot-date').parentElement?.querySelector('input[hidden]') as HTMLInputElement;
    expect(idInput).toHaveDisplayValue('123');

    const startSnapshotSelect = screen.getByTestId('field-start-snapshot').querySelector('select') as HTMLSelectElement;
    expect(startSnapshotSelect).toHaveValue('1');

    const holdingSelect = screen.getByTestId('field-holding').querySelector('select') as HTMLSelectElement;
    expect(holdingSelect).toHaveValue('1');

    const balanceInput = screen.getByTestId('field-balance').querySelector('input') as HTMLInputElement;
    expect(balanceInput).toHaveDisplayValue('12000.00');

    const contributionsInput = screen.getByTestId('field-total-contributions').querySelector('input') as HTMLInputElement;
    expect(contributionsInput).toHaveDisplayValue('2000.00');

    const withdrawalsInput = screen.getByTestId('field-total-withdrawals').querySelector('input') as HTMLInputElement;
    expect(withdrawalsInput).toHaveDisplayValue('500.00');

    const endSnapshotIdInput = screen.getByTestId('field-balance').parentElement?.parentElement?.querySelectorAll('input[hidden]')[1] as HTMLInputElement;
    expect(endSnapshotIdInput).toHaveDisplayValue('456');
  });

  it('displays edit holdings link with correct attributes', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const editLink = screen.getByTestId(editHoldingsLinkTestId);
    expect(editLink).toHaveAttribute('href', `/${NET_WORTH_ITEM_NAME_LINK}/${HOLDING_ITEM_NAME_LOWERCASE_PLURAL}`);
    expect(editLink).toHaveAttribute('title', 'Edit Holdings');
    expect(editLink).toHaveClass('btn', 'btn-ghost', 'btn-sm', 'btn-circle');
  });

  it('displays edit icon', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
  });

  it('calls onChange when form fields are modified', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const balanceInput = screen.getByTestId('field-balance').querySelector('input') as HTMLInputElement;
    fireEvent.change(balanceInput, { target: { value: '15000.00' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        name: `${formId}-endHoldingSnapshotBalance`
      })
    }));
  });

  it('calls onChange when start snapshot is selected', () => {
    render(<HoldingInvestmentReturnInputs {...defaultProps} />);

    const startSnapshotSelect = screen.getByTestId('field-start-snapshot').querySelector('select') as HTMLSelectElement;
    fireEvent.change(startSnapshotSelect, { target: { value: '1' } });

    expect(mockOnChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        name: `${formId}-startHoldingSnapshotId`
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

    const balanceInput = screen.getByTestId('field-balance').querySelector('input') as HTMLInputElement;
    expect(balanceInput).toHaveDisplayValue('');

    const contributionsInput = screen.getByTestId('field-total-contributions').querySelector('input') as HTMLInputElement;
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

  it('handles start snapshot selection with no matching holding', () => {
    const snapshotsWithoutHolding = [
      {
        id: 3,
        date: '2024-01-03',
        balance: 20000,
        holdingId: 'holding-unknown',
        holding: { 
          id: 3,
          name: 'Unknown Holding', 
          institution: 'Unknown',
          type: 'Asset' as const,
          holdingCategoryId: '3',
          date: '2024-01-03'
        }
      }
    ];

    render(<HoldingInvestmentReturnInputs {...defaultProps} startSnapshots={snapshotsWithoutHolding} />);

    const startSnapshotSelect = screen.getByTestId('field-start-snapshot').querySelector('select') as HTMLSelectElement;
    fireEvent.change(startSnapshotSelect, { target: { value: '3' } });

    // Should still call onChange twice - once for the start snapshot selection and once for the auto-set end holding
    expect(mockOnChange).toHaveBeenCalledTimes(2);
    
    // Check that the first call is for the start snapshot
    expect(mockOnChange).toHaveBeenNthCalledWith(1, expect.objectContaining({
      target: expect.objectContaining({
        name: `${formId}-startHoldingSnapshotId`
      })
    }));
    
    // Check that the second call is for the end holding (even if it doesn't match, it should still call)
    expect(mockOnChange).toHaveBeenNthCalledWith(2, expect.objectContaining({
      target: expect.objectContaining({
        name: `${formId}-endHoldingSnapshotHoldingId`,
        value: 'holding-unknown'
      })
    }));
  });
});
