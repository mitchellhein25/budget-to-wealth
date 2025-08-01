import { handleFormSubmit } from './handleFormSubmit';

interface MockEvent {
  preventDefault: jest.Mock;
}

describe('handleFormSubmit', () => {
  const mockEvent: MockEvent = {
    preventDefault: jest.fn(),
  };

  const mockFormState = {
    isSubmitting: false,
    message: { type: null, text: '' },
  };

  const mockSubmitFunction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('prevents default form submission', () => {
    handleFormSubmit(mockEvent, mockFormState, mockSubmitFunction);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('calls submit function when not already submitting', () => {
    handleFormSubmit(mockEvent, mockFormState, mockSubmitFunction);
    expect(mockSubmitFunction).toHaveBeenCalled();
  });

  it('does not call submit function when already submitting', () => {
    const submittingFormState = {
      ...mockFormState,
      isSubmitting: true,
    };
    
    handleFormSubmit(mockEvent, submittingFormState, mockSubmitFunction);
    expect(mockSubmitFunction).not.toHaveBeenCalled();
  });

  it('handles submit function that returns a promise', async () => {
    const asyncSubmitFunction = jest.fn().mockResolvedValue(undefined);
    
    await handleFormSubmit(mockEvent, mockFormState, asyncSubmitFunction);
    
    expect(asyncSubmitFunction).toHaveBeenCalled();
  });

  it('handles submit function that throws an error', async () => {
    const errorSubmitFunction = jest.fn().mockRejectedValue(new Error('Submit failed'));
    
    await expect(handleFormSubmit(mockEvent, mockFormState, errorSubmitFunction))
      .rejects.toThrow('Submit failed');
  });
}); 