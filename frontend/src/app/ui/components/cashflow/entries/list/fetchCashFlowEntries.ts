import { getRequest } from "@/app/lib/api/rest-methods/getRequest";
import { CashFlowEntry } from "@/app/lib/models/cashflow/CashFlowEntry";
import { formatDate, MessageState } from "../../CashFlowUtils";
import { DateRange } from "react-day-picker";

export const fetchCashFlowEntries = async (
  cashFlowType: string,
  dateRange: DateRange,
  setEntries: React.Dispatch<React.SetStateAction<CashFlowEntry[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, 
  setMessage: React.Dispatch<React.SetStateAction<MessageState>>,
  setErrorMessage: (message: string) => void
) => {
  try {
    setIsLoading(true);
    setMessage({ type: null, text: '' });
    const response = await getRequest<CashFlowEntry>(`CashFlowEntries?entryType=${cashFlowType}&startDate=${formatDate(dateRange.from)}&endDate=${formatDate(dateRange.to)}`);
    if (!response.successful) {
      setErrorMessage(`Failed to load ${cashFlowType} entries. Please try again.`);
      return;
    }
    setEntries(response.data as CashFlowEntry[]);
  } catch (error) {
    setErrorMessage(`An error occurred while loading ${cashFlowType} entries.`);
    console.error("Fetch error:", error);
  } finally {
    setIsLoading(false);
  }
}