export const currencyRegex = /^\d+(\.\d{0,2})?$/;
export const percentageRegex = /^-?\d+(\.\d*)?$/;

export const convertDollarsToCents = (dollarAmount: string): number | null => {
  const parsed = Number.parseFloat(dollarAmount);
  if (isNaN(parsed))
    return null;
  return Math.round(parsed * 100);
};

export const convertCentsToDollars = (cents: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(cents / 100);
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

  if (value !== '' && !currencyRegex.test(value)) {
    return null;
  }
  return value;
}

export const cleanPercentageInput = (value: string): string | null => {
  value = value.replace(/[^\d.-]/g, '');

  if (value !== '' && !percentageRegex.test(value)) {
    return null;
  }

  const num = Number(value);
  if (isNaN(num) || num < -100 || num > 100) {
    return null;
  }

  return value;
}
