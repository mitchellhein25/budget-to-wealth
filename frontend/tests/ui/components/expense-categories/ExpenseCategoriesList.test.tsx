import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as getExpenseHook from '@/app/lib/api/expense-categories/getExpenseCategories';
import * as putExpenseHook from '@/app/lib/api/expense-categories/putExpenseCategories';
import * as deleteExpenseHook from '@/app/lib/api/expense-categories/deleteExpenseCategories';
import ExpenseCategories from '@/app/ui/components/expense-categories/ExpenseCategories';

jest.mock('@/app/lib/api/expense-categories/getExpenseCategories');
jest.mock('@/app/lib/api/expense-categories/putExpenseCategories');
jest.mock('@/app/lib/api/expense-categories/deleteExpenseCategories');

const mockGetExpenseCategories = getExpenseHook.getExpenseCategories as jest.Mock;
const mockPutExpenseCategories = putExpenseHook.putExpenseCategories as jest.Mock;
const mockDeleteExpenseCategories = deleteExpenseHook.deleteExpenseCategories as jest.Mock;

const foodCategory = 'Food';
const foodCategoryId = 1;
const utilitiesCategory = 'Utilities';
const utilitiesCategoryId = 2;

const mockCategories = [
  { id: foodCategoryId, name: foodCategory },
  { id: utilitiesCategoryId, name: utilitiesCategory },
];

const editButtonLabel = 'Edit';
describe('ExpenseCategories', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const setupComponent = async (mockData = {
    data: mockCategories,
    responseMessage: '',
    successful: true
  }) => {
    await act(async () =>
    {
      mockGetExpenseCategories.mockResolvedValue(mockData);
      render(<ExpenseCategories isLoggedIn={true} />)
    });
  };

  const getNonNameTextbox = () => {
    const input = screen.getAllByRole('textbox');
    const nameInput = input.find((el) => el.id != "Name");
    if (nameInput) {
      return nameInput;
    }
  }

  describe('Rendering states', () => {
    it('renders list of categories correctly', async () => {
      await setupComponent();

      await waitFor(() => {
        expect(screen.getByText('Expense Categories')).toBeInTheDocument();
        expect(screen.getByText(foodCategory)).toBeInTheDocument();
        expect(screen.getByText(utilitiesCategory)).toBeInTheDocument();
      });
    });

    it('renders empty state message when no categories exist', async () => {
      await setupComponent({
        data: [],
        responseMessage: '',
        successful: true
      });

      await waitFor(() => {
        expect(screen.getByText('No Expense Categories Found')).toBeInTheDocument();
        expect(
          screen.getByText("You haven’t added any Expense Categories yet.")
        ).toBeInTheDocument();
      });
    });

    it('renders error message when fetch fails', async () => {
      await setupComponent({
        data: [],
        responseMessage: 'Internal Server Error',
        successful: false
      });

      await waitFor(() => {
        expect(screen.getByText('Failed to load expense categories')).toBeInTheDocument();
        expect(screen.getByText('Internal Server Error')).toBeInTheDocument();
      });
    });
  });

  describe('User interactions', () => {
    it('enters edit mode when the edit button is clicked', async () => {
      await setupComponent();

      const editButtons = screen.getAllByLabelText(editButtonLabel);
      await act(async () => {
        fireEvent.click(editButtons[0]);
      });

      const input = getNonNameTextbox();
      if (input) {
        await act(async () => {
          await userEvent.clear(input);
          await userEvent.type(input, 'Updated Category');
        });
      }

      expect(input).toHaveValue('Updated Category');
    });

    it('saves changes when the save button is clicked', async () => {
      mockPutExpenseCategories.mockResolvedValue({
        data: { id: 1, name: 'Updated Category' },
        responseMessage: '',
        successful: true
      });
      
      await setupComponent();

      const editButtons = screen.getAllByLabelText(editButtonLabel);
      await act(async () => {
        fireEvent.click(editButtons[0]);
      });

      const input = getNonNameTextbox();
      if (input) {
        await act(async () => {
          input.focus();
          await userEvent.clear(input);
          await userEvent.type(input, 'Updated Category');
        });
      }

      const saveButton = screen.getByLabelText('Save');
      await act(async () => {
        fireEvent.click(saveButton);
      });

      expect(mockPutExpenseCategories).toHaveBeenCalledWith({ id: 1, name: 'Updated Category' });
    });

    it('cancels changes when the cancel button is clicked', async () => {
      await setupComponent();

      const editButtons = screen.getAllByLabelText(editButtonLabel);
      await act(async () => {
        fireEvent.click(editButtons[0]);
      });

      const input = getNonNameTextbox();
      if (input) {
        await act(async () => {
          await userEvent.clear(input);
          await userEvent.type(input, 'Updated Category');
        });
      }

      const cancelButton = screen.getByLabelText('Cancel');
      await act(async () => {
        fireEvent.click(cancelButton);
      });

      expect(screen.getByText(foodCategory)).toBeInTheDocument();
    });

    it('deletes a category when the delete button is clicked', async () => {
      mockDeleteExpenseCategories.mockResolvedValue({
        data: null,
        responseMessage: '',
        successful: true
      });
      
      await setupComponent();

      const buttons = screen.getAllByLabelText('Delete');
      await act(async () => {
        fireEvent.click(buttons[0]);
      });

      expect(mockDeleteExpenseCategories).toHaveBeenCalledWith(1);
      await waitFor(() => {
        expect(screen.queryByText(foodCategory)).not.toBeInTheDocument();
      });
    });
  });
});
