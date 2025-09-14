import React from 'react';
import { render, screen } from '@testing-library/react';
import { DesktopListItemCell } from '@/app/components/table/DesktopListItemCell';

describe('DesktopListItemCell', () => {
  it('renders with default className', () => {
    render(
      <DesktopListItemCell>
        <span>Test content</span>
      </DesktopListItemCell>
    );

    const cell = screen.getByRole('cell');
    expect(cell).toBeInTheDocument();
    expect(cell).toHaveClass('whitespace-nowrap');
    expect(cell).toHaveStyle({ overflow: 'hidden', maxWidth: '0' });
  });

  it('renders with custom className', () => {
    render(
      <DesktopListItemCell className="custom-class">
        <span>Test content</span>
      </DesktopListItemCell>
    );

    const cell = screen.getByRole('cell');
    expect(cell).toHaveClass('custom-class');
  });

  it('renders children without title', () => {
    render(
      <DesktopListItemCell>
        <span data-testid="test-content">Test content</span>
      </DesktopListItemCell>
    );

    const cell = screen.getByRole('cell');
    const contentDiv = cell.querySelector('div');
    
    expect(contentDiv).toHaveClass('overflow-hidden');
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders children with title', () => {
    render(
      <DesktopListItemCell title="Test title">
        <span data-testid="test-content">Test content</span>
      </DesktopListItemCell>
    );

    const cell = screen.getByRole('cell');
    const contentDiv = cell.querySelector('div');
    
    expect(contentDiv).toHaveClass('max-w-md', 'truncate', 'overflow-hidden');
    expect(contentDiv).toHaveAttribute('title', 'Test title');
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with empty title', () => {
    render(
      <DesktopListItemCell title="">
        <span>Test content</span>
      </DesktopListItemCell>
    );

    const cell = screen.getByRole('cell');
    const contentDiv = cell.querySelector('div');
    
    // Empty string is falsy, so it renders without title div
    expect(contentDiv).toHaveClass('overflow-hidden');
    expect(contentDiv).not.toHaveAttribute('title');
  });
});
