import { HoldingSnapshotFormSchema } from '@/app/net-worth/holding-snapshots';

describe('HoldingSnapshotFormSchema', () => {
  it('validates correct form data successfully', () => {
    const validData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: '1000.50'
    };

    const result = HoldingSnapshotFormSchema.safeParse(validData);

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
    const validData = {
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: '1000.50'
    };

    const result = HoldingSnapshotFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({
        holdingId: 'holding-1',
        date: new Date('2024-01-15'),
        balance: '1000.50'
      });
    }
  });

  it('validates balance with commas and spaces', () => {
    const validData = {
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: '1,000.50'
    };

    const result = HoldingSnapshotFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.balance).toBe('1000.50');
    }
  });

  it('rejects missing required fields', () => {
    const invalidData = {
      date: new Date('2024-01-15'),
      balance: '1000.50'
    };

    const result = HoldingSnapshotFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('rejects invalid currency format', () => {
    const invalidData = {
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: 'invalid'
    };

    const result = HoldingSnapshotFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('rejects balance of zero', () => {
    const invalidData = {
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: '0'
    };

    const result = HoldingSnapshotFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('accepts valid decimal balances', () => {
    const validData = {
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: '100.50'
    };

    const result = HoldingSnapshotFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.balance).toBe('100.50');
    }
  });

  it('accepts whole number balances', () => {
    const validData = {
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: '1000'
    };

    const result = HoldingSnapshotFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.balance).toBe('1000');
    }
  });

  it('rejects invalid UUID format for id', () => {
    const invalidData = {
      id: 'invalid-uuid',
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: '1000.50'
    };

    const result = HoldingSnapshotFormSchema.safeParse(invalidData);

    expect(result.success).toBe(false);
  });

  it('accepts valid UUID format for id', () => {
    const validData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      holdingId: 'holding-1',
      date: new Date('2024-01-15'),
      balance: '1000.50'
    };

    const result = HoldingSnapshotFormSchema.safeParse(validData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
    }
  });
});
