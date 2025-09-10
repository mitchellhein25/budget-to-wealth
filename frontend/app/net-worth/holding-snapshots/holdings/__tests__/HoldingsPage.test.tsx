import { render, screen } from '@testing-library/react';
import { HoldingsPage } from '@/app/net-worth/holding-snapshots/holdings/page';

jest.mock('@/app/hooks', () => ({
  useForm: () => ({
    formData: {},
    editingFormData: {},
    onInputChange: jest.fn(),
    onSubmit: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: null,
  }),
  useParentPath: () => '/net-worth',
  useMobileDetection: () => 'large',
  useFormListItemsFetch: () => ({
    items: [],
    isLoading: false,
    message: null,
    fetchItems: jest.fn(),
  }),
  mobileStateIsMediumOrSmaller: jest.fn(() => false),
}));

jest.mock('@/app/lib/api', () => ({
  getAllHoldings: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
}));

jest.mock('@/app/lib/utils', () => ({
  messageTypeIsError: jest.fn(() => false),
  messageTypeIsInfo: jest.fn(() => false),
  replaceSpacesWithDashes: jest.fn(),
}));

jest.mock('@/app/components', () => ({
  BackArrow: ({ link }: { link: string }) => (
    <a href={link} data-testid="back-button">Back</a>
  ),
}));

jest.mock('@/app/net-worth/holding-snapshots/holdings', () => ({
  HoldingForm: () => <div data-testid="holding-form">Holding Form</div>,
  HoldingsList: () => <div data-testid="holdings-list">Holdings List</div>,
  transformFormDataToHolding: jest.fn(),
  convertHoldingToFormData: jest.fn(),
}));

describe('HoldingsPage', () => {
  it('renders all main components', () => {
    render(<HoldingsPage />);
    
    expect(screen.getByTestId('back-button')).toBeInTheDocument();
    expect(screen.getByTestId('holding-form')).toBeInTheDocument();
    expect(screen.getByTestId('holdings-list')).toBeInTheDocument();
  });

  it('renders back button with correct link', () => {
    render(<HoldingsPage />);
    
    const backButton = screen.getByTestId('back-button');
    expect(backButton).toHaveAttribute('href', '/net-worth');
  });
}); 