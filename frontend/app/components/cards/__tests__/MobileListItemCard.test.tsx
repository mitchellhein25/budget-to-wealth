import { render, screen, fireEvent } from '@testing-library/react';
import { MobileListItemCard, MobileListItemCardHeader, MobileListItemCardContent } from '../MobileListItemCard';

describe('MobileListItemCard', () => {
  it('renders with default className', () => {
    render(
      <MobileListItemCard>
        <div>Test content</div>
      </MobileListItemCard>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <MobileListItemCard className="custom-class">
        <div>Test content</div>
      </MobileListItemCard>
    );
    
    const card = screen.getByText('Test content').closest('.card');
    expect(card).toHaveClass('custom-class');
  });

  it('renders without className prop', () => {
    render(
      <MobileListItemCard>
        <div>Test content</div>
      </MobileListItemCard>
    );
    
    const card = screen.getByText('Test content').closest('.card');
    expect(card).toHaveClass('card bg-base-100 border border-base-300 shadow-sm');
  });
});

describe('MobileListItemCardHeader', () => {
  it('renders with left content only', () => {
    render(
      <MobileListItemCardHeader
        leftContent={<div>Left content</div>}
      />
    );
    
    expect(screen.getByText('Left content')).toBeInTheDocument();
    expect(screen.queryByText('Right content')).not.toBeInTheDocument();
  });

  it('renders with both left and right content', () => {
    render(
      <MobileListItemCardHeader
        leftContent={<div>Left content</div>}
        rightContent={<div>Right content</div>}
      />
    );
    
    expect(screen.getByText('Left content')).toBeInTheDocument();
    expect(screen.getByText('Right content')).toBeInTheDocument();
  });

  it('renders with custom className', () => {
    render(
      <MobileListItemCardHeader
        leftContent={<span>Left content</span>}
        rightContent={<span>Right content</span>}
        className="custom-header-class"
      />
    );

    const header = screen.getByText('Left content').closest('div')?.parentElement;
    expect(header).toHaveClass('custom-header-class');
  });

  it('renders without className prop', () => {
    render(
      <MobileListItemCardHeader
        leftContent={<span>Left content</span>}
        rightContent={<span>Right content</span>}
      />
    );

    const header = screen.getByText('Left content').closest('div')?.parentElement;
    expect(header).toHaveClass('flex', 'items-center', 'justify-between', 'mb-2', 'sm:mb-3');
  });
});

describe('MobileListItemCardContent', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with description and action buttons', () => {
    render(
      <MobileListItemCardContent
        description={<div>Test description</div>}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <MobileListItemCardContent
        description={<div>Test description</div>}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <MobileListItemCardContent
        description={<div>Test description</div>}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );
    
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('renders with custom className', () => {
    render(
      <MobileListItemCardContent
        description={<span>Test description</span>}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        className="custom-content-class"
      />
    );

    const content = screen.getByText('Test description').closest('div')?.parentElement;
    expect(content).toHaveClass('custom-content-class');
  });

  it('renders without className prop', () => {
    render(
      <MobileListItemCardContent
        description={<span>Test description</span>}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    const content = screen.getByText('Test description').closest('div')?.parentElement;
    expect(content).toHaveClass('flex', 'items-start', 'justify-between', 'gap-2');
  });
});
