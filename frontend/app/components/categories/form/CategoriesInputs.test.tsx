import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoriesInputs } from './CategoriesInputs';

jest.mock('../../form', () => ({
  InputFieldSetTemplate: jest.fn(({ label, isRequired, inputChild }) => (
    <div data-testid="input-field-set">
      <label>{label}</label>
      <div data-testid="required-indicator">{isRequired ? 'Required' : 'Optional'}</div>
      {inputChild}
    </div>
  )),
}));

const mockOnChange = jest.fn();

const defaultProps = {
  editingFormData: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    name: 'Test Category',
  },
  onChange: mockOnChange,
};

describe('CategoriesInputs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with name input', () => {
    render(<CategoriesInputs {...defaultProps} />);
    
    expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
  });

  it('renders hidden id input', () => {
    render(<CategoriesInputs {...defaultProps} />);
    
    const idInput = screen.getByDisplayValue('123e4567-e89b-12d3-a456-426614174000');
    expect(idInput).toHaveAttribute('hidden');
    expect(idInput).toHaveAttribute('readonly');
  });

  it('displays name field with correct label', () => {
    render(<CategoriesInputs {...defaultProps} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
  });
}); 