import { FormState } from '@/app/hooks';
import { formHasAnyValue } from '@/app/components';

const createMockFormState = (editingFormData: Record<string, unknown> = {}): FormState<unknown, Record<string, unknown>> => ({
  editingFormData,
  isSubmitting: false,
  message: { type: null, text: '' },
  onChange: () => {},
  handleSubmit: () => {},
  onItemIsEditing: () => {},
  onReset: () => {},
});

describe('formHasAnyValue', () => {
  it('returns false when editingFormData is undefined', () => {
    const formState = createMockFormState({});
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns false when editingFormData is null', () => {
    const formState = createMockFormState({});
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns false when editingFormData is empty object', () => {
    const formState = createMockFormState({});
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns false when editingFormData has only null values', () => {
    const formState = createMockFormState({
      name: null,
      email: null,
      age: null,
    });
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns false when editingFormData has only empty string values', () => {
    const formState = createMockFormState({
      name: '',
      email: '',
      age: '',
    });
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns true when editingFormData has at least one non-null, non-empty string value', () => {
    const formState = createMockFormState({
      name: 'John Doe',
      email: '',
      age: null,
    });
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('returns true when editingFormData has numeric values', () => {
    const formState = createMockFormState({
      name: '',
      age: 25,
      score: 0,
    });
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('returns true when editingFormData has boolean values', () => {
    const formState = createMockFormState({
      name: '',
      isActive: false,
      isVerified: true,
    });
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('returns true when editingFormData has object values', () => {
    const formState = createMockFormState({
      name: '',
      address: { street: '123 Main St' },
      preferences: {},
    });
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('returns true when editingFormData has array values', () => {
    const formState = createMockFormState({
      name: '',
      tags: [],
      scores: [1, 2, 3],
    });
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('handles mixed value types correctly', () => {
    const formState = createMockFormState({
      name: 'John',
      email: '',
      age: 30,
      isActive: true,
      address: null,
      tags: [],
      score: 0,
    });
    
    expect(formHasAnyValue(formState)).toBe(true);
  });
});
