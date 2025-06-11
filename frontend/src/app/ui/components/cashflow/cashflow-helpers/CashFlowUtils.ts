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

export const getMonthRange = (date: Date) => {
  return {
    from: new Date(date.getFullYear(), date.getMonth(), 1),
    to: new Date(date.getFullYear(), date.getMonth() + 1, 0),
  };
};
