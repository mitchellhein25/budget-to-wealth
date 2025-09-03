import { render, screen } from '@testing-library/react';
import { DesktopNav } from '../DesktopNav';
import { NavItems } from '../utils';

describe('DesktopNav', () => {
  it('renders all navigation items', () => {
    render(<DesktopNav pathname={NavItems[0].href} />);

    NavItems.forEach((item) => {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('applies correct classes to container', () => {
    render(<DesktopNav pathname={NavItems[0].href} />);

    const container = screen.getByText(NavItems[0].label).closest('.navbar-center');
    expect(container).toHaveClass('navbar-center', 'hidden', 'lg:flex');
  });

  it('applies correct classes to navigation items container', () => {
    render(<DesktopNav pathname={NavItems[0].href} />);

    const itemsContainer = screen.getByText(NavItems[0].label).closest('.flex');
    expect(itemsContainer).toHaveClass('flex', 'space-x-1');
  });

  it('marks active when pathname starts with just first level', () => {
    render(<DesktopNav pathname={`${NavItems[0].href.split('/').slice(0, 2).join('/')}`} />);

    const cashFlowLink = screen.getByText(NavItems[0].label);
    expect(cashFlowLink).toHaveClass('btn', 'btn-primary');
  });

  it('marks active when pathname starts with exact match', () => {
    render(<DesktopNav pathname={NavItems[0].href} />);

    const cashFlowLink = screen.getByText(NavItems[0].label);
    expect(cashFlowLink).toHaveClass('btn', 'btn-primary');
  });

  it('handles deep nested paths', () => {
    render(<DesktopNav pathname={`${NavItems[1].href}/test1/test2`} />);

    const cashFlowLink = screen.getByText(NavItems[1].label);
    expect(cashFlowLink).toHaveClass('btn', 'btn-primary');
  });
  
  it('marks items as inactive when pathname does not match', () => {
    render(<DesktopNav pathname="/profile" />);

    NavItems.forEach((item) => {
      expect(screen.getByText(item.label)).toHaveClass('btn', 'btn-ghost');
    });
  });
}); 