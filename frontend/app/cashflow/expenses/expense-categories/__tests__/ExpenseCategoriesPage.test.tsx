import { render, screen, act } from '@testing-library/react';
import ExpenseCategoriesPage from '@/app/cashflow/expenses/expense-categories/page';

jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: jest.fn(() => null),
  }),
}));

jest.mock('@/app/hooks', () => ({
  useParentPath: () => '/cashflow/expenses',
  useMobileDetection: () => false,
  useForm: () => ({
    formData: {},
    onInputChange: jest.fn(),
    onSubmit: jest.fn(),
    onItemIsEditing: jest.fn(),
    isSubmitting: false,
    message: null,
  }),
}));

jest.mock('@/app/lib/api', () => ({
  getRequestList: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
}));

jest.mock('@/app/lib/utils', () => ({
  messageTypeIsError: jest.fn((message) => message?.type === 'ERROR'),
  messageTypeIsInfo: jest.fn((message) => message?.type === 'INFO'),
  convertDollarsToCents: jest.fn((amount) => Math.round(parseFloat(amount) * 100)),
  convertCentsToDollars: jest.fn((cents) => (cents / 100).toFixed(2)),
  replaceSpacesWithDashes: jest.fn((text) => text.replace(/\s+/g, '-')),
}));

jest.mock('@/app/components', () => ({
  CategoriesPage: ({ categoryTypeName }: { categoryTypeName: string }) => (
    <div data-testid="categories-page">
      <h1>{categoryTypeName}</h1>
    </div>
  ),
  BackArrow: ({ link }: { link: string }) => (
    <div data-testid="back-arrow">
      <a href={link}>Back</a>
    </div>
  ),
}));

describe('ExpenseCategoriesPage', () => {
  it('renders the page', async () => {
    await act(async () => {
      render(<ExpenseCategoriesPage />);
    });
    
    expect(screen.getByTestId('back-arrow')).toBeInTheDocument();
    expect(screen.getByTestId('categories-page')).toBeInTheDocument();
    expect(screen.getByText('Expense')).toBeInTheDocument(); // This comes from the mock CategoriesPage
  });
}); 