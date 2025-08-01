import { render, screen, fireEvent } from '@testing-library/react';
import TablePagination from '../TablePagination';

describe('TablePagination', () => {
  const mockProps = {
    currentPage: 1,
    totalPages: 5,
    handlePageChange: jest.fn(),
    handlePrevious: jest.fn(),
    handleNext: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pagination controls', () => {
    render(<TablePagination {...mockProps} />);
    
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('displays current page and total pages', () => {
    render(<TablePagination {...mockProps} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('calls handlePrevious when Previous button is clicked', () => {
    render(<TablePagination {...mockProps} currentPage={2} />);
    
    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);
    
    expect(mockProps.handlePrevious).toHaveBeenCalledTimes(1);
  });

  it('calls handleNext when Next button is clicked', () => {
    render(<TablePagination {...mockProps} />);
    
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    
    expect(mockProps.handleNext).toHaveBeenCalledTimes(1);
  });

  it('calls handlePageChange when page number is clicked', () => {
    render(<TablePagination {...mockProps} />);
    
    const pageButton = screen.getByText('2');
    fireEvent.click(pageButton);
    
    expect(mockProps.handlePageChange).toHaveBeenCalledWith(2);
  });

  it('disables Previous button on first page', () => {
    render(<TablePagination {...mockProps} currentPage={1} />);
    
    const previousButton = screen.getByText('Previous');
    expect(previousButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<TablePagination {...mockProps} currentPage={5} />);
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });
}); 