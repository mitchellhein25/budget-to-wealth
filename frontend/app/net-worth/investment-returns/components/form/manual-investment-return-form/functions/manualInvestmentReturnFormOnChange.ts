import { cleanPercentageInput } from "@/app/lib/utils";
import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID, ManualInvestmentReturnFormData } from "@/app/net-worth/investment-returns";

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


