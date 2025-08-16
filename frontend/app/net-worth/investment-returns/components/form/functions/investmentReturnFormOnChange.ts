import { InvestmentReturnFormData } from "../InvestmentReturnFormData";
import { INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "@/app/net-worth/holding-snapshots/components/constants";
import { cleanCurrencyInput, cleanPercentageInput } from "@/app/components";

export const investmentReturnFormOnChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<InvestmentReturnFormData>>>
) => {
  let { value } = event.target;
  const fieldName = event.target.name.replace(`${INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-`, "");
  console.log("fieldName", fieldName);
  if (fieldName === "endHoldingSnapshotBalance" || fieldName === "totalContributions" || fieldName === "totalWithdrawals") {
    const cleanedValue = cleanCurrencyInput(value);
    if (cleanedValue == null)
      return;
    value = cleanedValue;
  }

  if (fieldName === "manualInvestmentPercentageReturn") {
    const cleanedValue = cleanPercentageInput(value);
    if (cleanedValue == null) 
      return;
    value = cleanedValue;
  }

  setEditingFormData(prev => {
    const updated: Partial<InvestmentReturnFormData> = { ...prev, [fieldName]: value };

    if (fieldName === "manualInvestmentRecurrenceFrequency" && !value) {
      delete updated.manualInvestmentRecurrenceEndDate;
    }

    return updated;
  });
};


