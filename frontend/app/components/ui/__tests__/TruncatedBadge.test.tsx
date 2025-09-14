import React from 'react';
import { render, screen } from '@testing-library/react';
import { TruncatedBadge } from '@/app/components/ui/TruncatedBadge';

describe('TruncatedBadge', () => {
  it('renders with default props', () => {
    render(
      <TruncatedBadge>
        Test Badge
      </TruncatedBadge>
    );

    const badge = screen.getByText('Test Badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      'inline-block',
      'px-2',
      'py-1',
      'text-xs',
      'font-medium',
      'bg-primary',
      'text-primary-content',
      'rounded-full',
      'max-w-full',
      'text-left',
      'overflow-hidden',
      'text-ellipsis',
      'whitespace-nowrap'
    );
    expect(badge.tagName).toBe('SPAN');
  });

  it('renders with custom className', () => {
    render(
      <TruncatedBadge className="custom-class">
        Test Badge
      </TruncatedBadge>
    );

    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveClass('inline-block', 'px-2', 'py-1');
  });

  it('renders with title attribute', () => {
    render(
      <TruncatedBadge title="Tooltip text">
        Test Badge
      </TruncatedBadge>
    );

    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveAttribute('title', 'Tooltip text');
  });

  it('renders with both className and title', () => {
    render(
      <TruncatedBadge className="custom-class" title="Tooltip text">
        Test Badge
      </TruncatedBadge>
    );

    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveClass('custom-class');
    expect(badge).toHaveAttribute('title', 'Tooltip text');
  });

  it('renders with empty title', () => {
    render(
      <TruncatedBadge title="">
        Test Badge
      </TruncatedBadge>
    );

    const badge = screen.getByText('Test Badge');
    expect(badge).toHaveAttribute('title', '');
  });
});
