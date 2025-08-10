import { DateRange } from '@/app/components';

export const getCompletedMonthsDefaultRange = (today: Date): DateRange => {
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const from = new Date(prevMonth.getFullYear(), 0, 1);
  const to = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
  return { from, to };
};


export const sumNumberList = (values: number[]) => values.reduce((a, b) => a + b, 0);
export const avgNumberList = (values: number[]) => (values.length ? Math.round(sumNumberList(values) / values.length) : 0);
export const minNumberList = (values: number[]) => (values.length ? Math.min(...values) : 0);
export const maxNumberList = (values: number[]) => (values.length ? Math.max(...values) : 0);
export const medianNumberList = (values: number[]) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? Math.round((sorted[mid - 1] + sorted[mid]) / 2) : sorted[mid];
};
