import { render, screen } from '@testing-library/react';
import { CashFlowPage } from './CashFlowPage';
import { INCOME_ITEM_NAME } from './constants';

const cashFlowSideBarTestId = 'cash-flow-side-bar';
const cashFlowEntriesFormTestId = 'cash-flow-entries-form';
const datePickerTestId = 'date-picker';
const totalDisplayTestId = 'total-display';
const cashFlowEntriesListTestId = 'cash-flow-entries-list';
const cashFlowSideBarText = 'Cash Flow Side Bar';
const cashFlowEntriesFormText = 'Cash Flow Entries Form';
const datePickerText = 'Date Picker';
const totalDisplayText = 'Total Display';
const cashFlowEntriesListText = 'Cash Flow Entries List';

jest.mock('@/app/hooks', () => ({
  useForm: () => ({
    formData: {},
    onInputChange: jest.fn(),
    onSubmit: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: null,
  }),
  useDataListFetcher: () => ({
    items: [],
    isLoading: false,
    message: null,
    fetchItems: jest.fn(),
  }),
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  getCashFlowEntriesByDateRangeAndType: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  DatePicker: () => <div data-testid={datePickerTestId}>{datePickerText}</div>,
  TotalDisplay: () => <div data-testid={totalDisplayTestId}>{totalDisplayText}</div>,
  getCurrentMonthRange: jest.fn(() => ({ start: new Date(), end: new Date() })),
  messageTypeIsError: jest.fn(() => false),
}));

jest.mock('./CashFlowSideBar', () => ({
  CashFlowSideBar: () => <div data-testid={cashFlowSideBarTestId}>{cashFlowSideBarText}</div>,
}));

jest.mock('./form', () => ({
  CashFlowEntriesForm: () => <div data-testid={cashFlowEntriesFormTestId}>{cashFlowEntriesFormText}</div>,
  CashFlowEntryFormData: {},
  transformCashFlowFormDataToEntry: jest.fn(),
}));

jest.mock('./list/CashFlowEntriesList', () => ({
  __esModule: true,
  default: () => <div data-testid={cashFlowEntriesListTestId}>{cashFlowEntriesListText}</div>,
}));

describe('CashFlowPage', () => {
  it('renders the page correctly', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByTestId(cashFlowSideBarTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(totalDisplayTestId)).toBeInTheDocument();
    expect(screen.getByTestId(cashFlowEntriesListTestId)).toBeInTheDocument();
  });

  it('renders all main components with correct content', () => {
    render(<CashFlowPage cashFlowType={INCOME_ITEM_NAME} />);
    
    expect(screen.getByText(cashFlowSideBarText)).toBeInTheDocument();
    expect(screen.getByText(cashFlowEntriesFormText)).toBeInTheDocument();
    expect(screen.getByText(datePickerText)).toBeInTheDocument();
    expect(screen.getByText(totalDisplayText)).toBeInTheDocument();
    expect(screen.getByText(cashFlowEntriesListText)).toBeInTheDocument();
  });
}); 