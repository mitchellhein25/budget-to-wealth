import { getImportTemplateData } from '../getImportTemplateData';
import { ImportDataTypeStringMappings } from '../../models/ImportDataTypeStringMappings';

describe('getImportTemplateData', () => {
  it('returns correct template for CashFlow Entries', () => {
    const template = getImportTemplateData(ImportDataTypeStringMappings.CashFlowEntries);
    
    expect(template).toHaveProperty('headers');
    expect(template).toHaveProperty('sampleData');
    expect(template).toHaveProperty('description');
    
    expect(template.headers).toContain('amount');
    expect(template.headers).toContain('categoryName');
    expect(template.headers).toContain('categoryType');
    expect(template.headers).toContain('date');
    expect(template.headers).toContain('description');
    expect(template.headers).toContain('recurrenceFrequency');
    
    expect(template.sampleData).toHaveLength(3);
    expect(template.sampleData[0]).toHaveLength(6);
    expect(template.description).toContain('cash flow entries');
  });

  it('returns correct template for Budgets', () => {
    const template = getImportTemplateData(ImportDataTypeStringMappings.Budgets);
    
    expect(template.headers).toHaveLength(2);
    expect(template.headers).toContain('amount');
    expect(template.headers).toContain('categoryName');
    
    expect(template.sampleData).toHaveLength(3);
    expect(template.sampleData[0]).toHaveLength(2);
    expect(template.description).toContain('budgets');
  });

  it('returns correct template for Holding Snapshots', () => {
    const template = getImportTemplateData(ImportDataTypeStringMappings.HoldingSnapshots);
    
    expect(template.headers).toHaveLength(6);
    expect(template.headers).toContain('balance');
    expect(template.headers).toContain('holdingName');
    expect(template.headers).toContain('holdingCategoryName');
    expect(template.headers).toContain('holdingType');
    expect(template.headers).toContain('date');
    expect(template.headers).toContain('holdingInstitution');
    
    expect(template.sampleData).toHaveLength(3);
    expect(template.sampleData[0]).toHaveLength(6);
    expect(template.description).toContain('holding snapshots');
  });

  it('returns correct template for Holdings', () => {
    const template = getImportTemplateData(ImportDataTypeStringMappings.Holdings);
    
    expect(template.headers).toHaveLength(4);
    expect(template.headers).toContain('name');
    expect(template.headers).toContain('type');
    expect(template.headers).toContain('holdingCategoryName');
    expect(template.headers).toContain('institution');
    
    expect(template.sampleData).toHaveLength(6);
    expect(template.sampleData[0]).toHaveLength(4);
    expect(template.description).toContain('holdings');
  });

  it('returns correct template for CashFlow Categories', () => {
    const template = getImportTemplateData(ImportDataTypeStringMappings.CashFlowCategories);
    
    expect(template.headers).toHaveLength(2);
    expect(template.headers).toContain('name');
    expect(template.headers).toContain('categoryType');
    
    expect(template.sampleData).toHaveLength(4);
    expect(template.sampleData[0]).toHaveLength(2);
    expect(template.description).toContain('cash flow categories');
  });

  it('returns correct template for Holding Categories', () => {
    const template = getImportTemplateData(ImportDataTypeStringMappings.HoldingCategories);
    
    expect(template.headers).toHaveLength(1);
    expect(template.headers).toContain('name');
    
    expect(template.sampleData).toHaveLength(4);
    expect(template.sampleData[0]).toHaveLength(1);
    expect(template.description).toContain('holding categories');
  });

  it('returns empty template for unknown data type', () => {
    const template = getImportTemplateData('Unknown Type' as any);
    
    expect(template).toEqual({
      headers: [],
      sampleData: [],
      description: ''
    });
  });

  it('returns template with correct structure for all valid types', () => {
    const validTypes = [
      ImportDataTypeStringMappings.CashFlowEntries,
      ImportDataTypeStringMappings.Budgets,
      ImportDataTypeStringMappings.HoldingSnapshots,
      ImportDataTypeStringMappings.Holdings,
      ImportDataTypeStringMappings.CashFlowCategories,
      ImportDataTypeStringMappings.HoldingCategories
    ];

    validTypes.forEach(dataType => {
      const template = getImportTemplateData(dataType);
      
      expect(template).toHaveProperty('headers');
      expect(template).toHaveProperty('sampleData');
      expect(template).toHaveProperty('description');
      
      expect(Array.isArray(template.headers)).toBe(true);
      expect(Array.isArray(template.sampleData)).toBe(true);
      expect(typeof template.description).toBe('string');
      
      expect(template.headers.length).toBeGreaterThan(0);
      expect(template.sampleData.length).toBeGreaterThan(0);
      expect(template.description.length).toBeGreaterThan(0);
    });
  });

  it('ensures headers match sample data structure', () => {
    const template = getImportTemplateData(ImportDataTypeStringMappings.CashFlowEntries);
    
    expect(template.headers.length).toBe(6);
    expect(template.sampleData[0].length).toBe(6);
    expect(template.sampleData[1].length).toBe(6);
    expect(template.sampleData[2].length).toBe(6);
  });

  it('provides meaningful sample data', () => {
    const template = getImportTemplateData(ImportDataTypeStringMappings.CashFlowEntries);
    
    template.sampleData.forEach(row => {
      expect(row.length).toBeGreaterThan(0);
      row.forEach(cell => {
        expect(typeof cell).toBe('string');
        expect(cell.length).toBeGreaterThan(0);
      });
    });
  });

  it('provides descriptive text for each template', () => {
    const cashFlowTemplate = getImportTemplateData(ImportDataTypeStringMappings.CashFlowEntries);
    const budgetTemplate = getImportTemplateData(ImportDataTypeStringMappings.Budgets);
    const holdingTemplate = getImportTemplateData(ImportDataTypeStringMappings.Holdings);
    
    expect(cashFlowTemplate.description).toContain('cash flow entries');
    expect(budgetTemplate.description).toContain('budgets');
    expect(holdingTemplate.description).toContain('holdings');
  });

  it('handles different data types with appropriate field counts', () => {
    const cashFlowTemplate = getImportTemplateData(ImportDataTypeStringMappings.CashFlowEntries);
    const budgetTemplate = getImportTemplateData(ImportDataTypeStringMappings.Budgets);
    const holdingCategoryTemplate = getImportTemplateData(ImportDataTypeStringMappings.HoldingCategories);
    
    expect(cashFlowTemplate.headers.length).toBe(6);
    expect(budgetTemplate.headers.length).toBe(2);
    expect(holdingCategoryTemplate.headers.length).toBe(1);
  });
}); 