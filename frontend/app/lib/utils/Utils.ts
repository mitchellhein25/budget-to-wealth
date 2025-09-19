import { DateRange } from "@/app/components";

export const currencyRegex = /^\d+(\.\d{0,2})?$/;
export const percentageRegex = /^-?\d+(\.\d*)?$/;

export const MessageType = {
  ERROR: "ERROR",
  INFO: "INFO",
}

export type MessageType = typeof MessageType[keyof typeof MessageType] | null;

export type MessageState = {
  type: MessageType;
  text: string;
};

export const messageTypeIsError = (message: MessageState) => message.type === MessageType.ERROR;
export const messageTypeIsInfo = (message: MessageState) => message.type === MessageType.INFO;

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

export const getFullMonthRange = (date: Date) : DateRange => {
  return {
    from: new Date(date.getUTCFullYear(), date.getUTCMonth(), 1, 12),
    to: new Date(date.getUTCFullYear(), date.getUTCMonth() + 1, 0, 12),
  };
};

export const getFullYearRange = (date: Date) : DateRange => {
  return {
    from: new Date(date.getUTCFullYear(), 0, 1, 12),
    to: new Date(date.getUTCFullYear(), 11, 31, 12),
  };
};

export const datesAreFullMonthRange = (from: Date | string | undefined, to: Date | string | undefined) => {
  if (!from || !to)
    return false;

  const fromDate = from instanceof Date ? from : convertToDate(from);
  const toDate = to instanceof Date ? to : convertToDate(to);

  const currentMonthRange = getFullMonthRange(fromDate);
  if (!currentMonthRange.from || !currentMonthRange.to)
    return false;
  
  return datesAreSameDay(fromDate, currentMonthRange.from) 
        && datesAreSameDay(toDate, currentMonthRange.to);
};

const datesAreSameDay = (date1: Date, date2: Date) => {
  return date1?.getUTCFullYear() === date2?.getUTCFullYear() 
        && date1?.getUTCMonth() === date2?.getUTCMonth() 
        && date1?.getUTCDate() === date2?.getUTCDate();
};

export const convertToDate = (date: string | undefined, noMonthAdjustment?: boolean): Date => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || !dateRegex.test(date)) {
    return new Date();
  }

  const parts = date.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);

  if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
    return new Date();
  }

  const adjustedMonth = noMonthAdjustment ? month : month - 1;
  const resultDate = new Date(Date.UTC(year, adjustedMonth, day, 12));
  
  if (resultDate.getUTCFullYear() !== year || 
      resultDate.getUTCMonth() !== adjustedMonth || 
      resultDate.getUTCDate() !== day) {
    return new Date();
  }

  return resultDate;
}

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
    month: 'short',
    day: noDay ? undefined : 'numeric',
    timeZone: 'UTC'
  });
}

export const convertToDateMonthYear = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  });
}

export const convertDateToISOString = (date: Date | undefined): string =>
  date?.toISOString().slice(0, 10) ?? '';

export const replaceSpacesWithDashes = (itemName: string): string => 
  itemName.replace(/\s+/g, '-');
