import { holdingSnapshotFormOnChange } from '../holdingSnapshotFormOnChange';
import { HoldingSnapshotFormData } from '../../HoldingSnapshotFormData';

// Mock the Utils module
jest.mock('@/app/components/Utils', () => ({
  cleanCurrencyInput: jest.fn()
}));

describe('holdingSnapshotFormOnChange', () => {
  const mockSetEditingFormData = jest.fn();
  const mockCleanCurrencyInput = require('@/app/components/Utils').cleanCurrencyInput as jest.MockedFunction<any>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('updates non-balance fields correctly', () => {
    const event = {
      target: {
        name: 'holding-snapshot-holdingId',
        value: 'new-holding-id'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    const prevData: Partial<HoldingSnapshotFormData> = {
      holdingId: 'old-holding-id',
      date: new Date('2024-01-15'),
      balance: '1000.50'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData).toEqual({
        holdingId: 'new-holding-id',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      });
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('updates date field correctly', () => {
    const event = {
      target: {
        name: 'holding-snapshot-date',
        value: '2024-02-15'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    const prevData: Partial<HoldingSnapshotFormData> = {
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: '1000.50'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData.date).toBe('2024-02-15');
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('updates id field correctly', () => {
    const event = {
      target: {
        name: 'holding-snapshot-id',
        value: 'new-snapshot-id'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    const prevData: Partial<HoldingSnapshotFormData> = {
      id: 'old-snapshot-id',
      holdingId: 'holding-1',
      balance: '1000.50'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData.id).toBe('new-snapshot-id');
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('cleans balance field value before updating', () => {
    const event = {
      target: {
        name: 'holding-snapshot-balance',
        value: '$1,000.50'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    mockCleanCurrencyInput.mockReturnValue('1000.50');

    const prevData: Partial<HoldingSnapshotFormData> = {
      holdingId: 'holding-1',
      balance: '500.00'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData.balance).toBe('1000.50');
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('$1,000.50');
    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('does not update state when balance cleaning returns null', () => {
    const event = {
      target: {
        name: 'holding-snapshot-balance',
        value: 'invalid-balance'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    mockCleanCurrencyInput.mockReturnValue(null);

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('invalid-balance');
    expect(mockSetEditingFormData).not.toHaveBeenCalled();
  });

  it('handles balance field with empty string', () => {
    const event = {
      target: {
        name: 'holding-snapshot-balance',
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>;

    mockCleanCurrencyInput.mockReturnValue('');

    const prevData: Partial<HoldingSnapshotFormData> = {
      holdingId: 'holding-1',
      balance: '1000.50'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData.balance).toBe('');
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('');
    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('handles balance field with zero value', () => {
    const event = {
      target: {
        name: 'holding-snapshot-balance',
        value: '0'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    mockCleanCurrencyInput.mockReturnValue('0');

    const prevData: Partial<HoldingSnapshotFormData> = {
      holdingId: 'holding-1',
      balance: '1000.50'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData.balance).toBe('0');
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('0');
    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('handles balance field with decimal values', () => {
    const event = {
      target: {
        name: 'holding-snapshot-balance',
        value: '1234.56'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    mockCleanCurrencyInput.mockReturnValue('1234.56');

    const prevData: Partial<HoldingSnapshotFormData> = {
      holdingId: 'holding-1',
      balance: '1000.50'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData.balance).toBe('1234.56');
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockCleanCurrencyInput).toHaveBeenCalledWith('1234.56');
    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('preserves other fields when updating a single field', () => {
    const event = {
      target: {
        name: 'holding-snapshot-holdingId',
        value: 'new-holding-id'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    const prevData: Partial<HoldingSnapshotFormData> = {
      id: 'snapshot-123',
      holdingId: 'old-holding-id',
      date: new Date('2024-01-15'),
      balance: '1000.50'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData).toEqual({
        id: 'snapshot-123',
        holdingId: 'new-holding-id',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      });
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('handles field names with different prefixes', () => {
    const event = {
      target: {
        name: 'holding-snapshot-customField',
        value: 'custom-value'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    const prevData: Partial<HoldingSnapshotFormData> = {
      holdingId: 'holding-1'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData.customField).toBe('custom-value');
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('handles empty field values', () => {
    const event = {
      target: {
        name: 'holding-snapshot-holdingId',
        value: ''
      }
    } as React.ChangeEvent<HTMLInputElement>;

    const prevData: Partial<HoldingSnapshotFormData> = {
      holdingId: 'old-holding-id',
      balance: '1000.50'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData.holdingId).toBe('');
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalled();
  });

  it('handles special characters in field values', () => {
    const event = {
      target: {
        name: 'holding-snapshot-holdingId',
        value: 'holding-with-special-chars!@#'
      }
    } as React.ChangeEvent<HTMLInputElement>;

    const prevData: Partial<HoldingSnapshotFormData> = {
      holdingId: 'old-holding-id'
    };

    mockSetEditingFormData.mockImplementation((updater) => {
      const newData = updater(prevData);
      expect(newData.holdingId).toBe('holding-with-special-chars!@#');
    });

    holdingSnapshotFormOnChange(event, mockSetEditingFormData);

    expect(mockSetEditingFormData).toHaveBeenCalled();
  });
}); 