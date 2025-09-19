import { convertDateToISOString, convertToDate, datesAreFullMonthRange, getFullMonthRange } from "@/app/lib/utils";
import { DateRange } from "@/app/components";

export const handleFromChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setFromInputValue: React.Dispatch<React.SetStateAction<string>>,
  toInputValue: string,
  setSelectedMonth: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSelectedYear: React.Dispatch<React.SetStateAction<string | undefined>>
) =>
  handleSingleDateChange(e, setFromInputValue, e.target.value, toInputValue, setSelectedMonth, setSelectedYear);

export const handleToChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setToInputValue: React.Dispatch<React.SetStateAction<string>>,
  fromInputValue: string,
  setSelectedMonth: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSelectedYear: React.Dispatch<React.SetStateAction<string | undefined>>
) =>
  handleSingleDateChange(e, setToInputValue, fromInputValue, e.target.value, setSelectedMonth, setSelectedYear);

const handleSingleDateChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setter: React.Dispatch<React.SetStateAction<string>>,
  fromDateValue: string,
  toDateValue: string,
  setSelectedMonth: React.Dispatch<React.SetStateAction<string | undefined>>,
  setSelectedYear: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  const newValue = e.target.value;
  setter(newValue);

  if (datesAreFullMonthRange(fromDateValue, toDateValue)) {
    const dateObj = convertToDate(fromDateValue, true);
    setSelectedMonth(dateObj.getUTCMonth().toString());
    setSelectedYear(dateObj.getUTCFullYear().toString());
  } else {
    setSelectedMonth('');
  }
};

export const handleMonthChange = (
  e: React.ChangeEvent<HTMLSelectElement>,
  setSelectedMonth: React.Dispatch<React.SetStateAction<string | undefined>>,
  selectedYear: string,
  setFromInputValue: React.Dispatch<React.SetStateAction<string>>,
  setToInputValue: React.Dispatch<React.SetStateAction<string>>
) => {
  const month = e.target.value;
  setSelectedMonth(month);
  updateDateRangeFromMonthYear(month, selectedYear, setFromInputValue, setToInputValue);
};

export const minYearOption = new Date().getFullYear() - 20;
export const maxYearOption = new Date().getFullYear() + 20;

export const handleYearChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  setSelectedYear: React.Dispatch<React.SetStateAction<string | undefined>>,
  selectedMonth: string,
  setFromInputValue: React.Dispatch<React.SetStateAction<string>>,
  setToInputValue: React.Dispatch<React.SetStateAction<string>>
) => {
  const year = e.target.value;
  setSelectedYear(year);
  const yearInt = parseInt(year);
  if (yearInt && yearInt >= minYearOption && yearInt <= maxYearOption) {
    updateDateRangeFromMonthYear(selectedMonth, year, setFromInputValue, setToInputValue);
  }
};

const updateDateRangeFromMonthYear = (
  month: string | undefined, 
  year: string | undefined,
  setFromInputValue: React.Dispatch<React.SetStateAction<string>>,
  setToInputValue: React.Dispatch<React.SetStateAction<string>>
) => {
  if (month && year) {
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    const currentMonthRange = getFullMonthRange(new Date(yearNum, monthNum - 1, 1, 12));
    setFromInputValue(convertDateToISOString(currentMonthRange.from) ?? '');
    setToInputValue(convertDateToISOString(currentMonthRange.to) ?? '');
  }
};

export const handleSetRange = (
  fromInputValue: string,
  toInputValue: string,
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>
) => {
  const newFrom = fromInputValue && isValidDate(fromInputValue) ? new Date(fromInputValue) : undefined;
  const newTo = toInputValue && isValidDate(toInputValue) ? new Date(toInputValue) : undefined;

  setDateRange({ from: newFrom, to: newTo });
};

const isValidDate = (dateString: string | undefined): boolean => {
  if (!dateString)
    return false;
  const date = new Date(dateString);
  return !isNaN(date.getTime()) && dateString === convertDateToISOString(date);
};

export const hasChanges = (
  fromInputValue: string,
  toInputValue: string,
  dateRange: DateRange,
  showSpecificDateRange: boolean
) => {
  const currentFrom = dateRange.from ? convertDateToISOString(dateRange.from) : '';
  const currentTo = dateRange.to ? convertDateToISOString(dateRange.to) : '';

  if (showSpecificDateRange) {
    return fromInputValue !== currentFrom || toInputValue !== currentTo;
  } else {
    return fromInputValue !== currentFrom || toInputValue !== currentTo;
  }
};