import { putRequest } from "@/app/lib/api/rest-methods/putRequest";
import { CashFlowEntry } from "@/app/lib/models/cashflow/CashFlowEntry";
import { postRequest } from "@/app/lib/api/rest-methods/postRequest";
import { CashFlowType } from "@/app/lib/models/cashflow/CashFlowType";
import { CashFlowEntryFormData } from "./CashFlowEntryFormData";
import { transformFormDataToEntry } from "./transformFormDataToEntry";
import { MessageState } from "../../../CashFlowUtils";

export const handleCashFlowFormSubmit = async (
  formData: FormData, 
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setMessage: React.Dispatch<React.SetStateAction<MessageState>>,
  setErrorMessage: (message: string) => void,
  setInfoMessage: (message: string) => void,
  fetchEntries: () => Promise<void>,
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<CashFlowEntryFormData>>>,
  cashFlowType: CashFlowType
) => {
  const cashFlowTypeString: string = cashFlowType.toString().toLocaleLowerCase();
  try {
    setIsSubmitting(true);
    setMessage({ type: null, text: '' });

    const { entry: cashFlowEntry, errors } = transformFormDataToEntry(formData, cashFlowType);
    if (!cashFlowEntry || errors.length > 0) {
      setErrorMessage(errors.join(', '));
      return;
    }

    const idValue = formData.get(`${cashFlowTypeString}-id`) as string;
    const isEditing = Boolean(idValue);

    const response = isEditing
      ? await putRequest<CashFlowEntry>("CashFlowEntries", idValue, cashFlowEntry)
      : await postRequest<CashFlowEntry>("CashFlowEntries", cashFlowEntry);

    if (!response.successful) {
      const action = isEditing ? "update" : "create";
      setErrorMessage(`Failed to ${action} ${cashFlowTypeString} entry: ${response.responseMessage}`);
      return;
    }

    await fetchEntries();
    setEditingFormData({});
    const action = isEditing ? "updated" : "created";
    setInfoMessage(`${cashFlowTypeString} entry ${action} successfully.`);

  } catch (error) {
    setErrorMessage("An unexpected error occurred. Please try again.");
    console.error("Submit error:", error);
  } finally {
    setIsSubmitting(false);
  }
};