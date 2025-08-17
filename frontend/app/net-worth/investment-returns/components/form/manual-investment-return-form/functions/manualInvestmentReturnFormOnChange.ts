import { cleanPercentageInput } from "@/app/components";
import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "../../";
import { ManualInvestmentReturnFormData } from "..";

export const manualInvestmentReturnFormOnChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<ManualInvestmentReturnFormData>>>
) => {
  let { value } = event.target;
  const fieldName = event.target.name.replace(`${MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-`, "");
  if (fieldName === "manualInvestmentPercentageReturn") {
    const cleanedValue = cleanPercentageInput(value);
    if (cleanedValue == null) 
      return;
    value = cleanedValue;
  }

  setEditingFormData(prev => {
    const updated: Partial<ManualInvestmentReturnFormData> = { ...prev, [fieldName]: value };

    if (fieldName === "manualInvestmentRecurrenceFrequency" && !value) {
      delete updated.manualInvestmentRecurrenceEndDate;
    }

    return updated;
  });
};


