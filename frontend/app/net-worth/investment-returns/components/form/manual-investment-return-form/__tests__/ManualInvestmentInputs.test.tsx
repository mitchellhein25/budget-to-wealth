import { render, screen, fireEvent } from '@testing-library/react';
import { ManualInvestmentInputs } from '../ManualInvestmentInputs';
import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from '../../constants';
import { RecurrenceFrequency } from '@/app/cashflow/components/RecurrenceFrequency';

const mockOnChange = jest.fn();
const formId = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;

jest.mock('@/app/components/form/InputFieldSetTemplate', () => ({
  InputFieldSetTemplate: ({ label, isRequired, inputChild }: { label: string, isRequired: boolean, inputChild: React.ReactNode }) => (
    <div data-testid={`field-${label.toLowerCase().replace(/\s+/g, '-').replace(/[()%]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}>
      <label>{label}</label>
      <div data-testid={`required-${label.toLowerCase().replace(/\s+/g, '-').replace(/[()%]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '')}`}>{isRequired.toString()}</div>
      {inputChild}
    </div>
  ),
}));

describe('ManualInvestmentInputs', () => {
  const mockManualCategories = [
    { id: 1, name: 'Stocks', date: '2024-01-01' },
    { id: 2, name: 'Bonds', date: '2024-01-01' },
    { id: 3, name: 'Real Estate', date: '2024-01-01' }
  ];

  const defaultProps = {
    editingFormData: {
      manualInvestmentCategoryId: '',
      manualInvestmentReturnDate: new Date('2024-01-01'),
      manualInvestmentPercentageReturn: '',
    },
    onChange: mockOnChange,
    manualCategories: mockManualCategories,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form fields with correct labels and requirements', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    expect(screen.getByTestId('field-manual-investment-category')).toBeInTheDocument();
    expect(screen.getByTestId('field-return-date')).toBeInTheDocument();
    expect(screen.getByTestId('field-percentage-return')).toBeInTheDocument();
    expect(screen.getByTestId('field-recurrence')).toBeInTheDocument();

    expect(screen.getByTestId('required-manual-investment-category')).toHaveTextContent('true');
    expect(screen.getByTestId('required-return-date')).toHaveTextContent('true');
    expect(screen.getByTestId('required-percentage-return')).toHaveTextContent('true');
    expect(screen.getByTestId('required-recurrence')).toHaveTextContent('false');
  });

  it('renders hidden id input with correct attributes', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    const idInput = screen.getByTestId('field-manual-investment-category').parentElement?.querySelector('input[hidden]') as HTMLInputElement;
    expect(idInput).toHaveAttribute('id', `${formId}-id`);
    expect(idInput).toHaveAttribute('name', `${formId}-id`);
    expect(idInput).toHaveAttribute('readonly');
    expect(idInput).toHaveAttribute('hidden');
    expect(idInput).toHaveAttribute('type', 'text');
  });

  it('renders manual investment category select with correct options', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    const categorySelect = screen.getByTestId('field-manual-investment-category').querySelector('select') as HTMLSelectElement;
    expect(categorySelect).toHaveAttribute('id', `${formId}-manualInvestmentCategoryId`);
    expect(categorySelect).toHaveAttribute('name', `${formId}-manualInvestmentCategoryId`);
    expect(categorySelect).toHaveClass('select', 'w-full');

    const options = categorySelect.querySelectorAll('option');
    expect(options).toHaveLength(4); // Including the disabled "Pick a category" option
    expect(options[0]).toHaveTextContent('Pick a category');
    expect(options[1]).toHaveTextContent('Stocks');
    expect(options[2]).toHaveTextContent('Bonds');
    expect(options[3]).toHaveTextContent('Real Estate');
  });

  it('renders return date input with correct attributes', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    const dateInput = screen.getByTestId('field-return-date').querySelector('input') as HTMLInputElement;
    expect(dateInput).toHaveAttribute('id', `${formId}-manualInvestmentReturnDate`);
    expect(dateInput).toHaveAttribute('name', `${formId}-manualInvestmentReturnDate`);
    expect(dateInput).toHaveAttribute('type', 'date');
    expect(dateInput).toHaveClass('input', 'w-full');
  });

  it('renders percentage return input with correct attributes', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    const percentageInput = screen.getByTestId('field-percentage-return').querySelector('input') as HTMLInputElement;
    expect(percentageInput).toHaveAttribute('id', `${formId}-manualInvestmentPercentageReturn`);
    expect(percentageInput).toHaveAttribute('name', `${formId}-manualInvestmentPercentageReturn`);
    expect(percentageInput).toHaveAttribute('type', 'number');
    expect(percentageInput).toHaveAttribute('step', '0.01');
    expect(percentageInput).toHaveAttribute('placeholder', '00.00%');
    expect(percentageInput).toHaveClass('input', 'w-full');
  });

  it('renders recurrence select with correct options', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    const recurrenceSelect = screen.getByTestId('field-recurrence').querySelector('select') as HTMLSelectElement;
    expect(recurrenceSelect).toHaveAttribute('id', `${formId}-manualInvestmentRecurrenceFrequency`);
    expect(recurrenceSelect).toHaveAttribute('name', `${formId}-manualInvestmentRecurrenceFrequency`);
    expect(recurrenceSelect).toHaveClass('select', 'w-full');

    const options = recurrenceSelect.querySelectorAll('option');
    expect(options).toHaveLength(4); // Including "No recurrence" option
    expect(options[0]).toHaveTextContent('No recurrence');
    expect(options[1]).toHaveTextContent(RecurrenceFrequency.WEEKLY);
    expect(options[2]).toHaveTextContent('Every 2 Weeks');
    expect(options[3]).toHaveTextContent(RecurrenceFrequency.MONTHLY);
  });

  it('displays provided values in form fields', () => {
    const editingFormData = {
      ...defaultProps.editingFormData,
      manualInvestmentCategoryId: '1',
      manualInvestmentPercentageReturn: '5.75',
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.MONTHLY,
      manualInvestmentRecurrenceEndDate: '2024-12-31'
    };

    render(<ManualInvestmentInputs {...defaultProps} editingFormData={editingFormData} />);

    const categorySelect = screen.getByTestId('field-manual-investment-category').querySelector('select') as HTMLSelectElement;
    expect(categorySelect).toHaveValue('1');

    const dateInput = screen.getByTestId('field-return-date').querySelector('input') as HTMLInputElement;
    expect(dateInput).toHaveValue('2024-01-01');

    const percentageInput = screen.getByTestId('field-percentage-return').querySelector('input') as HTMLInputElement;
    expect(percentageInput).toHaveValue(5.75);

    const recurrenceSelect = screen.getByTestId('field-recurrence').querySelector('select') as HTMLSelectElement;
    expect(recurrenceSelect).toHaveValue(RecurrenceFrequency.MONTHLY);
  });

  it('shows recurrence end date field when recurrence frequency is selected', () => {
    const editingFormDataWithRecurrence = {
      ...defaultProps.editingFormData,
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.WEEKLY
    };

    render(<ManualInvestmentInputs {...defaultProps} editingFormData={editingFormDataWithRecurrence} />);

    expect(screen.getByTestId('field-recurrence-end-date')).toBeInTheDocument();
    expect(screen.getByTestId('required-recurrence-end-date')).toHaveTextContent('false');
  });

  it('hides recurrence end date field when no recurrence frequency is selected', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    expect(screen.queryByTestId('field-recurrence-end-date')).not.toBeInTheDocument();
  });

  it('renders recurrence end date input with correct attributes when visible', () => {
    const editingFormDataWithRecurrence = {
      ...defaultProps.editingFormData,
      manualInvestmentRecurrenceFrequency: RecurrenceFrequency.WEEKLY
    };

    render(<ManualInvestmentInputs {...defaultProps} editingFormData={editingFormDataWithRecurrence} />);

    const endDateInput = screen.getByTestId('field-recurrence-end-date').querySelector('input') as HTMLInputElement;
    expect(endDateInput).toHaveAttribute('id', `${formId}-manualInvestmentRecurrenceEndDate`);
    expect(endDateInput).toHaveAttribute('name', `${formId}-manualInvestmentRecurrenceEndDate`);
    expect(endDateInput).toHaveAttribute('type', 'date');
    expect(endDateInput).toHaveClass('input', 'w-full');
  });

  it('calls onChange when form fields are modified', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    const categorySelect = screen.getByTestId('field-manual-investment-category').querySelector('select') as HTMLSelectElement;
    fireEvent.change(categorySelect, { target: { value: '1' } });

    expect(mockOnChange).toHaveBeenCalled();
    const call = mockOnChange.mock.calls[0][0];
    expect(call.target.name).toBe(`${formId}-manualInvestmentCategoryId`);
    // The fireEvent may not set the actual value on the target, just verify the event was triggered
    expect(call.target).toBe(categorySelect);
  });

  it('calls onChange when percentage return is modified', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    const percentageInput = screen.getByTestId('field-percentage-return').querySelector('input') as HTMLInputElement;
    fireEvent.change(percentageInput, { target: { value: '7.50' } });

    expect(mockOnChange).toHaveBeenCalled();
    const call = mockOnChange.mock.calls[0][0];
    expect(call.target.name).toBe(`${formId}-manualInvestmentPercentageReturn`);
    expect(call.target).toBe(percentageInput);
  });

  it('calls onChange when recurrence frequency is modified', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    const recurrenceSelect = screen.getByTestId('field-recurrence').querySelector('select') as HTMLSelectElement;
    fireEvent.change(recurrenceSelect, { target: { value: RecurrenceFrequency.MONTHLY } });

    expect(mockOnChange).toHaveBeenCalled();
    const call = mockOnChange.mock.calls[0][0];
    expect(call.target.name).toBe(`${formId}-manualInvestmentRecurrenceFrequency`);
    expect(call.target).toBe(recurrenceSelect);
  });

  it('uses current date as default when manualInvestmentReturnDate is not provided', () => {
    const propsWithoutDate = {
      ...defaultProps,
      editingFormData: {
        manualInvestmentCategoryId: '',
        manualInvestmentPercentageReturn: '',
      }
    };

    render(<ManualInvestmentInputs {...propsWithoutDate} />);

    const dateInput = screen.getByTestId('field-return-date').querySelector('input') as HTMLInputElement;
    // Should have some date value (current date)
    expect(dateInput.value).toBeTruthy();
  });

  it('handles empty manualCategories array gracefully', () => {
    const propsWithEmptyCategories = {
      ...defaultProps,
      manualCategories: []
    };

    render(<ManualInvestmentInputs {...propsWithEmptyCategories} />);

    const categorySelect = screen.getByTestId('field-manual-investment-category').querySelector('select') as HTMLSelectElement;
    const options = categorySelect.querySelectorAll('option');
    expect(options).toHaveLength(1); // Only "Pick a category" option
    expect(options[0]).toHaveTextContent('Pick a category');
  });

  it('formats Every2Weeks recurrence frequency option correctly', () => {
    render(<ManualInvestmentInputs {...defaultProps} />);

    const recurrenceSelect = screen.getByTestId('field-recurrence').querySelector('select') as HTMLSelectElement;
    const options = recurrenceSelect.querySelectorAll('option');
    
    const every2WeeksOption = Array.from(options).find(option => 
      option.value === RecurrenceFrequency.EVERY_2_WEEKS
    );
    
    expect(every2WeeksOption?.textContent).toBe('Every 2 Weeks');
  });

  it('handles empty editingFormData gracefully', () => {
    const propsWithEmptyData = {
      ...defaultProps,
      editingFormData: {}
    };

    render(<ManualInvestmentInputs {...propsWithEmptyData} />);

    expect(screen.getByTestId('field-manual-investment-category')).toBeInTheDocument();
    expect(screen.getByTestId('field-return-date')).toBeInTheDocument();
    expect(screen.getByTestId('field-percentage-return')).toBeInTheDocument();
    expect(screen.getByTestId('field-recurrence')).toBeInTheDocument();
  });
});
