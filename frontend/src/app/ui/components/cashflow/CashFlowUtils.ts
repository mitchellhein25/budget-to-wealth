export const numberRegex = /^\d+(\.\d{0,2})?$/;

export type MessageState = {
  type: 'info' | 'error' | null;
  text: string;
};

export const convertDollarsToCents = (dollarAmount: string): number | null => {
  const parsed = Number.parseFloat(dollarAmount);
  if (isNaN(parsed))
    return null;
  return Math.round(parsed * 100);
};

export const formatCurrency = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100);
};

export const getMonthRange = (date: Date) => {
  return {
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
};

export const cleanCurrencyInput = (value: string): string | null => {
  value = value.replace(/[^\d.]/g, '');

  const decimalCount = (value.match(/\./g) || []).length;
  if (decimalCount > 1) {
    return null;
  }

  const decimalIndex = value.indexOf('.');
  if (decimalIndex !== -1 && value.length - decimalIndex > 3) {
    value = value.substring(0, decimalIndex + 3);
  }

  if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
    value = value.substring(1);
  }

  if (value !== '' && !numberRegex.test(value)) {
    return null;
  }
  return value;
}

export const formatDate = (date: Date | undefined): string | undefined => {
  return date?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}