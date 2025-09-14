import { cleanCurrencyInput } from "@/app/lib/utils";
import { HoldingInvestmentReturnFormData, HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "@/app/net-worth/investment-returns";

export const holdingInvestmentReturnFormOnChange = (
  event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<HoldingInvestmentReturnFormData>>>
) => {
  let { value } = event.target;
  const fieldName = event.target.name.replace(`${HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID}-`, "");
  if (fieldName === "endHoldingSnapshotBalance" || fieldName === "totalContributions" || fieldName === "totalWithdrawals") {
    const cleanedValue = cleanCurrencyInput(value);
    if (cleanedValue == null)
      return;
    value = cleanedValue;
  }

  setEditingFormData(prev => {
    const updated: Partial<HoldingInvestmentReturnFormData> = { ...prev, [fieldName]: value };
    return updated;
  });
};


