import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, getHoldingInvestmentReturnValidationResult } from '@/app/net-worth/investment-returns';

const FORM_ID = HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID;

describe('getHoldingInvestmentReturnValidationResult', () => {
  it('should return success with valid form data', () => {
    const formData = new FormData();
    formData.set(`${FORM_ID}-id`, '123e4567-e89b-12d3-a456-426614174000');
    formData.set(`${FORM_ID}-startHoldingSnapshotDate`, '2024-01-01');
    formData.set(`${FORM_ID}-startHoldingSnapshotId`, 'start-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotId`, 'end-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotHoldingId`, 'holding-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotDate`, '2024-12-31');
    formData.set(`${FORM_ID}-endHoldingSnapshotBalance`, '1000.00');
    formData.set(`${FORM_ID}-totalContributions`, '500.00');
    formData.set(`${FORM_ID}-totalWithdrawals`, '100.00');

    const result = getHoldingInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(result.data.startHoldingSnapshotId).toBe('start-snapshot-id');
      expect(result.data.endHoldingSnapshotId).toBe('end-snapshot-id');
      expect(result.data.endHoldingSnapshotHoldingId).toBe('holding-id');
      expect(result.data.endHoldingSnapshotBalance).toBe('1000.00');
      expect(result.data.totalContributions).toBe('500.00');
      expect(result.data.totalWithdrawals).toBe('100.00');
    }
  });

  it('should return success with minimal required data', () => {
    const formData = new FormData();
    formData.set(`${FORM_ID}-startHoldingSnapshotDate`, '2024-01-01');
    formData.set(`${FORM_ID}-startHoldingSnapshotId`, 'start-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotId`, 'end-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotHoldingId`, 'holding-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotDate`, '2024-12-31');
    formData.set(`${FORM_ID}-endHoldingSnapshotBalance`, '1000.00');

    const result = getHoldingInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalContributions).toBe('0');
      expect(result.data.totalWithdrawals).toBe('0');
    }
  });

  it('should return failure when required fields are missing', () => {
    const formData = new FormData();
    formData.set(`${FORM_ID}-startHoldingSnapshotDate`, '2024-01-01');
    formData.set(`${FORM_ID}-startHoldingSnapshotId`, 'start-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotId`, 'end-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotDate`, '2024-12-31');
    formData.set(`${FORM_ID}-endHoldingSnapshotBalance`, '1000.00');

    const result = getHoldingInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors).toHaveLength(1);
      expect(result.error.errors[0].message).toBe('End Holding Snapshot Holding field is required');
    }
  });

  it('should return failure when dates are invalid', () => {
    const formData = new FormData();
    formData.set(`${FORM_ID}-startHoldingSnapshotDate`, 'invalid-date');
    formData.set(`${FORM_ID}-startHoldingSnapshotId`, 'start-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotId`, 'end-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotHoldingId`, 'holding-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotDate`, '2024-12-31');
    formData.set(`${FORM_ID}-endHoldingSnapshotBalance`, '1000.00');

    const result = getHoldingInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors).toHaveLength(1);
      expect(result.error.errors[0].message).toBe('Invalid date');
    }
  });

  it('should handle empty string values as undefined for optional fields', () => {
    const formData = new FormData();
    formData.set(`${FORM_ID}-startHoldingSnapshotDate`, '2024-01-01');
    formData.set(`${FORM_ID}-startHoldingSnapshotId`, 'start-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotId`, 'end-snapshot-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotHoldingId`, 'holding-id');
    formData.set(`${FORM_ID}-endHoldingSnapshotDate`, '2024-12-31');
    formData.set(`${FORM_ID}-endHoldingSnapshotBalance`, '1000.00');
    formData.set(`${FORM_ID}-totalContributions`, '');
    formData.set(`${FORM_ID}-totalWithdrawals`, '');

    const result = getHoldingInvestmentReturnValidationResult(formData);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.totalContributions).toBe('0');
      expect(result.data.totalWithdrawals).toBe('0');
    }
  });
});
