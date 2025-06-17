import { putRequest } from "@/app/lib/api/rest-methods/putRequest";
import { postRequest } from "@/app/lib/api/rest-methods/postRequest";
import { MessageState } from "../../../../cashflow/CashFlowUtils";
import { Holding } from "@/app/lib/models/net-worth/Holding";
import { transformFormDataToHolding } from "./transformFormDataToHolding";
import { HoldingFormData } from "@/app/ui/components/net-worth/holdings/form/HoldingFormData";

export const handleHoldingFormSubmit = async (
  formData: FormData, 
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setMessage: React.Dispatch<React.SetStateAction<MessageState>>,
  setErrorMessage: (message: string) => void,
  setInfoMessage: (message: string) => void,
  fetchEntries: () => Promise<void>,
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<HoldingFormData>>>,
) => {
  try {
    setIsSubmitting(true);
    setMessage({ type: null, text: '' });

    const { holding, errors } = transformFormDataToHolding(formData);
    if (!holding || errors.length > 0) {
      setErrorMessage(errors.join(', '));
      return;
    }

    const idValue = formData.get(`holding-id`) as string;
    const isEditing = Boolean(idValue);

    const response = isEditing
      ? await putRequest<Holding>("Holdings", idValue, holding)
      : await postRequest<Holding>("Holdings", holding);

    if (!response.successful) {
      const action = isEditing ? "update" : "create";
      setErrorMessage(`Failed to ${action} holding: ${response.responseMessage}`);
      return;
    }

    await fetchEntries();
    setEditingFormData({});
    const action = isEditing ? "updated" : "created";
    setInfoMessage(`Holding ${action} successfully.`);

  } catch (error) {
    setErrorMessage("An unexpected error occurred. Please try again.");
    console.error("Submit error:", error);
  } finally {
    setIsSubmitting(false);
  }
};