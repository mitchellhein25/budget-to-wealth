export const currencyRegex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
export const percentageRegex = /^-?(0|[1-9]\d*)(\.\d+)?$/;

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

export const cleanCurrencyInput = (input: string): string | null => {
  let value = input.replace(/[^\d.]/g, '');

  const firstDecimal = value.indexOf('.');
  if (firstDecimal !== -1) {
    value =
      value.slice(0, firstDecimal + 1) +
      value
        .slice(firstDecimal + 1)
        .replace(/\./g, '');
  }

  if (value.endsWith('.')) {
    value = value.slice(0, -1);
  }

  while (value.length > 1 && value[0] === '0' && value[1] !== '.') {
    value = value.slice(1);
  }

  const decimalIndex = value.indexOf('.');
  if (decimalIndex !== -1) {
    value = value.slice(0, decimalIndex + 3);
    if (value.length - decimalIndex === 2) {
      value += '0';
    }
  }

  if (value !== '' && !currencyRegex.test(value)) {
    return null;
  }

  return value;
}

export const cleanPercentageInput = (input: string): string | null => {
  const value = input.replace(/[^\d.-]/g, '');

  if (value === '') {
    return value;
  }

  if (!percentageRegex.test(value)) {
    return null;
  }

  const num = Number(value);
  if (isNaN(num) || num < -100 || num > 100) {
    return null;
  }

  return value;
}
