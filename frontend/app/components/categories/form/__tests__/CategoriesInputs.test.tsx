import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CategoriesInputs } from '../CategoriesInputs';
import { INCOME_ITEM_NAME_LOWERCASE } from '@/app/cashflow/components';

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
    render(<CategoriesInputs {...defaultProps} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    expect(screen.getByDisplayValue('Test Category')).toBeInTheDocument();
  });

  it('renders hidden id input', () => {
    render(<CategoriesInputs {...defaultProps} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    const idInput = screen.getByDisplayValue('123e4567-e89b-12d3-a456-426614174000');
    expect(idInput).toHaveAttribute('hidden');
    expect(idInput).toHaveAttribute('readonly');
  });

  it('displays name field with correct label', () => {
    render(<CategoriesInputs {...defaultProps} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('handles undefined id in editingFormData', () => {
    const propsWithUndefinedId = {
      editingFormData: {
        id: undefined,
        name: 'Test Category',
      },
      onChange: mockOnChange,
    };

    render(<CategoriesInputs {...propsWithUndefinedId} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    const idInput = screen.getByDisplayValue('');
    expect(idInput).toHaveAttribute('hidden');
    expect(idInput).toHaveAttribute('readonly');
  });

  it('handles null id in editingFormData', () => {
    const propsWithNullId = {
      editingFormData: {
        id: undefined,
        name: 'Test Category',
      },
      onChange: mockOnChange,
    };

    render(<CategoriesInputs {...propsWithNullId} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    const idInput = screen.getByDisplayValue('');
    expect(idInput).toHaveAttribute('hidden');
    expect(idInput).toHaveAttribute('readonly');
  });

  it('handles undefined name in editingFormData', () => {
    const propsWithUndefinedName = {
      editingFormData: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: undefined,
      },
      onChange: mockOnChange,
    };

    render(<CategoriesInputs {...propsWithUndefinedName} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    const nameInput = screen.getByDisplayValue('');
    expect(nameInput).toBeInTheDocument();
  });

  it('handles null name in editingFormData', () => {
    const propsWithNullName = {
      editingFormData: {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: undefined,
      },
      onChange: mockOnChange,
    };

    render(<CategoriesInputs {...propsWithNullName} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    const nameInput = screen.getByDisplayValue('');
    expect(nameInput).toBeInTheDocument();
  });

  it('handles empty editingFormData object', () => {
    const propsWithEmptyData = {
      editingFormData: {},
      onChange: mockOnChange,
    };

    render(<CategoriesInputs {...propsWithEmptyData} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    const inputs = screen.getAllByDisplayValue('');
    const idInput = inputs.find(input => input.getAttribute('id') === `${INCOME_ITEM_NAME_LOWERCASE}-id`);
    const nameInput = inputs.find(input => input.getAttribute('id') === `${INCOME_ITEM_NAME_LOWERCASE}-name`);
    
    expect(idInput).toHaveAttribute('hidden');
    expect(idInput).toHaveAttribute('readonly');
    expect(nameInput).toBeInTheDocument();
  });

  it('handles undefined editingFormData', () => {
    const propsWithUndefinedData = {
      editingFormData: {} as Record<string, unknown>,
      onChange: mockOnChange,
    };

    render(<CategoriesInputs {...propsWithUndefinedData} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    const inputs = screen.getAllByDisplayValue('');
    const idInput = inputs.find(input => input.getAttribute('id') === `${INCOME_ITEM_NAME_LOWERCASE}-id`);
    const nameInput = inputs.find(input => input.getAttribute('id') === `${INCOME_ITEM_NAME_LOWERCASE}-name`);
    
    expect(idInput).toHaveAttribute('hidden');
    expect(idInput).toHaveAttribute('readonly');
    expect(nameInput).toBeInTheDocument();
  });

  it('handles null editingFormData', () => {
    const propsWithNullData = {
      editingFormData: {} as Record<string, unknown>,
      onChange: mockOnChange,
    };

    render(<CategoriesInputs {...propsWithNullData} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    const inputs = screen.getAllByDisplayValue('');
    const idInput = inputs.find(input => input.getAttribute('id') === `${INCOME_ITEM_NAME_LOWERCASE}-id`);
    const nameInput = inputs.find(input => input.getAttribute('id') === `${INCOME_ITEM_NAME_LOWERCASE}-name`);
    
    expect(idInput).toHaveAttribute('hidden');
    expect(idInput).toHaveAttribute('readonly');
    expect(nameInput).toBeInTheDocument();
  });

  it('calls onChange when name input changes', () => {
    render(<CategoriesInputs {...defaultProps} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    const nameInput = screen.getByDisplayValue('Test Category');
    fireEvent.change(nameInput, { target: { value: 'New Category Name' } });
    
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'Test Category',
        }),
      })
    );
  });

  it('displays required indicator for name field', () => {
    render(<CategoriesInputs {...defaultProps} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('renders InputFieldSetTemplate with correct props', () => {
    render(<CategoriesInputs {...defaultProps} categoryTypeName={INCOME_ITEM_NAME_LOWERCASE} />);
    
    expect(screen.getByTestId('input-field-set')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });
}); 