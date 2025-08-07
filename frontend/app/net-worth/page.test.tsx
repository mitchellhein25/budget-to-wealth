import { render, screen, act } from '@testing-library/react';
import HoldingSnapshotsPage from './page';

const holdingSnapshotFormTestId = 'holding-snapshot-form';
const holdingSnapshotsListTestId = 'holding-snapshots-list';
const datePickerTestId = 'date-picker';
const holdingSnapshotFormText = 'Holding Snapshot Form';
const holdingSnapshotsListText = 'Holding Snapshots List';
const datePickerText = 'Date Picker';

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
  useMobileDetection: () => false,
}));

jest.mock('@/app/lib/api/data-methods', () => ({
  getHoldingSnapshotsByDateRange: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
}));

jest.mock('@/app/components', () => ({
  DatePicker: () => <div data-testid={datePickerTestId}>{datePickerText}</div>,
  messageTypeIsError: jest.fn(() => false),
  getCurrentMonthRange: jest.fn(() => ({ start: new Date(), end: new Date() })),
}));

jest.mock('@/app/net-worth/components', () => ({
  HoldingSnapshotsList: () => <div data-testid={holdingSnapshotsListTestId}>{holdingSnapshotsListText}</div>,
  HoldingSnapshotForm: () => <div data-testid={holdingSnapshotFormTestId}>{holdingSnapshotFormText}</div>,
  HoldingSnapshotFormData: {},
  transformFormDataToHoldingSnapshot: jest.fn(),
}));

describe('HoldingSnapshotsPage', () => {
  it('renders the page correctly', async () => {
    await act(async () => {
      render(<HoldingSnapshotsPage />);
    });
    
    expect(screen.getByTestId(holdingSnapshotFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(holdingSnapshotsListTestId)).toBeInTheDocument();
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
  });

  it('renders all main components with correct content', async () => {
    await act(async () => {
      render(<HoldingSnapshotsPage />);
    });
    
    expect(screen.getByText(holdingSnapshotFormText)).toBeInTheDocument();
    expect(screen.getByText(holdingSnapshotsListText)).toBeInTheDocument();
    expect(screen.getByText(datePickerText)).toBeInTheDocument();
  });
}); 