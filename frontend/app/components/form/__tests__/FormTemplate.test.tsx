import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FormTemplate } from '../FormTemplate';
import { MessageState } from '../../Utils';

describe('FormTemplate', () => {
  const testIds = {
    form: 'test-form',
    errorAlert: 'error-alert',
    infoAlert: 'info-alert',
  };

  const testTexts = {
    formHeader: 'Test Form',
    errorMessage: 'This is an error message',
    infoMessage: 'This is an info message',
    inputText: 'Test Input',
    buttonText: 'Submit',
  };

  const mockProps = {
    formId: 'test-form',
    formHeader: testTexts.formHeader,
    inputs: <div>{testTexts.inputText}</div>,
    buttons: <button>{testTexts.buttonText}</button>,
    message: { type: null, text: '' } as MessageState,
    handleSubmit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render form header', () => {
      render(<FormTemplate {...mockProps} />);
      expect(screen.getByText(testTexts.formHeader)).toBeInTheDocument();
    });

    it('should render form inputs', () => {
      render(<FormTemplate {...mockProps} />);
      expect(screen.getByText(testTexts.inputText)).toBeInTheDocument();
    });

    it('should render form buttons', () => {
      render(<FormTemplate {...mockProps} />);
      expect(screen.getByText(testTexts.buttonText)).toBeInTheDocument();
    });

    it('should render form with correct ID', () => {
      render(<FormTemplate {...mockProps} />);
      const form = screen.getByText(testTexts.buttonText).closest('form');
      expect(form).toHaveAttribute('id', mockProps.formId);
    });

    it('should render form with correct CSS classes', () => {
      render(<FormTemplate {...mockProps} />);
      const form = screen.getByText(testTexts.buttonText).closest('form');
      expect(form).toHaveClass('space-y-4');
    });
  });

  describe('Message Display', () => {
    it('should not show any message when message type is none', () => {
      render(<FormTemplate {...mockProps} />);
      
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should show error message when message type is error', () => {
      const errorMessage = { type: 'ERROR', text: testTexts.errorMessage } as MessageState;
      
      render(<FormTemplate {...mockProps} message={errorMessage} />);
      
      const errorAlert = screen.getByText(testTexts.errorMessage);
      expect(errorAlert.closest('.alert')).toHaveClass('alert', 'alert-error');
    });

    it('should show info message when message type is info', () => {
      const infoMessage = { type: 'INFO', text: testTexts.infoMessage } as MessageState;
      
      render(<FormTemplate {...mockProps} message={infoMessage} />);
      
      const infoAlert = screen.getByText(testTexts.infoMessage);
      expect(infoAlert.closest('.alert')).toHaveClass('alert', 'alert-info');
    });

    it('should show both error and info messages when both are present', () => {
      const errorMessage = { type: 'ERROR', text: testTexts.errorMessage } as MessageState;
      const infoMessage = { type: 'INFO', text: testTexts.infoMessage } as MessageState;
      
      render(
        <div>
          <FormTemplate {...mockProps} message={errorMessage} />
          <FormTemplate {...mockProps} message={infoMessage} />
        </div>
      );
      
      const errorAlert = screen.getByText(testTexts.errorMessage);
      expect(errorAlert.closest('.alert')).toHaveClass('alert-error');
      
      const infoAlert = screen.getByText(testTexts.infoMessage);
      expect(infoAlert.closest('.alert')).toHaveClass('alert-info');
    });
  });

  describe('Form Structure', () => {
    it('should render card container with correct classes', () => {
      render(<FormTemplate {...mockProps} />);
      const card = screen.getByText(testTexts.formHeader).closest('.card');
      expect(card).toHaveClass('card', 'bg-base-100', 'shadow-sm', 'w-full', 'max-w-md');
    });

    it('should render card body with correct classes', () => {
      render(<FormTemplate {...mockProps} />);
      const cardBody = screen.getByText(testTexts.formHeader).closest('.card-body');
      expect(cardBody).toHaveClass('card-body', 'p-6');
    });

    it('should render header with correct classes', () => {
      render(<FormTemplate {...mockProps} />);
      const header = screen.getByText(testTexts.formHeader);
      expect(header).toHaveClass('card-title', 'text-lg', 'mb-6', 'text-center');
    });

    it('should render button container with responsive classes', () => {
      render(<FormTemplate {...mockProps} />);
      const buttonContainer = screen.getByText(testTexts.buttonText).closest('.flex');
      expect(buttonContainer).toHaveClass('flex', 'flex-col', 'sm:flex-row', 'gap-2', 'pt-4');
    });
  });

  describe('Form Submission', () => {
    it('should call handleSubmit when form is submitted', async () => {
      render(<FormTemplate {...mockProps} />);
      
      const form = screen.getByText(testTexts.buttonText).closest('form');
      expect(form).not.toBeNull();
      
      const formData = new FormData();
      formData.append('test', 'value');
      
      const submitEvent = new Event('submit', { bubbles: true });
      Object.defineProperty(submitEvent, 'target', { value: form });
      
      await act(async () => {
        form!.dispatchEvent(submitEvent);
      });
      
      expect(mockProps.handleSubmit).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty message text', () => {
      const emptyMessage = { type: 'ERROR', text: '' } as MessageState;
      
      render(<FormTemplate {...mockProps} message={emptyMessage} />);
      
      const alert = screen.getByText(testTexts.buttonText).closest('form')?.querySelector('.alert');
      expect(alert).toHaveTextContent('');
    });

    it('should handle complex input components', () => {
      const complexInputs = (
        <div>
          <input type="text" placeholder="Name" />
          <select>
            <option>Option 1</option>
            <option>Option 2</option>
          </select>
        </div>
      );
      
      render(<FormTemplate {...mockProps} inputs={complexInputs} />);
      
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('should handle multiple buttons', () => {
      const multipleButtons = (
        <>
          <button>Save</button>
          <button>Cancel</button>
          <button>Reset</button>
        </>
      );
      
      render(<FormTemplate {...mockProps} buttons={multipleButtons} />);
      
      expect(screen.getByText('Save')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Reset')).toBeInTheDocument();
    });
  });
}); 