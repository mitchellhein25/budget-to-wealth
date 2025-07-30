import { parseCsvFile } from '../parseCsvFile';

describe('parseCsvFile', () => {
  it('parses simple CSV with headers and data', async () => {
    const csvContent = 'name,age,city\nJohn,25,New York\nJane,30,Los Angeles';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ name: string; age: number; city: string }>(file);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'John', age: 25, city: 'New York' });
    expect(result[1]).toEqual({ name: 'Jane', age: 30, city: 'Los Angeles' });
  });

  it('handles numeric values correctly', async () => {
    const csvContent = 'amount,price,quantity\n100.50,25.99,3\n200.00,10.50,5';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ amount: number; price: number; quantity: number }>(file);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ amount: 100.50, price: 25.99, quantity: 3 });
    expect(result[1]).toEqual({ amount: 200.00, price: 10.50, quantity: 5 });
  });

  it('handles boolean values correctly', async () => {
    const csvContent = 'name,active,verified\nJohn,true,false\nJane,false,true';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ name: string; active: boolean; verified: boolean }>(file);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'John', active: true, verified: false });
    expect(result[1]).toEqual({ name: 'Jane', active: false, verified: true });
  });

  it('handles quoted values with commas', async () => {
    const csvContent = 'name,description,location\nJohn,"Software Engineer, Senior",New York\nJane,"Manager, Product",Los Angeles';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ name: string; description: string; location: string }>(file);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'John', description: 'Software Engineer, Senior', location: 'New York' });
    expect(result[1]).toEqual({ name: 'Jane', description: 'Manager, Product', location: 'Los Angeles' });
  });

  it('handles escaped quotes in quoted values', async () => {
    const csvContent = 'name,description\nJohn,"He said ""Hello"" to me"\nJane,"She replied ""Goodbye"""';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ name: string; description: string }>(file);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ name: 'John', description: 'He said "Hello" to me' });
    expect(result[1]).toEqual({ name: 'Jane', description: 'She replied "Goodbye"' });
  });

  it('handles empty values and whitespace', async () => {
    const csvContent = 'name,age,city\nJohn,25,\nJane,,Los Angeles\nBob,30,  Chicago  ';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ name: string; age: number; city: string }>(file);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: 'John', age: 25, city: '' });
    expect(result[1]).toEqual({ name: 'Jane', age: '', city: 'Los Angeles' });
    expect(result[2]).toEqual({ name: 'Bob', age: 30, city: 'Chicago' });
  });

  it('throws error for file with only header row', async () => {
    const csvContent = 'name,age,city';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    await expect(parseCsvFile(file)).rejects.toThrow('File must contain at least a header row and one data row');
  });

  it('throws error for empty file', async () => {
    const file = new File([''], 'test.csv', { type: 'text/csv' });
    
    await expect(parseCsvFile(file)).rejects.toThrow('File must contain at least a header row and one data row');
  });

  it('throws error for file with only empty lines', async () => {
    const csvContent = '\n\n\n';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    await expect(parseCsvFile(file)).rejects.toThrow('File must contain at least a header row and one data row');
  });

  it('handles mixed data types correctly', async () => {
    const csvContent = 'name,age,active,score,description\nJohn,25,true,95.5,"Good student"\nJane,30,false,87.2,"Excellent work"';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ 
      name: string; 
      age: number; 
      active: boolean; 
      score: number; 
      description: string 
    }>(file);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ 
      name: 'John', 
      age: 25, 
      active: true, 
      score: 95.5, 
      description: 'Good student' 
    });
    expect(result[1]).toEqual({ 
      name: 'Jane', 
      age: 30, 
      active: false, 
      score: 87.2, 
      description: 'Excellent work' 
    });
  });

  it('handles single column CSV', async () => {
    const csvContent = 'name\nJohn\nJane\nBob';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ name: string }>(file);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: 'John' });
    expect(result[1]).toEqual({ name: 'Jane' });
    expect(result[2]).toEqual({ name: 'Bob' });
  });

  it('handles large numbers and decimals', async () => {
    const csvContent = 'id,amount,percentage\n1,1234567.89,99.99\n2,0.001,0.01';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ id: number; amount: number; percentage: number }>(file);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ id: 1, amount: 1234567.89, percentage: 99.99 });
    expect(result[1]).toEqual({ id: 2, amount: 0.001, percentage: 0.01 });
  });

  it('handles case-insensitive boolean values', async () => {
    const csvContent = 'name,active,verified\nJohn,TRUE,False\nJane,True,FALSE\nBob,true,false';
    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ name: string; active: boolean; verified: boolean }>(file);
    
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({ name: 'John', active: true, verified: false });
    expect(result[1]).toEqual({ name: 'Jane', active: true, verified: false });
    expect(result[2]).toEqual({ name: 'Bob', active: true, verified: false });
  });

  it('handles file reading errors gracefully', async () => {
    const mockFile = {
      name: 'test.csv',
      type: 'text/csv',
      size: 100
    } as File;
    
    Object.defineProperty(mockFile, 'text', {
      get() {
        throw new Error('File read error');
      }
    });
    
    await expect(parseCsvFile(mockFile)).rejects.toThrow();
  });

  it('returns correct data structure for import use case', async () => {
    const csvContent = 'amount,categoryName,categoryType,date,description\n100.00,Groceries,Expense,2024-01-15,Weekly shopping\n2500.00,Salary,Income,2024-01-15,Monthly salary';
    const file = new File([csvContent], 'import.csv', { type: 'text/csv' });
    
    const result = await parseCsvFile<{ 
      amount: number; 
      categoryName: string; 
      categoryType: string; 
      date: string; 
      description: string 
    }>(file);
    
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({ 
      amount: 100.00, 
      categoryName: 'Groceries', 
      categoryType: 'Expense', 
      date: '2024-01-15', 
      description: 'Weekly shopping' 
    });
    expect(result[1]).toEqual({ 
      amount: 2500.00, 
      categoryName: 'Salary', 
      categoryType: 'Income', 
      date: '2024-01-15', 
      description: 'Monthly salary' 
    });
  });
}); 