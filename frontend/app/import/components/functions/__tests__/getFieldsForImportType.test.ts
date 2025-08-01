import { getFieldsForImportType } from '../getFieldsForImportType';

interface MockField {
  name: string;
  type: string;
  required: boolean;
}

describe('getFieldsForImportType', () => {
  it('returns correct fields for CashFlowEntries', () => {
    const fields = getFieldsForImportType('CashFlow Entries');
    
    expect(fields).toBeDefined();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBeGreaterThan(0);
  });

  it('returns correct fields for Budgets', () => {
    const fields = getFieldsForImportType('Budgets');
    
    expect(fields).toBeDefined();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBeGreaterThan(0);
  });

  it('returns correct fields for CashFlowCategories', () => {
    const fields = getFieldsForImportType('CashFlow Categories');
    
    expect(fields).toBeDefined();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBeGreaterThan(0);
  });

  it('returns correct fields for Holdings', () => {
    const fields = getFieldsForImportType('Holdings');
    
    expect(fields).toBeDefined();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBeGreaterThan(0);
  });

  it('returns correct fields for HoldingCategories', () => {
    const fields = getFieldsForImportType('Holding Categories');
    
    expect(fields).toBeDefined();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBeGreaterThan(0);
  });

  it('returns correct fields for HoldingSnapshots', () => {
    const fields = getFieldsForImportType('Holding Snapshots');
    
    expect(fields).toBeDefined();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields.length).toBeGreaterThan(0);
  });

  it('returns fields with correct structure', () => {
    const fields = getFieldsForImportType('CashFlow Entries');
    
    fields.forEach((field: MockField) => {
      expect(field).toHaveProperty('name');
      expect(field).toHaveProperty('type');
      expect(field).toHaveProperty('required');
      expect(typeof field.name).toBe('string');
      expect(typeof field.type).toBe('string');
      expect(typeof field.required).toBe('boolean');
    });
  });

  it('returns empty array for unknown data type', () => {
    const fields = getFieldsForImportType('UnknownType');
    
    expect(fields).toBeDefined();
    expect(Array.isArray(fields)).toBe(true);
    expect(fields).toHaveLength(0);
  });
}); 