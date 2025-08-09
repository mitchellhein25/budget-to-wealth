import { render, screen, act, fireEvent } from '@testing-library/react';
import HoldingSnapshotsPage from './page';

const holdingSnapshotFormTestId = 'holding-snapshot-form';
const holdingSnapshotsListTestId = 'holding-snapshots-list';
const datePickerTestId = 'date-picker';
const latestOnlyCheckboxId = 'show-latest-only';
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
  getLatestHoldingSnapshots: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
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
    expect(screen.getByLabelText('Show most recent entries')).toBeInTheDocument();
  });

  it('renders all main components with correct content', async () => {
    await act(async () => {
      render(<HoldingSnapshotsPage />);
    });
    
    expect(screen.getByText(holdingSnapshotFormText)).toBeInTheDocument();
    expect(screen.getByText(holdingSnapshotsListText)).toBeInTheDocument();
    expect(screen.getByLabelText('Show most recent entries')).toBeInTheDocument();
  });

  it('toggles DatePicker visibility and calls appropriate APIs', async () => {
    const { getLatestHoldingSnapshots, getHoldingSnapshotsByDateRange } = require('@/app/lib/api/data-methods');
    await act(async () => {
      render(<HoldingSnapshotsPage />);
    });
    const checkbox = screen.getByLabelText('Show most recent entries');
    expect(checkbox).toBeInTheDocument();

    // When checked, DatePicker hidden and latest API should be used
    expect(screen.queryByTestId(datePickerTestId)).not.toBeInTheDocument();
    expect(getLatestHoldingSnapshots).toHaveBeenCalled();

    // Uncheck -> DatePicker visible and date-range API should be used on next fetch
    await act(async () => {
      fireEvent.click(checkbox);
    });
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();
    // Trigger a refetch by toggling back
    await act(async () => {
      fireEvent.click(checkbox);
    });
    expect(getLatestHoldingSnapshots).toHaveBeenCalled();
    expect(getHoldingSnapshotsByDateRange).toHaveBeenCalled();
  });
}); 