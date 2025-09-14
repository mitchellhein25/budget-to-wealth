import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import InvestmentReturnsPage from '@/app/net-worth/investment-returns/page';

const investmentReturnFormTestId = 'investment-return-form';
const investmentReturnListTestId = 'investment-return-list';
const datePickerTestId = 'date-picker';
const netWorthSideBarTestId = 'net-worth-sidebar';

const investmentReturnFormText = 'Investment Return Form';
const investmentReturnListText = 'Investment Return List';
const datePickerText = 'Date Picker';
const netWorthSideBarText = 'Net Worth Sidebar';

jest.mock('@/app/hooks', () => ({
  useForm: () => ({
    formData: {},
    onInputChange: jest.fn(),
    onSubmit: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: { type: 'INFO', text: 'Test message' },
  }),
  useMobileDetection: () => false,
  useFormListItemsFetch: () => ({
    items: [],
    isLoading: false,
    message: { type: 'INFO', text: 'Test message' },
    fetchItems: jest.fn(),
  }),
}));

jest.mock('@/app/components', () => ({
  DatePicker: () => <div data-testid={datePickerTestId}>{datePickerText}</div>,
  ResponsiveFormListPage: ({ sideBar, totalDisplay, datePicker, form, list }: { sideBar: React.ReactNode; totalDisplay: React.ReactNode; datePicker: React.ReactNode; form: React.ReactNode; list: React.ReactNode }) => (
    <div data-testid="responsive-form-list-page">
      {sideBar}
      {totalDisplay}
      {datePicker}
      {form}
      {list}
    </div>
  ),
}));

jest.mock('@/app/net-worth', () => ({
  NetWorthSideBar: () => <div data-testid={netWorthSideBarTestId}>{netWorthSideBarText}</div>,
}));

jest.mock('@/app/net-worth/investment-returns', () => ({
  InvestmentReturnList: () => <div data-testid={investmentReturnListTestId}>{investmentReturnListText}</div>,
  InvestmentReturnForm: () => <div data-testid={investmentReturnFormTestId}>{investmentReturnFormText}</div>,
}));

describe('InvestmentReturnsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all components together', async () => {
    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    // Verify all main components are rendered
    expect(screen.getByTestId(netWorthSideBarTestId)).toBeInTheDocument();
    expect(screen.getByTestId(investmentReturnFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(investmentReturnListTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
  });
});
