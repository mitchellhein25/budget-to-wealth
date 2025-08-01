import { getImportTemplateData } from '../getImportTemplateData';
import { ImportDataTypeStringMappings } from '../../models/ImportDataTypeStringMappings';
import { ImportDataTypeStrings } from '../../models/ImportDataTypeStrings';

interface MockTemplateData {
  headers: string[];
  sampleData: string[][];
  description: string;
}

describe('getImportTemplateData', () => {
  it('returns correct template data for CashFlowEntries', () => {
    const templateData = getImportTemplateData(ImportDataTypeStringMappings.CashFlowEntries);
    
    expect(templateData).toBeDefined();
    expect(templateData).toHaveProperty('headers');
    expect(templateData).toHaveProperty('sampleData');
    expect(templateData).toHaveProperty('description');
    
    const mockTemplate = templateData as MockTemplateData;
    expect(Array.isArray(mockTemplate.headers)).toBe(true);
    expect(Array.isArray(mockTemplate.sampleData)).toBe(true);
    expect(typeof mockTemplate.description).toBe('string');
  });

  it('returns correct template data for Budgets', () => {
    const templateData = getImportTemplateData(ImportDataTypeStringMappings.Budgets);
    
    expect(templateData).toBeDefined();
    expect(templateData).toHaveProperty('headers');
    expect(templateData).toHaveProperty('sampleData');
    expect(templateData).toHaveProperty('description');
    
    const mockTemplate = templateData as MockTemplateData;
    expect(Array.isArray(mockTemplate.headers)).toBe(true);
    expect(Array.isArray(mockTemplate.sampleData)).toBe(true);
    expect(typeof mockTemplate.description).toBe('string');
  });

  it('returns correct template data for CashFlowCategories', () => {
    const templateData = getImportTemplateData(ImportDataTypeStringMappings.CashFlowCategories);
    
    expect(templateData).toBeDefined();
    expect(templateData).toHaveProperty('headers');
    expect(templateData).toHaveProperty('sampleData');
    expect(templateData).toHaveProperty('description');
    
    const mockTemplate = templateData as MockTemplateData;
    expect(Array.isArray(mockTemplate.headers)).toBe(true);
    expect(Array.isArray(mockTemplate.sampleData)).toBe(true);
    expect(typeof mockTemplate.description).toBe('string');
  });

  it('returns correct template data for Holdings', () => {
    const templateData = getImportTemplateData(ImportDataTypeStringMappings.Holdings);
    
    expect(templateData).toBeDefined();
    expect(templateData).toHaveProperty('headers');
    expect(templateData).toHaveProperty('sampleData');
    expect(templateData).toHaveProperty('description');
    
    const mockTemplate = templateData as MockTemplateData;
    expect(Array.isArray(mockTemplate.headers)).toBe(true);
    expect(Array.isArray(mockTemplate.sampleData)).toBe(true);
    expect(typeof mockTemplate.description).toBe('string');
  });

  it('returns correct template data for HoldingCategories', () => {
    const templateData = getImportTemplateData(ImportDataTypeStringMappings.HoldingCategories);
    
    expect(templateData).toBeDefined();
    expect(templateData).toHaveProperty('headers');
    expect(templateData).toHaveProperty('sampleData');
    expect(templateData).toHaveProperty('description');
    
    const mockTemplate = templateData as MockTemplateData;
    expect(Array.isArray(mockTemplate.headers)).toBe(true);
    expect(Array.isArray(mockTemplate.sampleData)).toBe(true);
    expect(typeof mockTemplate.description).toBe('string');
  });

  it('returns correct template data for HoldingSnapshots', () => {
    const templateData = getImportTemplateData(ImportDataTypeStringMappings.HoldingSnapshots);
    
    expect(templateData).toBeDefined();
    expect(templateData).toHaveProperty('headers');
    expect(templateData).toHaveProperty('sampleData');
    expect(templateData).toHaveProperty('description');
    
    const mockTemplate = templateData as MockTemplateData;
    expect(Array.isArray(mockTemplate.headers)).toBe(true);
    expect(Array.isArray(mockTemplate.sampleData)).toBe(true);
    expect(typeof mockTemplate.description).toBe('string');
  });

  it('handles unknown data type', () => {
    const templateData = getImportTemplateData('UnknownType' as ImportDataTypeStrings);
    
    expect(templateData).toBeDefined();
    expect(templateData).toHaveProperty('headers');
    expect(templateData).toHaveProperty('sampleData');
    expect(templateData).toHaveProperty('description');
    
    const mockTemplate = templateData as MockTemplateData;
    expect(Array.isArray(mockTemplate.headers)).toBe(true);
    expect(Array.isArray(mockTemplate.sampleData)).toBe(true);
    expect(mockTemplate.headers).toHaveLength(0);
    expect(mockTemplate.sampleData).toHaveLength(0);
  });

  it('returns template data with correct structure', () => {
    const templateData = getImportTemplateData(ImportDataTypeStringMappings.CashFlowEntries);
    
    const mockTemplate = templateData as MockTemplateData;
    
    expect(mockTemplate.headers.length).toBeGreaterThan(0);
    expect(mockTemplate.sampleData.length).toBeGreaterThan(0);
    
    mockTemplate.headers.forEach(header => {
      expect(typeof header).toBe('string');
    });
    
    mockTemplate.sampleData.forEach(row => {
      expect(Array.isArray(row)).toBe(true);
      expect(row.length).toBeGreaterThan(0);
    });
  });
}); 