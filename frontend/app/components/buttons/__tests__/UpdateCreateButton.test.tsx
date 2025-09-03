import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpdateCreateButton } from './UpdateCreateButton';

const mockOnClick = jest.fn();

const defaultProps = {
  isUpdateState: false,
  isDisabled: false,
  onClick: mockOnClick,
};

describe('UpdateCreateButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders as Create button when not in update state', () => {
    render(<UpdateCreateButton {...defaultProps} />);
    
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.queryByText('Update')).not.toBeInTheDocument();
  });

  it('renders as Update button when in update state', () => {
    render(<UpdateCreateButton {...defaultProps} isUpdateState={true} />);
    
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.queryByText('Create')).not.toBeInTheDocument();
  });

  it('is enabled when not disabled', () => {
    render(<UpdateCreateButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeEnabled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<UpdateCreateButton {...defaultProps} isDisabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('calls onClick when clicked and enabled', () => {
    render(<UpdateCreateButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    render(<UpdateCreateButton {...defaultProps} isDisabled={true} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('works without onClick handler', () => {
    render(<UpdateCreateButton {...defaultProps} onClick={undefined} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('has correct button type', () => {
    render(<UpdateCreateButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });
}); 