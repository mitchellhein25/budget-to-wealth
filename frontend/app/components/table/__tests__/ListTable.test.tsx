import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ListTable } from '../ListTable';

jest.mock('../TablePagination', () => {
  return function MockTablePagination(props: any) {
    return (
      <div data-testid="table-pagination">
        <button onClick={() => props.handlePrevious()}>Previous</button>
        <button onClick={() => props.handleNext()}>Next</button>
        <button onClick={() => props.handlePageChange(2)}>Page 2</button>
        <button onClick={() => props.handlePageChange(1)}>Page 1</button>
      </div>
    );
  };
});

const testIds = {
  errorMessage: 'error-message',
  loadingSpinner: 'loading-spinner',
  tablePagination: 'table-pagination',
};

const testTexts = {
  errorMessage: 'Failed to load data. Please try again.',
  loadingText: 'Loading...',
};

describe('ListTable', () => {
  const mockItems = [
    { name: 'Item A' },
    { name: 'Item B' },
    { name: 'Item C' },
  ];

  const mockDateItems = [
    { date: '2023-01-01' },
    { date: '2023-01-02' },
    { date: '2023-01-03' },
  ];

  const mockProps = {
    title: 'Test Table',
    items: mockItems,
    headerRow: <tr><th>Name</th></tr>,
    bodyRow: (item: any) => <tr key={item.name}><td>{item.name}</td></tr>,
  };

  describe('Rendering', () => {
    it('should render table title', () => {
      render(<ListTable {...mockProps} />);
      expect(screen.getByText('Test Table')).toBeInTheDocument();
    });

    it('should render table headers', () => {
      render(<ListTable {...mockProps} />);
      expect(screen.getByText('Name')).toBeInTheDocument();
    });

    it('should render table body with items', () => {
      render(<ListTable {...mockProps} />);
      expect(screen.getByText('Item A')).toBeInTheDocument();
      expect(screen.getByText('Item B')).toBeInTheDocument();
      expect(screen.getByText('Item C')).toBeInTheDocument();
    });
  });

  describe('Sorting', () => {
    it('should sort items by name alphabetically', () => {
      const unsortedItems = [
        { name: 'Zebra' },
        { name: 'Apple' },
        { name: 'Banana' },
      ];

      render(
        <ListTable
          {...mockProps}
          items={unsortedItems}
          bodyRow={(item: any) => <tr key={item.name}><td>{item.name}</td></tr>}
        />
      );

      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1);
      expect(dataRows[0]).toHaveTextContent('Apple');
      expect(dataRows[1]).toHaveTextContent('Banana');
      expect(dataRows[2]).toHaveTextContent('Zebra');
    });

    it('should sort date items by date in descending order', () => {
      const unsortedDateItems = [
        { date: '2023-01-03' },
        { date: '2023-01-01' },
        { date: '2023-01-02' },
      ];

      render(
        <ListTable
          {...mockProps}
          items={unsortedDateItems}
          bodyRow={(item: any) => <tr key={item.date}><td>{item.date}</td></tr>}
        />
      );

      const rows = screen.getAllByRole('row');
      const dataRows = rows.slice(1);
      expect(dataRows[0]).toHaveTextContent('2023-01-03');
      expect(dataRows[1]).toHaveTextContent('2023-01-02');
      expect(dataRows[2]).toHaveTextContent('2023-01-01');
    });

    it('should handle mixed item types gracefully', () => {
      const mixedItems = [
        { name: 'Item A' },
        { date: '2023-01-01' },
        { name: 'Item B' },
      ];

      render(
        <ListTable
          {...mockProps}
          items={mixedItems}
          bodyRow={(item: any) => (
            <tr key={item.name || item.date}>
              <td>{item.name || item.date}</td>
            </tr>
          )}
        />
      );

      expect(screen.getByText('Item A')).toBeInTheDocument();
      expect(screen.getByText('2023-01-01')).toBeInTheDocument();
      expect(screen.getByText('Item B')).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should not show pagination when total pages is 1', () => {
      render(<ListTable {...mockProps} itemsPerPage={10} />);
      expect(screen.queryByTestId(testIds.tablePagination)).not.toBeInTheDocument();
    });

    it('should show pagination when total pages is greater than 1', () => {
      const manyItems = Array.from({ length: 15 }, (_, i) => ({ name: `Item ${i + 1}` }));
      
      render(
        <ListTable
          {...mockProps}
          items={manyItems}
          itemsPerPage={5}
          bodyRow={(item: any) => <tr key={item.name}><td>{item.name}</td></tr>}
        />
      );

      expect(screen.getByTestId(testIds.tablePagination)).toBeInTheDocument();
    });

    it('should handle page changes correctly', () => {
      const manyItems = Array.from({ length: 12 }, (_, i) => ({ name: `Item ${i + 1}` }));
      
      render(
        <ListTable
          {...mockProps}
          items={manyItems}
          itemsPerPage={5}
          bodyRow={(item: any) => <tr key={item.name}><td>{item.name}</td></tr>}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 10')).toBeInTheDocument();
      expect(screen.getByText('Item 11')).toBeInTheDocument();
      expect(screen.getByText('Item 12')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
      expect(screen.queryByText('Item 3')).not.toBeInTheDocument();

      const pageChangeButton = screen.getByText('Page 2');
      fireEvent.click(pageChangeButton);

      expect(screen.getByText('Item 3')).toBeInTheDocument();
      expect(screen.getByText('Item 4')).toBeInTheDocument();
      expect(screen.getByText('Item 5')).toBeInTheDocument();
      expect(screen.getByText('Item 6')).toBeInTheDocument();
      expect(screen.getByText('Item 7')).toBeInTheDocument();
      expect(screen.queryByText('Item 8')).not.toBeInTheDocument();
      expect(screen.queryByText('Item 9')).not.toBeInTheDocument();
    });

    it('should handle previous and next navigation', () => {
      const manyItems = Array.from({ length: 12 }, (_, i) => ({ name: `Item ${i + 1}` }));
      
      render(
        <ListTable
          {...mockProps}
          items={manyItems}
          itemsPerPage={5}
          bodyRow={(item: any) => <tr key={item.name}><td>{item.name}</td></tr>}
        />
      );

      const nextButton = screen.getByText('Next');
      const previousButton = screen.getByText('Previous');

      fireEvent.click(nextButton);
      expect(screen.getByText('Item 3')).toBeInTheDocument();
      expect(screen.getByText('Item 4')).toBeInTheDocument();
      expect(screen.getByText('Item 5')).toBeInTheDocument();
      expect(screen.getByText('Item 6')).toBeInTheDocument();
      expect(screen.getByText('Item 7')).toBeInTheDocument();

      fireEvent.click(previousButton);
      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 10')).toBeInTheDocument();
      expect(screen.getByText('Item 11')).toBeInTheDocument();
      expect(screen.getByText('Item 12')).toBeInTheDocument();
      expect(screen.getByText('Item 2')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading spinner when isLoading is true', () => {
      render(<ListTable {...mockProps} isLoading={true} />);
      
      expect(screen.getByText(testTexts.loadingText)).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should not show loading spinner when isLoading is false', () => {
      render(<ListTable {...mockProps} isLoading={false} />);
      
      expect(screen.queryByText(testTexts.loadingText)).not.toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should show error message when isError is true', () => {
      render(<ListTable {...mockProps} isError={true} />);
      
      expect(screen.getByText(testTexts.errorMessage)).toBeInTheDocument();
      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });

    it('should not show error message when isError is false', () => {
      render(<ListTable {...mockProps} isError={false} />);
      
      expect(screen.queryByText(testTexts.errorMessage)).not.toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should not show loading spinner when both isLoading and isError are true', () => {
      render(<ListTable {...mockProps} isLoading={true} isError={true} />);
      
      expect(screen.getByText(testTexts.errorMessage)).toBeInTheDocument();
      expect(screen.queryByText(testTexts.loadingText)).not.toBeInTheDocument();
    });
  });

  describe('Default Values', () => {
    it('should use default itemsPerPage of 10', () => {
      const manyItems = Array.from({ length: 15 }, (_, i) => ({ name: `Item ${i + 1}` }));
      
      render(
        <ListTable
          {...mockProps}
          items={manyItems}
          bodyRow={(item: any) => <tr key={item.name}><td>{item.name}</td></tr>}
        />
      );

      expect(screen.getByText('Item 1')).toBeInTheDocument();
      expect(screen.getByText('Item 10')).toBeInTheDocument();
      expect(screen.queryByText('Item 11')).toBeInTheDocument();
    });
  });
}); 