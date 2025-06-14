import { getRequest } from "@/app/lib/api/rest-methods/getRequest";
import { CashFlowEntry } from "@/app/lib/models/CashFlow/CashFlowEntry";
import { MessageState } from "../../CashFlowUtils";

export const fetchCashFlowEntries = async (
  cashFlowType: string,
  setIncomeEntries: React.Dispatch<React.SetStateAction<CashFlowEntry[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, 
  setMessage: React.Dispatch<React.SetStateAction<MessageState>>,
  setErrorMessage: (message: string) => void
) => {
  try {
    setIsLoading(true);
    setMessage({ type: null, text: '' });
    const response = await getRequest<CashFlowEntry>(`CashFlowEntries?entryType=${cashFlowType}`);
    if (!response.successful) {
      setErrorMessage(`Failed to load ${cashFlowType} entries. Please try again.`);
      return;
    }
    setIncomeEntries(response.data as CashFlowEntry[]);
  } catch (error) {
    setErrorMessage(`An error occurred while loading ${cashFlowType} entries.`);
    console.error("Fetch error:", error);
  } finally {
    setIsLoading(false);
  }
}