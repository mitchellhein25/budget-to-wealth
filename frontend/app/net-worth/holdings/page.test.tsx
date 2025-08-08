import { render, screen, act } from '@testing-library/react';
import HoldingsPage from './page';

const backButtonTestId = 'back-button';
const holdingFormTestId = 'holding-form';
const holdingsListTestId = 'holdings-list';
const backButtonText = 'Back';
const holdingFormText = 'Holding Form';
const holdingsListText = 'Holdings List';

jest.mock('@/app/hooks', () => ({
  useForm: () => ({
    formData: {},
    onInputChange: jest.fn(),
    onSubmit: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: null,
  }),
  useParentPath: () => '/net-worth',
  useMobileDetection: () => ({ isMobile: false }),
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  getAllHoldings: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
  HOLDINGS_ENDPOINT: '/api/holdings',
}));

jest.mock('@/app/components/Utils', () => ({
  messageTypeIsError: jest.fn(() => false),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, className, children }: { href: string; className?: string; children: React.ReactNode }) => (
    <a href={href} className={className} data-testid={backButtonTestId}>
      {children}
    </a>
  ),
}));

jest.mock('./components', () => ({
  HOLDING_ITEM_NAME: 'Holding',
  HoldingForm: () => <div data-testid={holdingFormTestId}>{holdingFormText}</div>,
  HoldingsList: () => <div data-testid={holdingsListTestId}>{holdingsListText}</div>,
  HoldingFormData: {},
  transformFormDataToHolding: jest.fn(),
}));

jest.mock('lucide-react', () => ({
  ArrowLeft: ({ size }: { size: number }) => <svg data-testid="arrow-left" width={size} height={size} />,
}));

describe('HoldingsPage', () => {
  it('renders the page correctly', async () => {
    await act(async () => {
      render(<HoldingsPage />);
    });
    
    expect(screen.getByTestId(backButtonTestId)).toBeInTheDocument();
    expect(screen.getByTestId(holdingFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(holdingsListTestId)).toBeInTheDocument();
  });

  it('renders all main components with correct content', async () => {
    await act(async () => {
      render(<HoldingsPage />);
    });
    
    expect(screen.getByText(backButtonText)).toBeInTheDocument();
    expect(screen.getByText(holdingFormText)).toBeInTheDocument();
    expect(screen.getByText(holdingsListText)).toBeInTheDocument();
  });

  it('renders back button with correct link', async () => {
    await act(async () => {
      render(<HoldingsPage />);
    });
    
    const backButton = screen.getByTestId(backButtonTestId);
    expect(backButton).toHaveAttribute('href', '/net-worth');
  });

  it('renders arrow left icon', async () => {
    await act(async () => {
      render(<HoldingsPage />);
    });
    
    expect(screen.getByTestId('arrow-left')).toBeInTheDocument();
  });

  it('renders back button with correct styling', async () => {
    await act(async () => {
      render(<HoldingsPage />);
    });
    
    const backButton = screen.getByTestId(backButtonTestId);
    expect(backButton).toHaveClass('btn', 'btn-ghost', 'btn-sm', 'gap-2');
  });

  it('renders main container with correct layout', async () => {
    await act(async () => {
      render(<HoldingsPage />);
    });
    
    const mainContainer = screen.getByTestId(holdingsListTestId).closest('.flex.flex-1');
    expect(mainContainer).toHaveClass('flex', 'flex-1', 'flex-col', 'gap-2');
  });

  it('renders form and list in correct layout', async () => {
    await act(async () => {
      render(<HoldingsPage />);
    });
    
    const formContainer = screen.getByTestId(holdingFormTestId).closest('.flex-shrink-0');
    const listContainer = screen.getByTestId(holdingsListTestId).closest('.flex-1');
    
    expect(formContainer).toBeInTheDocument();
    expect(listContainer).toBeInTheDocument();
  });
}); 