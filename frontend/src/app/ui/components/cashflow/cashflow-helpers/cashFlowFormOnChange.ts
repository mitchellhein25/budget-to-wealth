import { CashFlowType } from "@/app/lib/models/CashFlow/CashFlowType";
import { CashFlowEntryFormData } from "./CashFlowEntryFormData";
import { cleanAmountInput } from "./CashFlowUtils";

export const cashFlowFormOnChange = (
  event: React.ChangeEvent<HTMLInputElement>, 
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<CashFlowEntryFormData>>>, 
  cashFlowType: CashFlowType
) => {
  let { name, value } = event.target;
  const cashFlowTypeString: string = cashFlowType.toString().toLocaleLowerCase();
  const fieldName = name.replace(`${cashFlowTypeString}-`, "");
  if (fieldName === "amount") {
    const cleanedValue = cleanAmountInput(value);
    if (cleanedValue == null)
      return;
    value = cleanedValue;
  }
  setEditingFormData((prev) => ({ ...prev, [fieldName]: value }));
};