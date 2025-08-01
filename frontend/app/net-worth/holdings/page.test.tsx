import { render, screen, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import HoldingsPage from './page';
import { BACK_ARROW_TEXT } from '@/app/components/buttons/BackArrow';
import { NET_WORTH_ITEM_NAME_LINK } from '@/app/net-worth/components';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockParentPath = `/${NET_WORTH_ITEM_NAME_LINK}`;
const holdingsListTestId = 'holdings-list';
const holdingFormTestId = 'holding-form';
const holdingsListText = 'Holdings List';
const holdingFormText = 'Holding Form';

jest.mock('@/app/hooks', () => ({
  useParentPath: () => mockParentPath,
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
  getAllHoldings: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
}));

jest.mock('./components', () => ({
  HoldingsList: () => <div data-testid={holdingsListTestId}>{holdingsListText}</div>,
  HoldingForm: () => <div data-testid={holdingFormTestId}>{holdingFormText}</div>,
  HoldingFormData: {},
  transformFormDataToHolding: jest.fn(),
}));

jest.mock('@/app/components/Utils', () => ({
  messageTypeIsError: jest.fn(() => false),
}));

describe('HoldingsPage', () => {
  const mockRouter = {
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('renders the page correctly', async () => {
    await act(async () => {
      render(<HoldingsPage />);
    });
    
    expect(screen.getByText(BACK_ARROW_TEXT)).toBeInTheDocument();
    expect(screen.getByTestId(holdingsListTestId)).toBeInTheDocument();
    expect(screen.getByTestId(holdingFormTestId)).toBeInTheDocument();
  });

  it('renders back arrow with correct link', async () => {
    await act(async () => {
      render(<HoldingsPage />);
    });
    
    const backButton = screen.getByText(BACK_ARROW_TEXT);
    expect(backButton).toBeInTheDocument();
    
    const backLink = backButton.closest('[href]');
    expect(backLink).toHaveAttribute('href', mockParentPath);
  });
}); 