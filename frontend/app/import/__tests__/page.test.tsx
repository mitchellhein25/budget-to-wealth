import React from 'react';
import { render, screen } from '@testing-library/react';
import page from './page';

jest.mock('./components/DataImport', () => ({
  __esModule: true,
  default: () => <div data-testid="data-import">DataImport Component</div>,
}));

describe('Import Page', () => {
  it('renders the DataImport component', () => {
    const PageComponent = page();
    render(PageComponent);
    
    expect(screen.getByTestId('data-import')).toBeInTheDocument();
  });
});
