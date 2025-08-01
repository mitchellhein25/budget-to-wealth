import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TablePagination from '../TablePagination';

describe('TablePagination', () => {
  const testIds = {
    previousButton: 'previous-button',
    nextButton: 'next-button',
    pageButton: 'page-button',
    ellipsis: 'ellipsis',
  };

  const testTexts = {
    previous: 'Previous',
    next: 'Next',
    ellipsis: '...',
  };

  const mockProps = {
    totalPages: 5,
    currentPage: 1,
    handlePageChange: jest.fn(),
    handleNext: jest.fn(),
    handlePrevious: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should not render when totalPages is 1', () => {
      render(<TablePagination {...mockProps} totalPages={1} />);
      expect(screen.queryByText(testTexts.previous)).not.toBeInTheDocument();
      expect(screen.queryByText(testTexts.next)).not.toBeInTheDocument();
    });

    it('should render when totalPages is greater than 1', () => {
      render(<TablePagination {...mockProps} />);
      expect(screen.getByText(testTexts.previous)).toBeInTheDocument();
      expect(screen.getByText(testTexts.next)).toBeInTheDocument();
    });

    it('should render all page numbers when total pages is small', () => {
      render(<TablePagination {...mockProps} totalPages={3} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  describe('Page Number Display', () => {
    it('should always show first and last page', () => {
      render(<TablePagination {...mockProps} totalPages={10} currentPage={5} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should show pages around current page', () => {
      render(<TablePagination {...mockProps} totalPages={10} currentPage={5} />);
      
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument();
      expect(screen.getByText('6')).toBeInTheDocument();
      expect(screen.getByText('7')).toBeInTheDocument();
    });

    it('should show ellipsis when there are gaps', () => {
      render(<TablePagination {...mockProps} totalPages={10} currentPage={5} />);
      
      const ellipsisElements = screen.getAllByText(testTexts.ellipsis);
      expect(ellipsisElements).toHaveLength(2);
    });

    it('should not show ellipsis when pages are consecutive', () => {
      render(<TablePagination {...mockProps} totalPages={5} currentPage={3} />);
      
      expect(screen.queryByText(testTexts.ellipsis)).not.toBeInTheDocument();
    });

    it('should handle current page at the beginning', () => {
      render(<TablePagination {...mockProps} totalPages={10} currentPage={1} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('should handle current page at the end', () => {
      render(<TablePagination {...mockProps} totalPages={10} currentPage={10} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('8')).toBeInTheDocument();
      expect(screen.getByText('9')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
    });
  });

  describe('Button States', () => {
    it('should disable previous button on first page', () => {
      render(<TablePagination {...mockProps} currentPage={1} />);
      
      const previousButton = screen.getByText(testTexts.previous);
      expect(previousButton).toBeDisabled();
    });

    it('should enable previous button on other pages', () => {
      render(<TablePagination {...mockProps} currentPage={3} />);
      
      const previousButton = screen.getByText(testTexts.previous);
      expect(previousButton).not.toBeDisabled();
    });

    it('should disable next button on last page', () => {
      render(<TablePagination {...mockProps} totalPages={5} currentPage={5} />);
      
      const nextButton = screen.getByText(testTexts.next);
      expect(nextButton).toBeDisabled();
    });

    it('should enable next button on other pages', () => {
      render(<TablePagination {...mockProps} totalPages={5} currentPage={3} />);
      
      const nextButton = screen.getByText(testTexts.next);
      expect(nextButton).not.toBeDisabled();
    });
  });

  describe('Current Page Styling', () => {
    it('should highlight current page', () => {
      render(<TablePagination {...mockProps} currentPage={3} />);
      
      const currentPageButton = screen.getByText('3');
      expect(currentPageButton).toHaveClass('btn-primary');
    });

    it('should not highlight other pages', () => {
      render(<TablePagination {...mockProps} currentPage={3} />);
      
      const otherPageButton = screen.getByText('1');
      expect(otherPageButton).toHaveClass('btn-outline');
    });
  });

  describe('Event Handling', () => {
    it('should call handlePrevious when previous button is clicked', () => {
      render(<TablePagination {...mockProps} currentPage={3} />);
      
      const previousButton = screen.getByText(testTexts.previous);
      fireEvent.click(previousButton);
      
      expect(mockProps.handlePrevious).toHaveBeenCalledTimes(1);
    });

    it('should call handleNext when next button is clicked', () => {
      render(<TablePagination {...mockProps} currentPage={3} />);
      
      const nextButton = screen.getByText(testTexts.next);
      fireEvent.click(nextButton);
      
      expect(mockProps.handleNext).toHaveBeenCalledTimes(1);
    });

    it('should call handlePageChange with correct page number', () => {
      render(<TablePagination {...mockProps} />);
      
      const pageButton = screen.getByText('2');
      fireEvent.click(pageButton);
      
      expect(mockProps.handlePageChange).toHaveBeenCalledWith(2);
    });

    it('should not call handlePrevious when button is disabled', () => {
      render(<TablePagination {...mockProps} currentPage={1} />);
      
      const previousButton = screen.getByText(testTexts.previous);
      fireEvent.click(previousButton);
      
      expect(mockProps.handlePrevious).not.toHaveBeenCalled();
    });

    it('should not call handleNext when button is disabled', () => {
      render(<TablePagination {...mockProps} totalPages={5} currentPage={5} />);
      
      const nextButton = screen.getByText(testTexts.next);
      fireEvent.click(nextButton);
      
      expect(mockProps.handleNext).not.toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle single page correctly', () => {
      render(<TablePagination {...mockProps} totalPages={1} currentPage={1} />);
      
      expect(screen.queryByText(testTexts.previous)).not.toBeInTheDocument();
      expect(screen.queryByText(testTexts.next)).not.toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('should handle two pages correctly', () => {
      render(<TablePagination {...mockProps} totalPages={2} currentPage={1} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.queryByText(testTexts.ellipsis)).not.toBeInTheDocument();
    });

    it('should handle large number of pages', () => {
      render(<TablePagination {...mockProps} totalPages={100} currentPage={50} />);
      
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('48')).toBeInTheDocument();
      expect(screen.getByText('49')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
      expect(screen.getByText('51')).toBeInTheDocument();
      expect(screen.getByText('52')).toBeInTheDocument();
      expect(screen.getByText('100')).toBeInTheDocument();
    });
  });
}); 