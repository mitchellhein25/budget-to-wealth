// import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
// import * as postRequestHook from '@/app/lib/api/rest-methods/postRequest';
// import ExpenseCategories from "@/app/ui/components/expense-categories/ExpenseCategories";

// jest.mock('@/app/lib/api/rest-methods/postRequest');

// const mockPostExpenseCategories = postRequestHook.postRequest as jest.Mock;

// const nameLabel = "Name";
// const createButtonLabel = "Create";

// describe('ExpenseCategoriesForm', () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });

//   async function setupComponent() {
//     await act(async () =>
//     {
//       render(<ExpenseCategories isLoggedIn={true} />)
//     });
//   }

//   it('renders the form correctly', async () => {
//     await setupComponent();
//     expect(screen.getByLabelText(nameLabel)).toBeInTheDocument();
//     expect(screen.getByRole('button', { name: createButtonLabel })).toBeInTheDocument();
//   });

//   it('updates input value when typing', async () => {
//     await setupComponent();
//     const input = screen.getByLabelText(nameLabel);
//     act(() => {
//       fireEvent.change(input, { target: { value: 'Utilities' } });
//     });
//     expect(input).toHaveValue('Utilities');
//   });

//   it('shows success message after successful submission', async () => {
//     mockPostExpenseCategories.mockResolvedValue({
//       successful: true,
//       responseMessage: '',
//     });

//     await setupComponent();
//     const input = screen.getByLabelText(nameLabel);
//     const button = screen.getByRole('button', { name: createButtonLabel });

//     act(() => {
//       fireEvent.change(input, { target: { value: 'Utilities' } });
//       fireEvent.click(button);
//     });

//     await waitFor(() => {
//       expect(screen.getByText(/created successfully/)).toBeInTheDocument();
//     });
//   });

//   it('shows error message after failed submission', async () => {
//     mockPostExpenseCategories.mockResolvedValue({
//       successful: false,
//       responseMessage: 'Category already exists',
//     });

//     await setupComponent();
//     const input = screen.getByLabelText(nameLabel);
//     const button = screen.getByRole('button', { name: createButtonLabel });

//     act(() => {
//       fireEvent.change(input, { target: { value: 'Rent' } });
//       fireEvent.click(button);
//     });

//     await waitFor(() => {
//       expect(screen.getByText(/Failed to create/)).toBeInTheDocument();
//     });
//   });
// });