export const currencyRegex = /^\d+(\.\d{0,2})?$/;
export const percentageRegex = /^-?\d+(\.\d*)?$/;

export const MESSAGE_TYPE_ERROR = "ERROR";
export const MESSAGE_TYPE_INFO = "INFO";

export type MessageType = "ERROR" | "INFO" | null;

export type MessageState = {
  type: MessageType;
  text: string;
};

export const messageTypeIsError = (message: MessageState) => message.type === "ERROR";
export const messageTypeIsInfo = (message: MessageState) => message.type === "INFO";

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

export const getCurrentMonthRange = (date: Date) => {
  return {
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
};

export const getCurrentYearRange = (date: Date) => {
  return {
    from: new Date(date.getFullYear(), 0, 1),
    to: new Date(date.getFullYear(), 11, 31),
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

export const formatDate = (date: Date | undefined, noDay: boolean = false): string | undefined => {
  return date?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: noDay ? undefined : 'numeric'
  });
}

export const convertDateToISOString = (date: Date | undefined): string =>
  date?.toISOString().slice(0, 10) ?? '';

export const replaceSpacesWithDashes = (itemName: string): string => 
  itemName.replace(/\s+/g, '-');
