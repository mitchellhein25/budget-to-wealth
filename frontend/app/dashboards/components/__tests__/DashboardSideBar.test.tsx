import React from 'react';
import { render, screen } from '@testing-library/react';
import { DashboardSideBar } from '@/app/dashboards/components/DashboardSideBar';
import { NET_WORTH_ITEM_NAME } from '@/app/net-worth/holding-snapshots';
import { CASHFLOW_ITEM_NAME } from '@/app/cashflow';

describe('DashboardSideBar', () => {
  it('renders the component', () => {
    render(<DashboardSideBar />);

    expect(screen.getByText('Navigation')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<DashboardSideBar />);

    expect(screen.getByText(NET_WORTH_ITEM_NAME)).toBeInTheDocument();
    expect(screen.getByText(CASHFLOW_ITEM_NAME)).toBeInTheDocument();
  });

  it('renders navigation links with correct structure', () => {
    render(<DashboardSideBar />);

    const netWorthLink = screen.getByRole('link', { name: NET_WORTH_ITEM_NAME });
    const cashflowLink = screen.getByRole('link', { name: CASHFLOW_ITEM_NAME });

    expect(netWorthLink).toBeInTheDocument();
    expect(cashflowLink).toBeInTheDocument();
    expect(netWorthLink).toHaveAttribute('href');
    expect(cashflowLink).toHaveAttribute('href');
  });
}); 