import { handleFormSubmit } from './handleFormSubmit';
import { putRequest } from '@/app/lib/api/rest-methods/putRequest';
import { postRequest } from '@/app/lib/api/rest-methods/postRequest';
import { MessageState } from '../../Utils';

jest.mock('@/app/lib/api/rest-methods/putRequest');
jest.mock('@/app/lib/api/rest-methods/postRequest');

const mockPutRequest = putRequest as jest.MockedFunction<typeof putRequest>;
const mockPostRequest = postRequest as jest.MockedFunction<typeof postRequest>;

const testId = 'test-id';
const testItemName = 'Test Item';
const testItemNameLowercase = 'test item';
const testItemNameNoSpaces = 'test-item';
const testEndpoint = '/api/test-items';
const testItem = { id: testId, name: 'Test Item Name' };
let testFormData = new FormData();

const mockSetIsSubmitting = jest.fn();
const mockSetMessage = jest.fn();
const mockFetchItems = jest.fn();
const mockSetEditingFormData = jest.fn();
const mockTransformFormDataToItem = jest.fn();

const createMockArgs = (overrides: Partial<any> = {}) => ({
  formData: testFormData,
  transformFormDataToItem: mockTransformFormDataToItem,
  setIsSubmitting: mockSetIsSubmitting,
  setMessage: mockSetMessage,
  fetchItems: mockFetchItems,
  setEditingFormData: mockSetEditingFormData,
  itemName: testItemName,
  itemEndpoint: testEndpoint,
  ...overrides
});

