import React from 'react';
import { render, screen } from '@testing-library/react';
import { ImportPage } from '@/app/import';

jest.mock('@/app/import', () => ({
  __esModule: true,
  DataImport: () => <div data-testid="data-import">DataImport Component</div>,
}));

describe('Import Page', () => {
  it('renders the DataImport component', () => {
    const PageComponent = ImportPage();
    render(PageComponent);
    
    expect(screen.getByTestId('data-import')).toBeInTheDocument();
  });
});
