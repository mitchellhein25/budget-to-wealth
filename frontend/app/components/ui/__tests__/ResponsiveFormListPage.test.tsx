import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ResponsiveFormListPage } from '@/app/components/ui/ResponsiveFormListPage';
import { useMobileDetection, useSidebarDetection } from '@/app/hooks';
import { MobileState } from '@/app/hooks/useMobileDetection';

jest.mock('@/app/hooks', () => ({
  useMobileDetection: jest.fn(),
  useSidebarDetection: jest.fn(),
  mobileStateIsMediumOrLarge: jest.fn(),
  mobileStateIsSmallOrSmaller: jest.fn(),
  MobileState: {
    XSMALL: 'xsmall',
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    XLARGE: 'xlarge',
  },
}));

const mockUseMobileDetection = useMobileDetection as jest.MockedFunction<typeof useMobileDetection>;
const mockUseSidebarDetection = useSidebarDetection as jest.MockedFunction<typeof useSidebarDetection>;

// Import the mocked functions
import { mobileStateIsMediumOrLarge, mobileStateIsSmallOrSmaller } from '@/app/hooks';
const mockMobileStateIsMediumOrLarge = mobileStateIsMediumOrLarge as jest.MockedFunction<typeof mobileStateIsMediumOrLarge>;
const mockMobileStateIsSmallOrSmaller = mobileStateIsSmallOrSmaller as jest.MockedFunction<typeof mobileStateIsSmallOrSmaller>;

const defaultProps = {
  sideBar: <div data-testid="sidebar">Sidebar</div>,
  totalDisplay: <div data-testid="total-display">Total Display</div>,
  datePicker: <div data-testid="date-picker">Date Picker</div>,
  form: <div data-testid="form">Form</div>,
  list: <div data-testid="list">List</div>,
};

describe('ResponsiveFormListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sidebar when showSidebar is true', () => {
    mockUseSidebarDetection.mockReturnValue(true);
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(false);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('does not render sidebar when showSidebar is false', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(false);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.queryByTestId('sidebar')).not.toBeInTheDocument();
  });

  it('renders small screen layout when mobileStateIsSmallOrSmaller is true', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.SMALL);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(true);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders medium/large screen layout when mobileStateIsMediumOrLarge is true', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.MEDIUM);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(false);
    mockMobileStateIsMediumOrLarge.mockReturnValue(true);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders desktop layout when neither small nor medium/large conditions are met', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(false);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('shows total and date picker when showTotalAndDatePicker is true (default)', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.SMALL);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(true);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.getByTestId('total-display')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('shows total and date picker when showTotalAndDatePicker is explicitly true', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.SMALL);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(true);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} showTotalAndDatePicker={true} />);

    expect(screen.getByTestId('total-display')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('hides total and date picker when showTotalAndDatePicker is false', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.SMALL);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(true);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} showTotalAndDatePicker={false} />);

    expect(screen.queryByTestId('total-display')).not.toBeInTheDocument();
    expect(screen.queryByTestId('date-picker')).not.toBeInTheDocument();
  });

  it('renders xsmall mobile layout with vertical arrangement', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.XSMALL);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(true);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('total-display')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders small mobile layout with horizontal arrangement', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.SMALL);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(true);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('total-display')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders medium/large layout with form and controls side by side', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.MEDIUM);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(false);
    mockMobileStateIsMediumOrLarge.mockReturnValue(true);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('total-display')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });

  it('renders desktop layout with form on left and list on right', () => {
    mockUseSidebarDetection.mockReturnValue(false);
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    mockMobileStateIsSmallOrSmaller.mockReturnValue(false);
    mockMobileStateIsMediumOrLarge.mockReturnValue(false);

    render(<ResponsiveFormListPage {...defaultProps} />);

    expect(screen.getByTestId('form')).toBeInTheDocument();
    expect(screen.getByTestId('total-display')).toBeInTheDocument();
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('list')).toBeInTheDocument();
  });
});