describe('handleFormSubmit', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    testFormData = new FormData();
    console.error = jest.fn();
  });

  describe('successful operations', () => {
    it('successfully creates a new item', async () => {
      mockTransformFormDataToItem.mockReturnValue({ item: testItem, errors: [] });
      mockPostRequest.mockResolvedValue({ data: testItem, responseMessage: 'Created', successful: true });

      await handleFormSubmit(createMockArgs());

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockSetMessage).toHaveBeenCalledWith({ type: null, text: '' });
      expect(mockTransformFormDataToItem).toHaveBeenCalledWith(testFormData);
      expect(mockPostRequest).toHaveBeenCalledWith(testEndpoint, testItem);
      expect(mockFetchItems).toHaveBeenCalled();
      expect(mockSetEditingFormData).toHaveBeenCalledWith({});
      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'INFO', text: 'Test Item created successfully.' });
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('successfully updates an existing item', async () => {
      testFormData.append(`${testItemNameNoSpaces}-id`, testId);
      mockTransformFormDataToItem.mockReturnValue({ item: testItem, errors: [] });
      mockPutRequest.mockResolvedValue({ data: testItem, responseMessage: 'Updated', successful: true });

      await handleFormSubmit(createMockArgs());

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockSetMessage).toHaveBeenCalledWith({ type: null, text: '' });
      expect(mockTransformFormDataToItem).toHaveBeenCalledWith(testFormData);
      expect(mockPutRequest).toHaveBeenCalledWith(testEndpoint, testId, testItem);
      expect(mockFetchItems).toHaveBeenCalled();
      expect(mockSetEditingFormData).toHaveBeenCalledWith({});
      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'INFO', text: 'Test Item updated successfully.' });
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('handles item name with spaces correctly', async () => {
      const itemNameWithSpaces = 'Test Item Name';
      const itemNameLowercase = 'test item name';
      const itemNameNoSpaces = 'test-item-name';
      
      testFormData.append(`${itemNameNoSpaces}-id`, testId);
      mockTransformFormDataToItem.mockReturnValue({ item: testItem, errors: [] });
      mockPutRequest.mockResolvedValue({ data: testItem, responseMessage: 'Updated', successful: true });

      await handleFormSubmit(createMockArgs({ itemName: itemNameWithSpaces }));

      expect(mockPutRequest).toHaveBeenCalledWith(testEndpoint, testId, testItem);
      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'INFO', text: 'Test Item Name updated successfully.' });
    });
  });

  describe('validation errors', () => {
    it('handles validation errors from transformFormDataToItem', async () => {
      const validationErrors = ['Name is required', 'Amount must be positive'];
      mockTransformFormDataToItem.mockReturnValue({ item: null, errors: validationErrors });

      await handleFormSubmit(createMockArgs());

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
      expect(mockSetMessage).toHaveBeenCalledWith({ type: null, text: '' });
      expect(mockTransformFormDataToItem).toHaveBeenCalledWith(testFormData);
      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'ERROR', text: validationErrors.join(', ') });
      expect(mockPostRequest).not.toHaveBeenCalled();
      expect(mockPutRequest).not.toHaveBeenCalled();
      expect(mockFetchItems).not.toHaveBeenCalled();
      expect(mockSetEditingFormData).not.toHaveBeenCalled();
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('handles null item from transformFormDataToItem', async () => {
      mockTransformFormDataToItem.mockReturnValue({ item: null, errors: [] });

      await handleFormSubmit(createMockArgs());

      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'ERROR', text: '' });
      expect(mockPostRequest).not.toHaveBeenCalled();
      expect(mockPutRequest).not.toHaveBeenCalled();
    });
  });

  describe('API failures', () => {
    it('handles create API failure', async () => {
      mockTransformFormDataToItem.mockReturnValue({ item: testItem, errors: [] });
      mockPostRequest.mockResolvedValue({ data: null, responseMessage: 'Server error', successful: false });

      await handleFormSubmit(createMockArgs());

      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'ERROR', text: 'Failed to create test item: Server error' });
      expect(mockFetchItems).not.toHaveBeenCalled();
      expect(mockSetEditingFormData).not.toHaveBeenCalled();
    });

    it('handles update API failure', async () => {
      testFormData.append(`${testItemNameNoSpaces}-id`, testId);
      mockTransformFormDataToItem.mockReturnValue({ item: testItem, errors: [] });
      mockPutRequest.mockResolvedValue({ data: null, responseMessage: 'Not found', successful: false });

      await handleFormSubmit(createMockArgs());

      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'ERROR', text: 'Failed to update test item: Not found' });
      expect(mockFetchItems).not.toHaveBeenCalled();
      expect(mockSetEditingFormData).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    it('handles unexpected errors during API call', async () => {
      mockTransformFormDataToItem.mockReturnValue({ item: testItem, errors: [] });
      mockPostRequest.mockRejectedValue(new Error('Network error'));

      await handleFormSubmit(createMockArgs());

      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'ERROR', text: 'An unexpected error occurred. Please try again.' });
      expect(console.error).toHaveBeenCalledWith('Submit error:', expect.any(Error));
      expect(mockFetchItems).not.toHaveBeenCalled();
      expect(mockSetEditingFormData).not.toHaveBeenCalled();
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('handles unexpected errors during validation', async () => {
      mockTransformFormDataToItem.mockImplementation(() => {
        throw new Error('Validation error');
      });

      await handleFormSubmit(createMockArgs());

      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'ERROR', text: 'An unexpected error occurred. Please try again.' });
      expect(console.error).toHaveBeenCalledWith('Submit error:', expect.any(Error));
      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });

    it('ensures setIsSubmitting is called in finally block even on error', async () => {
      mockTransformFormDataToItem.mockImplementation(() => {
        throw new Error('Test error');
      });

      await handleFormSubmit(createMockArgs());

      expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
    });
  });

  describe('edge cases', () => {
    it('handles empty item name', async () => {
      mockTransformFormDataToItem.mockReturnValue({ item: testItem, errors: [] });
      mockPostRequest.mockResolvedValue({ data: testItem, responseMessage: 'Created', successful: true });

      await handleFormSubmit(createMockArgs({ itemName: '' }));

      expect(mockPostRequest).toHaveBeenCalledWith(testEndpoint, testItem);
      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'INFO', text: ' created successfully.' });
    });

    it('handles item name with special characters', async () => {
      const specialItemName = 'Test-Item_123';
      const specialItemNameLowercase = 'test-item_123';
      const specialItemNameNoSpaces = 'test-item_123';
      
      testFormData.append(`${specialItemNameNoSpaces}-id`, testId);
      mockTransformFormDataToItem.mockReturnValue({ item: testItem, errors: [] });
      mockPutRequest.mockResolvedValue({ data: testItem, responseMessage: 'Updated', successful: true });

      await handleFormSubmit(createMockArgs({ itemName: specialItemName }));

      expect(mockPutRequest).toHaveBeenCalledWith(testEndpoint, testId, testItem);
      expect(mockSetMessage).toHaveBeenCalledWith({ type: 'INFO', text: 'Test-Item_123 updated successfully.' });
    });

    it('handles form data with multiple ID values', async () => {
      testFormData.append(`${testItemNameNoSpaces}-id`, testId);
      testFormData.append(`${testItemNameNoSpaces}-id`, 'another-id');
      mockTransformFormDataToItem.mockReturnValue({ item: testItem, errors: [] });
      mockPutRequest.mockResolvedValue({ data: testItem, responseMessage: 'Updated', successful: true });

      await handleFormSubmit(createMockArgs());

      expect(mockPutRequest).toHaveBeenCalledWith(testEndpoint, testId, testItem);
    });
  });
}); 