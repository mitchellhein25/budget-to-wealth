import { cleanCurrencyInput } from "../../../../cashflow/CashFlowUtils";
import { HoldingSnapshotFormData } from "../HoldingSnapshotFormData";

export const holdingSnapshotFormOnChange = (
  event: React.ChangeEvent<HTMLInputElement>, 
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<HoldingSnapshotFormData>>>, 
) => {
  let { value } = event.target;
  const fieldName = event.target.name.replace(`holding-snapshot-`, "");
  if (fieldName === "balance") {
    const cleanedValue = cleanCurrencyInput(value);
    if (cleanedValue == null)
      return;
    value = cleanedValue;
  }
  setEditingFormData((prev) => ({ ...prev, [fieldName]: value }));
};