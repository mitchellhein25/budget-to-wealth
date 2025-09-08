import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { InvestmentReturnsPage } from '@/app/net-worth/investment-returns/page';


// Mock console.error to prevent it from appearing in tests
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

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

jest.mock('@/app/lib/api', () => ({
  getHoldingInvestmentReturnsByDateRange: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
  getManualInvestmentReturnsByDateRange: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
}));

jest.mock('@/app/components', () => ({
  DatePicker: () => <div data-testid={datePickerTestId}>{datePickerText}</div>,
  ResponsiveFormListPage: ({ sideBar, totalDisplay, datePicker, form, list }: any) => (
    <div data-testid="responsive-form-list-page">
      <div data-testid="sidebar">{sideBar}</div>
      <div data-testid="total-display">{totalDisplay}</div>
      <div data-testid="date-picker-container">{datePicker}</div>
      <div data-testid="form-container">{form}</div>
      <div data-testid="list-container">{list}</div>
    </div>
  ),
  messageTypeIsError: jest.fn(() => false),
  getCurrentMonthRange: jest.fn(() => ({ start: new Date(), end: new Date() })),
}));

jest.mock('@/app/net-worth/holding-snapshots', () => ({
  NetWorthSideBar: () => <div data-testid={netWorthSideBarTestId}>{netWorthSideBarText}</div>,
}));

jest.mock('@/app/net-worth/investment-returns', () => ({
  InvestmentReturnList: () => <div data-testid={investmentReturnListTestId}>{investmentReturnListText}</div>,
  InvestmentReturnForm: () => <div data-testid={investmentReturnFormTestId}>{investmentReturnFormText}</div>,
  transformFormDataToManualInvestmentReturn: jest.fn(),
  transformFormDataToHoldingInvestmentReturn: jest.fn(),
  convertManualInvestmentReturnItemToFormData: jest.fn(),
  convertHoldingInvestmentReturnItemToFormData: jest.fn(),
  HoldingInvestmentReturnFormData: {},
  ManualInvestmentReturnFormData: {},
}));

describe('InvestmentReturnsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the page correctly with all main components', async () => {
    await act(async () => {
      render(<InvestmentReturnsPage />);
    });
    
    expect(screen.getByTestId(investmentReturnFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(investmentReturnListTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    expect(screen.getByTestId(netWorthSideBarTestId)).toBeInTheDocument();
  });

  it('renders all main components with correct content', async () => {
    await act(async () => {
      render(<InvestmentReturnsPage />);
    });
    
    expect(screen.getByText(investmentReturnFormText)).toBeInTheDocument();
    expect(screen.getByText(investmentReturnListText)).toBeInTheDocument();
    expect(screen.getByText(datePickerText)).toBeInTheDocument();
    expect(screen.getByText(netWorthSideBarText)).toBeInTheDocument();
  });

  it('fetches both types of investment returns on mount', async () => {
    const getHoldingInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api').getHoldingInvestmentReturnsByDateRange as jest.Mock;
    const getManualInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api').getManualInvestmentReturnsByDateRange as jest.Mock;

    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    await waitFor(() => {
      expect(getHoldingInvestmentReturnsByDateRange).toHaveBeenCalled();
      expect(getManualInvestmentReturnsByDateRange).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    const getHoldingInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api').getHoldingInvestmentReturnsByDateRange as jest.Mock;
    getHoldingInvestmentReturnsByDateRange.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    await waitFor(() => {
      expect(getHoldingInvestmentReturnsByDateRange).toHaveBeenCalled();
    });
  });

  it('handles unsuccessful API responses', async () => {
    const getHoldingInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api').getHoldingInvestmentReturnsByDateRange as jest.Mock;
    getHoldingInvestmentReturnsByDateRange.mockResolvedValueOnce({ successful: false, data: [] });

    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    await waitFor(() => {
      expect(getHoldingInvestmentReturnsByDateRange).toHaveBeenCalled();
    });
  });

  it('renders desktop layout when not mobile', async () => {
    jest.requireMock('@/app/hooks').useMobileDetection = () => false;

    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    const formContainer = screen.getByTestId(investmentReturnFormTestId).closest('div');
    expect(formContainer?.parentElement).toHaveClass('flex-shrink-0');
  });

  it('renders mobile layout when mobile', async () => {
    jest.requireMock('@/app/hooks').useMobileDetection = () => true;

    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    const formContainer = screen.getByTestId(investmentReturnFormTestId).closest('div');
    expect(formContainer?.parentElement).toHaveClass('w-full');
  });

  it('has correct CSS classes for layout', async () => {
    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    const mainContainer = screen.getByTestId(investmentReturnFormTestId).closest('.page-layout');
    expect(mainContainer).toBeInTheDocument();
  });

  it('calls fetch functions with correct date range', async () => {
    const getHoldingInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api').getHoldingInvestmentReturnsByDateRange as jest.Mock;
    const getManualInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api').getManualInvestmentReturnsByDateRange as jest.Mock;

    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    await waitFor(() => {
      expect(getHoldingInvestmentReturnsByDateRange).toHaveBeenCalledWith(expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date)
      }));
      expect(getManualInvestmentReturnsByDateRange).toHaveBeenCalledWith(expect.objectContaining({
        start: expect.any(Date),
        end: expect.any(Date)
      }));
    });
  });
});
