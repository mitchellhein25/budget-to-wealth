import { render, screen } from '@testing-library/react';
import IncomeCategoriesPage from './page';

describe('IncomeCategoriesPage', () => {
  it('renders the page', () => {
    render(<IncomeCategoriesPage />);
    expect(screen.getByText('Income Categories')).toBeInTheDocument();
  });
}); 