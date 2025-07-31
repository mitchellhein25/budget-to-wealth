import { getHoldingSnapshotValidationResult } from '../getHoldingSnapshotValidationResult';

describe('getHoldingSnapshotValidationResult', () => {
  it('validates correct form data successfully', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-id', '123e4567-e89b-12d3-a456-426614174000');
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        holdingId: 'holding-1',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      });
    }
  });

  it('validates form data without optional id', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        id: undefined,
        holdingId: 'holding-1',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      });
    }
  });

  it('validates balance with commas and spaces', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1,000.50');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.balance).toBe('1000.50');
    }
  });

  it('rejects missing required fields', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('rejects invalid currency format', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', 'invalid');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('rejects balance of zero', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '0.00');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('accepts valid decimal balances', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1234.56');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.balance).toBe('1234.56');
    }
  });

  it('accepts whole number balances', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.balance).toBe('1000');
    }
  });

  it('rejects invalid UUID format for id', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-id', 'invalid-uuid');
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('accepts valid UUID format for id', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-id', '123e4567-e89b-12d3-a456-426614174000');
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '1000.50');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    }
  });

  it('handles empty string values appropriately', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', '');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('handles missing form data fields', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-date', '2024-01-15');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('handles invalid date format', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', 'invalid-date');
    formData.append('holding-snapshot-balance', '1000.50');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('handles negative balance values', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '-1000.50');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(false);
  });

  it('handles very large balance values', () => {
    const formData = new FormData();
    formData.append('holding-snapshot-holdingId', 'holding-1');
    formData.append('holding-snapshot-date', '2024-01-15');
    formData.append('holding-snapshot-balance', '999999999.99');

    const result = getHoldingSnapshotValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.balance).toBe('999999999.99');
    }
  });
}); 