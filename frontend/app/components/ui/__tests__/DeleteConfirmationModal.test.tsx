import { render, screen, fireEvent } from '@testing-library/react';
import { DeleteConfirmationModal } from '@/app/components/ui/DeleteConfirmationModal';

const mockOnClose = jest.fn();
const mockOnConfirm = jest.fn();

const defaultProps = {
  isOpen: true,
  onClose: mockOnClose,
  onConfirm: mockOnConfirm,
};

const customTitle = 'Custom Delete Title';
const customMessage = 'Custom delete message for testing';

describe('DeleteConfirmationModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders when isOpen is true', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    expect(document.querySelector('.modal')).toBeInTheDocument();
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this? This action cannot be undone.')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<DeleteConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(document.querySelector('.modal')).not.toBeInTheDocument();
  });

  it('displays default title and message', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this? This action cannot be undone.')).toBeInTheDocument();
  });

  it('displays custom title and message', () => {
    render(
      <DeleteConfirmationModal 
        {...defaultProps} 
        title={customTitle}
        message={customMessage}
      />
    );
    
    expect(screen.getByText(customTitle)).toBeInTheDocument();
    expect(screen.getByText(customMessage)).toBeInTheDocument();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when X button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: '' });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when delete button is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when modal backdrop is clicked', () => {
    render(<DeleteConfirmationModal {...defaultProps} />);
    
    const backdrop = document.querySelector('.modal-backdrop');
    fireEvent.click(backdrop!);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('disables buttons when loading', () => {
    render(<DeleteConfirmationModal {...defaultProps} isLoading={true} />);
    
    const cancelButton = screen.getByText('Cancel');
    const deleteButton = screen.getByText('Delete');
    const closeButton = screen.getByRole('button', { name: '' });
    
    expect(cancelButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
    expect(closeButton).toBeDisabled();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<DeleteConfirmationModal {...defaultProps} isLoading={true} />);
    
    expect(document.querySelector('.loading')).toBeInTheDocument();
  });

  it('shows trash icon when not loading', () => {
    render(<DeleteConfirmationModal {...defaultProps} isLoading={false} />);
    
    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeEnabled();
  });
});
