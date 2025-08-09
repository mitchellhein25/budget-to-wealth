import { DateRange } from '@/app/components/DatePicker';

export const getCompletedMonthsDefaultRange = (today: Date): DateRange => {
  const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const from = new Date(prevMonth.getFullYear(), 0, 1);
  const to = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0);
  return { from, to };
};


