import { DateRange, convertDateToISOString } from "@/app/components";

export const getQueryStringForDateRange = (dateRange: DateRange) => {
  return `startDate=${convertDateToISOString(dateRange.from)}&endDate=${convertDateToISOString(dateRange.to)}`;
}