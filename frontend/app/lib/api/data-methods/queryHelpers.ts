import { DateRange } from "@/app/components";
import { convertDateToISOString } from "@/app/lib/utils";

export const getQueryStringForDateRange = (dateRange: DateRange) => {
  return `startDate=${convertDateToISOString(dateRange.from)}&endDate=${convertDateToISOString(dateRange.to)}`;
}