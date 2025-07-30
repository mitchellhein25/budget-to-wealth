import { getFieldsForImportType, ImportField } from '../getFieldsForImportType';

describe('getFieldsForImportType', () => {
  it('returns correct fields for CashFlow Entries', () => {
    const fields = getFieldsForImportType('CashFlow Entries');
    
    expect(fields).toHaveLength(6);
    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'amount', type: 'number', required: true }),
        expect.objectContaining({ name: 'categoryName', type: 'string', required: true }),
        expect.objectContaining({ name: 'categoryType', type: 'string', required: true }),
        expect.objectContaining({ name: 'date', type: 'string', required: true }),
        expect.objectContaining({ name: 'description', type: 'string', required: false }),
        expect.objectContaining({ name: 'recurrenceFrequency', type: 'string', required: false })
      ])
    );
  });

  it('returns correct fields for Budgets', () => {
    const fields = getFieldsForImportType('Budgets');
    
    expect(fields).toHaveLength(2);
    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'amount', type: 'number', required: true }),
        expect.objectContaining({ name: 'categoryName', type: 'string', required: true })
      ])
    );
  });

  it('returns correct fields for Holding Snapshots', () => {
    const fields = getFieldsForImportType('Holding Snapshots');
    
    expect(fields).toHaveLength(6);
    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'balance', type: 'number', required: true }),
        expect.objectContaining({ name: 'holdingName', type: 'string', required: true }),
        expect.objectContaining({ name: 'holdingCategoryName', type: 'string', required: true }),
        expect.objectContaining({ name: 'holdingType', type: 'string', required: true }),
        expect.objectContaining({ name: 'date', type: 'string', required: true }),
        expect.objectContaining({ name: 'holdingInstitution', type: 'string', required: false })
      ])
    );
  });

  it('returns correct fields for Holdings', () => {
    const fields = getFieldsForImportType('Holdings');
    
    expect(fields).toHaveLength(4);
    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'name', type: 'string', required: true }),
        expect.objectContaining({ name: 'type', type: 'string', required: true }),
        expect.objectContaining({ name: 'holdingCategoryName', type: 'string', required: true }),
        expect.objectContaining({ name: 'institution', type: 'string', required: false })
      ])
    );
  });

  it('returns correct fields for CashFlow Categories', () => {
    const fields = getFieldsForImportType('CashFlow Categories');
    
    expect(fields).toHaveLength(2);
    expect(fields).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'name', type: 'string', required: true }),
        expect.objectContaining({ name: 'categoryType', type: 'string', required: true })
      ])
    );
  });

  it('returns correct fields for Holding Categories', () => {
    const fields = getFieldsForImportType('Holding Categories');
    
    expect(fields).toHaveLength(1);
    expect(fields).toEqual([
      expect.objectContaining({ name: 'name', type: 'string', required: true })
    ]);
  });

  it('returns empty array for unknown data type', () => {
    const fields = getFieldsForImportType('Unknown Type');
    
    expect(fields).toEqual([]);
  });

  it('returns empty array for empty string', () => {
    const fields = getFieldsForImportType('');
    
    expect(fields).toEqual([]);
  });

  it('returns empty array for null/undefined', () => {
    const fields = getFieldsForImportType(null as any);
    
    expect(fields).toEqual([]);
  });

  it('returns fields with correct structure for all valid types', () => {
    const validTypes = [
      'CashFlow Entries',
      'Budgets', 
      'Holding Snapshots',
      'Holdings',
      'CashFlow Categories',
      'Holding Categories'
    ];

    validTypes.forEach(dataType => {
      const fields = getFieldsForImportType(dataType);
      
      expect(fields).toBeInstanceOf(Array);
      expect(fields.length).toBeGreaterThan(0);
      
      fields.forEach(field => {
        expect(field).toHaveProperty('name');
        expect(field).toHaveProperty('type');
        expect(field).toHaveProperty('required');
        expect(typeof field.name).toBe('string');
        expect(typeof field.type).toBe('string');
        expect(typeof field.required).toBe('boolean');
      });
    });
  });

  it('distinguishes between required and optional fields', () => {
    const cashFlowFields = getFieldsForImportType('CashFlow Entries');
    const requiredFields = cashFlowFields.filter(field => field.required);
    const optionalFields = cashFlowFields.filter(field => !field.required);
    
    expect(requiredFields.length).toBeGreaterThan(0);
    expect(optionalFields.length).toBeGreaterThan(0);
    expect(requiredFields.length + optionalFields.length).toBe(cashFlowFields.length);
  });

  it('handles case sensitivity correctly', () => {
    const exactMatch = getFieldsForImportType('CashFlow Entries');
    const lowercase = getFieldsForImportType('cashflow entries');
    const uppercase = getFieldsForImportType('CASHFLOW ENTRIES');
    
    expect(exactMatch).toHaveLength(6);
    expect(lowercase).toEqual([]);
    expect(uppercase).toEqual([]);
  });
}); 