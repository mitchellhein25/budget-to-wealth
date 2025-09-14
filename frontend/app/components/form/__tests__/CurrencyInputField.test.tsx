import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CurrencyInputField } from '@/app/components/form/CurrencyInputField';

describe('CurrencyInputField', () => {
  const mockOnChange = jest.fn();
  const defaultProps = {
    id: 'test-currency',
    name: 'testCurrency',
    value: '100.00',
    onChange: mockOnChange,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(<CurrencyInputField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    const dollarSign = screen.getByText('$');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('id', 'test-currency');
    expect(input).toHaveAttribute('name', 'testCurrency');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveValue('100.00');
    expect(input).toHaveAttribute('placeholder', '0.00');
    expect(input).toHaveClass('input', 'w-full', 'pl-8');
    expect(dollarSign).toBeInTheDocument();
    expect(dollarSign).toHaveClass('absolute', 'left-3', 'text-gray-500', 'pointer-events-none', 'z-10');
  });

  it('renders with custom placeholder', () => {
    render(
      <CurrencyInputField 
        {...defaultProps} 
        placeholder="Enter amount"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('placeholder', 'Enter amount');
  });

  it('renders with custom className', () => {
    render(
      <CurrencyInputField 
        {...defaultProps} 
        className="custom-input"
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-input', 'pl-8');
  });

  it('calls onChange when input value changes', () => {
    render(<CurrencyInputField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '200.50' } });

    expect(mockOnChange).toHaveBeenCalledTimes(1);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'change'
      })
    );
  });

  it('renders with empty value', () => {
    render(
      <CurrencyInputField 
        {...defaultProps} 
        value=""
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('renders with all props combined', () => {
    render(
      <CurrencyInputField 
        id="custom-id"
        name="customName"
        value="500.75"
        onChange={mockOnChange}
        placeholder="Enter custom amount"
        className="custom-class"
      />
    );

    const input = screen.getByRole('textbox');
    const dollarSign = screen.getByText('$');

    expect(input).toHaveAttribute('id', 'custom-id');
    expect(input).toHaveAttribute('name', 'customName');
    expect(input).toHaveValue('500.75');
    expect(input).toHaveAttribute('placeholder', 'Enter custom amount');
    expect(input).toHaveClass('custom-class', 'pl-8');
    expect(dollarSign).toBeInTheDocument();
  });

  it('handles multiple onChange events', () => {
    render(<CurrencyInputField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.change(input, { target: { value: '200' } });
    fireEvent.change(input, { target: { value: '300' } });

    expect(mockOnChange).toHaveBeenCalledTimes(3);
  });

  it('handles focus events', () => {
    render(<CurrencyInputField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    input.focus();

    expect(input).toHaveFocus();
  });

  it('handles blur events', () => {
    render(<CurrencyInputField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    input.focus();
    input.blur();

    expect(input).not.toHaveFocus();
  });

  it('handles key press events', () => {
    render(<CurrencyInputField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

    expect(input).toBeInTheDocument();
  });

  it('renders with different id and name combinations', () => {
    render(
      <CurrencyInputField 
        id="unique-id"
        name="uniqueName"
        value="100"
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'unique-id');
    expect(input).toHaveAttribute('name', 'uniqueName');
  });

  it('handles rapid value changes', () => {
    render(<CurrencyInputField {...defaultProps} />);

    const input = screen.getByRole('textbox');
    
    // Simulate rapid typing
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.change(input, { target: { value: '12' } });
    fireEvent.change(input, { target: { value: '123' } });
    fireEvent.change(input, { target: { value: '1234' } });

    expect(mockOnChange).toHaveBeenCalledTimes(4);
  });

  it('renders with undefined value', () => {
    render(
      <CurrencyInputField 
        {...defaultProps} 
        value={undefined as unknown as string}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });

  it('renders with null value', () => {
    render(
      <CurrencyInputField 
        {...defaultProps} 
        value={null as unknown as string}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
  });
});
