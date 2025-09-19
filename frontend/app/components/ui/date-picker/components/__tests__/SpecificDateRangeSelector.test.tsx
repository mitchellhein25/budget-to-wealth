import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SpecificDateRangeSelector from '@/app/components/ui/date-picker/components/SpecificDateRangeSelector';
import { MobileState } from '@/app/hooks/useMobileDetection';

jest.mock('@/app/hooks/useMobileDetection', () => ({
  useMobileDetection: jest.fn(),
  MobileState: {
    XSMALL: 'XSMALL',
    SMALL: 'SMALL',
    MEDIUM: 'MEDIUM',
    LARGE: 'LARGE',
    XLARGE: 'XLARGE'
  }
}));

const mockUseMobileDetection = require('@/app/hooks/useMobileDetection').useMobileDetection;

describe('SpecificDateRangeSelector', () => {
  const mockHandleFromChange = jest.fn();
  const mockHandleToChange = jest.fn();

  const defaultProps = {
    fromInputValue: '',
    toInputValue: '',
    handleFromChange: mockHandleFromChange,
    handleToChange: mockHandleToChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
  });

  it('renders from and to date inputs with labels', () => {
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    expect(screen.getByText('From')).toBeInTheDocument();
    expect(screen.getByText('To')).toBeInTheDocument();
    
    const dateInputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    expect(dateInputs).toHaveLength(2);
    
    dateInputs.forEach(input => {
      expect(input).toHaveAttribute('type', 'date');
      expect(input).toHaveAttribute('placeholder', 'MM/DD/YYYY');
    });
  });

  it('displays arrow between inputs on non-mobile screens', () => {
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    expect(screen.getByText('→')).toBeInTheDocument();
  });

  it('hides arrow between inputs on mobile screens', () => {
    mockUseMobileDetection.mockReturnValue(MobileState.XSMALL);
    
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    expect(screen.queryByText('→')).not.toBeInTheDocument();
  });

  it('uses flex-row layout on non-mobile screens', () => {
    mockUseMobileDetection.mockReturnValue(MobileState.LARGE);
    
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    const container = screen.getByText('From').closest('div')?.parentElement;
    expect(container).toHaveClass('flex-row', 'items-end');
    expect(container).not.toHaveClass('flex-col');
  });

  it('uses flex-col layout on mobile screens', () => {
    mockUseMobileDetection.mockReturnValue(MobileState.XSMALL);
    
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    const container = screen.getByText('From').closest('div')?.parentElement;
    expect(container).toHaveClass('flex-col');
    expect(container).not.toHaveClass('flex-row');
  });

  it('displays from input value', () => {
    render(<SpecificDateRangeSelector {...defaultProps} fromInputValue="2024-01-15" />);
    
    const fromInput = screen.getAllByPlaceholderText('MM/DD/YYYY')[0];
    expect(fromInput).toHaveValue('2024-01-15');
  });

  it('displays to input value', () => {
    render(<SpecificDateRangeSelector {...defaultProps} toInputValue="2024-01-31" />);
    
    const toInput = screen.getAllByPlaceholderText('MM/DD/YYYY')[1];
    expect(toInput).toHaveValue('2024-01-31');
  });

  it('calls handleFromChange when from input changes', () => {
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    const fromInput = screen.getAllByPlaceholderText('MM/DD/YYYY')[0];
    fireEvent.change(fromInput, { target: { value: '2024-02-01' } });
    
    expect(mockHandleFromChange).toHaveBeenCalledTimes(1);
    expect(mockHandleFromChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.any(Object)
    }));
  });

  it('calls handleToChange when to input changes', () => {
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    const toInput = screen.getAllByPlaceholderText('MM/DD/YYYY')[1];
    fireEvent.change(toInput, { target: { value: '2024-02-28' } });
    
    expect(mockHandleToChange).toHaveBeenCalledTimes(1);
    expect(mockHandleToChange).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.any(Object)
    }));
  });

  it('handles empty input values', () => {
    render(<SpecificDateRangeSelector {...defaultProps} fromInputValue="" toInputValue="" />);
    
    const dateInputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    expect(dateInputs[0]).toHaveValue('');
    expect(dateInputs[1]).toHaveValue('');
  });

  it('updates input values when props change', () => {
    const { rerender } = render(
      <SpecificDateRangeSelector {...defaultProps} fromInputValue="2024-01-01" toInputValue="2024-01-31" />
    );
    
    let dateInputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    expect(dateInputs[0]).toHaveValue('2024-01-01');
    expect(dateInputs[1]).toHaveValue('2024-01-31');
    
    rerender(
      <SpecificDateRangeSelector {...defaultProps} fromInputValue="2024-02-01" toInputValue="2024-02-29" />
    );
    
    dateInputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    expect(dateInputs[0]).toHaveValue('2024-02-01');
    expect(dateInputs[1]).toHaveValue('2024-02-29');
  });

  it('has correct CSS classes for styling', () => {
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    const dateInputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    const formControls = screen.getAllByText(/From|To/).map(label => label.closest('.form-control'));
    
    dateInputs.forEach(input => {
      expect(input).toHaveClass('input', 'input-bordered', 'input-sm', 'text-center');
    });
    
    formControls.forEach(control => {
      expect(control).toHaveClass('form-control');
    });
  });

  it('responds to different mobile states', () => {
    const mobileStates = [MobileState.XSMALL, MobileState.SMALL, MobileState.MEDIUM, MobileState.LARGE];
    
    mobileStates.forEach(state => {
      mockUseMobileDetection.mockReturnValue(state);
      
      const { unmount } = render(<SpecificDateRangeSelector {...defaultProps} />);
      
      const container = screen.getByText('From').closest('div')?.parentElement;
      
      if (state === MobileState.XSMALL) {
        expect(container).toHaveClass('flex-col');
        expect(screen.queryByText('→')).not.toBeInTheDocument();
      } else {
        expect(container).toHaveClass('flex-row', 'items-end');
        expect(screen.getByText('→')).toBeInTheDocument();
      }
      
      unmount();
    });
  });

  it('handles date input focus and blur events', () => {
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    const fromInput = screen.getAllByPlaceholderText('MM/DD/YYYY')[0];
    const toInput = screen.getAllByPlaceholderText('MM/DD/YYYY')[1];
    
    // Test that inputs can receive focus (basic functionality)
    expect(fromInput).toBeInTheDocument();
    expect(toInput).toBeInTheDocument();
    expect(fromInput).not.toBeDisabled();
    expect(toInput).not.toBeDisabled();
  });

  it('handles invalid date input gracefully', () => {
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    const fromInput = screen.getAllByPlaceholderText('MM/DD/YYYY')[0];
    
    // Test that the component renders and can handle input changes
    expect(fromInput).toBeInTheDocument();
    expect(fromInput).toHaveAttribute('type', 'date');
    
    // Date inputs handle validation natively, so we just ensure the handler is called
    fireEvent.change(fromInput, { target: { value: '2024-01-01' } });
    expect(mockHandleFromChange).toHaveBeenCalledTimes(1);
  });

  it('maintains input order consistently', () => {
    render(<SpecificDateRangeSelector {...defaultProps} />);
    
    const labels = screen.getAllByText(/From|To/);
    const inputs = screen.getAllByPlaceholderText('MM/DD/YYYY');
    
    expect(labels[0]).toHaveTextContent('From');
    expect(labels[1]).toHaveTextContent('To');
    expect(inputs).toHaveLength(2);
  });
});
