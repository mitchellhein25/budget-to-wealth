import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import InvestmentReturnsPage from './page';

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
    message: null,
  }),
  useMobileDetection: () => false,
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  getHoldingInvestmentReturnsByDateRange: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
  getManualInvestmentReturnsByDateRange: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
}));

jest.mock('@/app/components', () => ({
  DatePicker: () => <div data-testid={datePickerTestId}>{datePickerText}</div>,
  messageTypeIsError: jest.fn(() => false),
  getCurrentMonthRange: jest.fn(() => ({ start: new Date(), end: new Date() })),
}));

jest.mock('@/app/net-worth/holding-snapshots/components/NetWorthSideBar', () => ({
  NetWorthSideBar: () => <div data-testid={netWorthSideBarTestId}>{netWorthSideBarText}</div>,
}));

jest.mock('./components/form/InvestmentReturnForm', () => ({
  InvestmentReturnForm: () => <div data-testid={investmentReturnFormTestId}>{investmentReturnFormText}</div>,
}));

jest.mock('./components/list/InvestmentReturnList', () => ({
  InvestmentReturnList: () => <div data-testid={investmentReturnListTestId}>{investmentReturnListText}</div>,
}));

jest.mock('./components/form/manual-investment-return-form', () => ({
  transformFormDataToManualInvestmentReturn: jest.fn(),
}));

jest.mock('./components/form/holding-investment-return-form', () => ({
  transformFormDataToHoldingInvestmentReturn: jest.fn(),
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
    const getHoldingInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api/data-methods').getHoldingInvestmentReturnsByDateRange as jest.Mock;
    const getManualInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api/data-methods').getManualInvestmentReturnsByDateRange as jest.Mock;

    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    await waitFor(() => {
      expect(getHoldingInvestmentReturnsByDateRange).toHaveBeenCalled();
      expect(getManualInvestmentReturnsByDateRange).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    const getHoldingInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api/data-methods').getHoldingInvestmentReturnsByDateRange as jest.Mock;
    getHoldingInvestmentReturnsByDateRange.mockRejectedValueOnce(new Error('API Error'));

    await act(async () => {
      render(<InvestmentReturnsPage />);
    });

    await waitFor(() => {
      expect(getHoldingInvestmentReturnsByDateRange).toHaveBeenCalled();
    });
  });

  it('handles unsuccessful API responses', async () => {
    const getHoldingInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api/data-methods').getHoldingInvestmentReturnsByDateRange as jest.Mock;
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

    const mainContainer = screen.getByTestId(investmentReturnFormTestId).closest('.flex.gap-6.pt-6.px-6.pb-0.h-full.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
  });

  it('calls fetch functions with correct date range', async () => {
    const getHoldingInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api/data-methods').getHoldingInvestmentReturnsByDateRange as jest.Mock;
    const getManualInvestmentReturnsByDateRange = jest.requireMock('@/app/lib/api/data-methods').getManualInvestmentReturnsByDateRange as jest.Mock;

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
