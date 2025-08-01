import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ResetButton } from '../ResetButton';

describe('ResetButton', () => {
  const testIds = {
    resetButton: 'reset-button',
  };

  const testTexts = {
    resetText: 'Reset',
  };

  const mockProps = {
    onClick: jest.fn(),
    isHidden: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render reset button with correct text', () => {
      render(<ResetButton {...mockProps} />);
      expect(screen.getByText(testTexts.resetText)).toBeInTheDocument();
    });

    it('should render button with correct type', () => {
      render(<ResetButton {...mockProps} />);
      const button = screen.getByText(testTexts.resetText);
      expect(button).toHaveAttribute('type', 'reset');
    });

    it('should render button with correct CSS classes', () => {
      render(<ResetButton {...mockProps} />);
      const button = screen.getByText(testTexts.resetText);
      expect(button).toHaveClass('m-1', 'btn', 'btn-secondary', 'min-w-25');
    });
  });

  describe('Visibility', () => {
    it('should be visible when isHidden is false', () => {
      render(<ResetButton {...mockProps} isHidden={false} />);
      const button = screen.getByText(testTexts.resetText);
      expect(button).not.toHaveAttribute('hidden');
    });

    it('should be hidden when isHidden is true', () => {
      render(<ResetButton {...mockProps} isHidden={true} />);
      const button = screen.getByText(testTexts.resetText);
      expect(button).toHaveAttribute('hidden');
    });
  });

  describe('Event Handling', () => {
    it('should call onClick when button is clicked', () => {
      render(<ResetButton {...mockProps} />);
      
      const button = screen.getByText(testTexts.resetText);
      fireEvent.click(button);
      
      expect(mockProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('should call onClick multiple times when clicked multiple times', () => {
      render(<ResetButton {...mockProps} />);
      
      const button = screen.getByText(testTexts.resetText);
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(mockProps.onClick).toHaveBeenCalledTimes(3);
    });

    it('should call onClick even when button is hidden', () => {
      render(<ResetButton {...mockProps} isHidden={true} />);
      
      const button = screen.getByText(testTexts.resetText);
      fireEvent.click(button);
      
      expect(mockProps.onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should be focusable', () => {
      render(<ResetButton {...mockProps} />);
      const button = screen.getByText(testTexts.resetText);
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should be focusable', () => {
      render(<ResetButton {...mockProps} />);
      const button = screen.getByText(testTexts.resetText);
      button.focus();
      expect(button).toHaveFocus();
    });
  });
}); 