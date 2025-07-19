import { convertDateToISOString } from "@/app/components/Utils";
import { DateRange } from "@/app/components/DatePicker";

export const getQueryStringForDateRange = (dateRange: DateRange) => {
  return `startDate=${convertDateToISOString(dateRange.from)}&endDate=${convertDateToISOString(dateRange.to)}`;
}