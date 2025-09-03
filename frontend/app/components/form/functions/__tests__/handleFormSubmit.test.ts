import { handleFormSubmit } from '@/app/components';
import { postRequest, putRequest } from '@/app/lib/api';

jest.mock('@/app/lib/api/rest-methods/postRequest', () => ({
  postRequest: jest.fn(),
}));

jest.mock('@/app/lib/api/rest-methods/putRequest', () => ({
  putRequest: jest.fn(),
}));


describe('handleFormSubmit', () => {
  const mockTransformFormDataToItem = jest.fn();
  const mockSetIsSubmitting = jest.fn();
  const mockSetMessage = jest.fn();
  const mockFetchItems = jest.fn();
  const mockSetEditingFormData = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => {});
    mockTransformFormDataToItem.mockReturnValue({ 
      item: { id: 123, name: 'Test Item' }, 
      errors: [] 
    });
    (postRequest as jest.Mock).mockResolvedValue({ 
      successful: true, 
      data: { id: 123, name: 'Test Item' },
      responseMessage: 'Success'
    });
    (putRequest as jest.Mock).mockResolvedValue({ 
      successful: true, 
      data: { id: 123, name: 'Test Item' },
      responseMessage: 'Success'
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('handles successful form submission for new item', async () => {
    const mockFormData = new FormData();
    mockFormData.append('test-item-name', 'Test Item');
    
    const mockArgs = {
      formData: mockFormData,
      transformFormDataToItem: mockTransformFormDataToItem,
      setIsSubmitting: mockSetIsSubmitting,
      setMessage: mockSetMessage,
      fetchItems: mockFetchItems,
      setEditingFormData: mockSetEditingFormData,
      itemName: 'Test Item',
      itemEndpoint: '/api/test-items'
    };
    
    await handleFormSubmit(mockArgs);
    
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
    expect(mockSetMessage).toHaveBeenCalledWith({ type: null, text: '' });
    expect(mockTransformFormDataToItem).toHaveBeenCalledWith(mockFormData);
    expect(postRequest).toHaveBeenCalledWith('/api/test-items', { id: 123, name: 'Test Item' });
    expect(mockFetchItems).toHaveBeenCalled();
    expect(mockSetEditingFormData).toHaveBeenCalledWith({});
    expect(mockSetMessage).toHaveBeenCalledWith({ 
      type: 'INFO', 
      text: 'Test Item created successfully.' 
    });
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  it('handles successful form submission for editing item', async () => {
    const mockFormData = new FormData();
    mockFormData.append('test-item-name', 'Test Item');
    mockFormData.append('test-item-id', '123');
    
    const mockArgs = {
      formData: mockFormData,
      transformFormDataToItem: mockTransformFormDataToItem,
      setIsSubmitting: mockSetIsSubmitting,
      setMessage: mockSetMessage,
      fetchItems: mockFetchItems,
      setEditingFormData: mockSetEditingFormData,
      itemName: 'Test Item',
      itemEndpoint: '/api/test-items'
    };
    
    await handleFormSubmit(mockArgs);
    
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(true);
    expect(mockSetMessage).toHaveBeenCalledWith({ type: null, text: '' });
    expect(mockTransformFormDataToItem).toHaveBeenCalledWith(mockFormData);
    expect(putRequest).toHaveBeenCalledWith('/api/test-items', '123', { id: 123, name: 'Test Item' });
    expect(mockFetchItems).toHaveBeenCalled();
    expect(mockSetEditingFormData).toHaveBeenCalledWith({});
    expect(mockSetMessage).toHaveBeenCalledWith({ 
      type: 'INFO', 
      text: 'Test Item updated successfully.' 
    });
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  it('handles validation errors', async () => {
    const mockFormData = new FormData();
    mockFormData.append('test-item-name', 'Test Item');
    
    const mockArgs = {
      formData: mockFormData,
      transformFormDataToItem: mockTransformFormDataToItem,
      setIsSubmitting: mockSetIsSubmitting,
      setMessage: mockSetMessage,
      fetchItems: mockFetchItems,
      setEditingFormData: mockSetEditingFormData,
      itemName: 'Test Item',
      itemEndpoint: '/api/test-items'
    };
    
    mockTransformFormDataToItem.mockReturnValue({ 
      item: null, 
      errors: ['Name is required', 'Invalid format'] 
    });
    
    await handleFormSubmit(mockArgs);
    
    expect(mockSetMessage).toHaveBeenCalledWith({ 
      type: 'ERROR', 
      text: 'Name is required, Invalid format' 
    });
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  it('handles API errors', async () => {
    const mockFormData = new FormData();
    mockFormData.append('test-item-name', 'Test Item');
    
    const mockArgs = {
      formData: mockFormData,
      transformFormDataToItem: mockTransformFormDataToItem,
      setIsSubmitting: mockSetIsSubmitting,
      setMessage: mockSetMessage,
      fetchItems: mockFetchItems,
      setEditingFormData: mockSetEditingFormData,
      itemName: 'Test Item',
      itemEndpoint: '/api/test-items'
    };
    
    (postRequest as jest.Mock).mockResolvedValue({ 
      successful: false, 
      responseMessage: 'Server error' 
    });
    
    await handleFormSubmit(mockArgs);
    
    expect(mockSetMessage).toHaveBeenCalledWith({ 
      type: 'ERROR', 
      text: 'Failed to create test item: Server error' 
    });
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });

  it('handles unexpected errors', async () => {
    const mockFormData = new FormData();
    mockFormData.append('test-item-name', 'Test Item');
    
    const mockArgs = {
      formData: mockFormData,
      transformFormDataToItem: mockTransformFormDataToItem,
      setIsSubmitting: mockSetIsSubmitting,
      setMessage: mockSetMessage,
      fetchItems: mockFetchItems,
      setEditingFormData: mockSetEditingFormData,
      itemName: 'Test Item',
      itemEndpoint: '/api/test-items'
    };
    
    mockTransformFormDataToItem.mockImplementation(() => {
      throw new Error('Unexpected error');
    });
    
    await handleFormSubmit(mockArgs);
    
    expect(mockSetMessage).toHaveBeenCalledWith({ 
      type: 'ERROR', 
      text: 'An unexpected error occurred. Please try again.' 
    });
    expect(mockSetIsSubmitting).toHaveBeenCalledWith(false);
  });
}); 