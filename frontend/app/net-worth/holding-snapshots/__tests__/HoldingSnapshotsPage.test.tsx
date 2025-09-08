import { render, screen, act, fireEvent } from '@testing-library/react';
import { HoldingSnapshotsPage } from '@/app/net-worth/holding-snapshots/page';

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
    message: { type: 'INFO', text: 'Test message' },
  }),
  useDataListFetcher: () => ({
    items: [],
    isLoading: false,
    message: { type: 'INFO', text: 'Test message' },
    fetchItems: jest.fn(),
  }),
  useMobileDetection: () => false,
  useFormListItemsFetch: jest.fn(() => ({
    items: [],
    isLoading: false,
    message: { type: 'INFO', text: 'Test message' },
    fetchItems: jest.fn(),
  })),
}));

jest.mock('@/app/lib/api', () => ({
  getHoldingSnapshotsByDateRange: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
  getLatestHoldingSnapshots: jest.fn(() => Promise.resolve({ successful: true, data: [] })),
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
  formHasAnyValue: jest.fn(() => false),
  messageTypeIsError: jest.fn(() => false),
  getCurrentMonthRange: jest.fn(() => ({ start: new Date(), end: new Date() })),
  SideBar: (props: { children: React.ReactNode }) => <div data-testid="sidebar">{props.children}</div>,
}));

jest.mock('@/app/net-worth', () => ({
  NetWorthSideBar: () => <div data-testid="net-worth-sidebar">Net Worth Sidebar</div>,
}));

jest.mock('@/app/net-worth/holding-snapshots', () => ({
  HoldingSnapshotsList: () => <div data-testid={holdingSnapshotsListTestId}>{holdingSnapshotsListText}</div>,
  HoldingSnapshotForm: () => <div data-testid={holdingSnapshotFormTestId}>{holdingSnapshotFormText}</div>,
  HoldingSnapshotFormData: {},
  transformFormDataToHoldingSnapshot: jest.fn(),
  convertHoldingSnapshotToFormData: jest.fn(),
  HOLDING_SNAPSHOT_ITEM_NAME: 'Holding Snapshot',
  HOLDING_SNAPSHOT_ITEM_NAME_LOWERCASE: 'holding snapshot',
}));

describe('HoldingSnapshotsPage', () => {
  it('renders the page correctly', async () => {
    await act(async () => {
      render(<HoldingSnapshotsPage />);
    });
    
    expect(screen.getByTestId(holdingSnapshotFormTestId)).toBeInTheDocument();
    expect(screen.getByTestId(holdingSnapshotsListTestId)).toBeInTheDocument();
    expect(screen.getByLabelText('Show most recent entries')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-form-list-page')).toBeInTheDocument();
  });

  it('renders all main components with correct content', async () => {
    await act(async () => {
      render(<HoldingSnapshotsPage />);
    });
    
    expect(screen.getByText(holdingSnapshotFormText)).toBeInTheDocument();
    expect(screen.getByText(holdingSnapshotsListText)).toBeInTheDocument();
    expect(screen.getByLabelText('Show most recent entries')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-form-list-page')).toBeInTheDocument();
  });

  it('toggles DatePicker visibility when checkbox is clicked', async () => {
    await act(async () => {
      render(<HoldingSnapshotsPage />);
    });
    
    const checkbox = screen.getByLabelText('Show most recent entries');
    expect(checkbox).toBeInTheDocument();

    // Initially checked -> DatePicker hidden
    expect(screen.queryByTestId(datePickerTestId)).not.toBeInTheDocument();

    // Uncheck -> DatePicker visible
    await act(async () => {
      fireEvent.click(checkbox);
    });
    expect(screen.getByTestId(datePickerTestId)).toBeInTheDocument();

    // Check again -> DatePicker hidden
    await act(async () => {
      fireEvent.click(checkbox);
    });
    expect(screen.queryByTestId(datePickerTestId)).not.toBeInTheDocument();
  });
}); 