import { formHasAnyValue } from '../formUtils';
import { FormState } from '@/app/hooks';

describe('formHasAnyValue', () => {
  it('returns false when editingFormData is undefined', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: undefined,
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns false when editingFormData is null', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: null,
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns false when editingFormData is empty object', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: {},
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns false when editingFormData has only null values', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: {
        name: null,
        email: null,
        age: null,
      },
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns false when editingFormData has only empty string values', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: {
        name: '',
        email: '',
        age: '',
      },
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(false);
  });

  it('returns true when editingFormData has at least one non-null, non-empty string value', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: {
        name: 'John Doe',
        email: '',
        age: null,
      },
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('returns true when editingFormData has numeric values', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: {
        name: '',
        age: 25,
        score: 0,
      },
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('returns true when editingFormData has boolean values', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: {
        name: '',
        isActive: false,
        isVerified: true,
      },
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('returns true when editingFormData has object values', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: {
        name: '',
        address: { street: '123 Main St' },
        preferences: {},
      },
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('returns true when editingFormData has array values', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: {
        name: '',
        tags: [],
        scores: [1, 2, 3],
      },
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(true);
  });

  it('handles mixed value types correctly', () => {
    const formState: FormState<unknown, Record<string, unknown>> = {
      editingFormData: {
        name: 'John',
        email: '',
        age: 30,
        isActive: true,
        address: null,
        tags: [],
        score: 0,
      },
      isEditing: false,
      isLoading: false,
      error: null,
    };
    
    expect(formHasAnyValue(formState)).toBe(true);
  });
});
