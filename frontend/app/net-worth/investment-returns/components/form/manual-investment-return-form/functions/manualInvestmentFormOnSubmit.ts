import { FormState } from "@/app/hooks";
import { MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "@/app/lib/constants/Constants";
import { getFirstDayOfMonth } from "@/app/lib/utils";
import { ManualInvestmentReturn, ManualInvestmentReturnFormData } from "@/app/net-worth/investment-returns";

export const manualInvestmentFormOnSubmit = async (
  formData: FormData,
  setManualInvestmentReturnCreateUpdateError: (error: string) => void,
  formState: FormState<ManualInvestmentReturn, ManualInvestmentReturnFormData>
) => {
  const formId = MANUAL_INVESTMENT_RETURN_ITEM_NAME_FORM_ID
  const startDateValue = formData.get(`${formId}-startDate`) as string;
  const endDateValue = formData.get(`${formId}-endDate`) as string;

  const startDate = new Date(startDateValue);
  const endDate = new Date(endDateValue);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    setManualInvestmentReturnCreateUpdateError("Invalid date format provided.");
    return;
  }

  const firstDayOfStartDateMonth = getFirstDayOfMonth(new Date(startDateValue));
  if (startDateValue !== firstDayOfStartDateMonth) {
    setManualInvestmentReturnCreateUpdateError("The start date must be the first day of the month.");
    return;
  }
  if (startDateValue > endDateValue) {
    setManualInvestmentReturnCreateUpdateError("The start date must be before the end date.");
    return;
  }

  // Calculate month difference properly across year boundaries
  const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  if (monthDiff !== 1) {
    setManualInvestmentReturnCreateUpdateError("The date range must be exactly one month.");
    return;
  }
  const firstDayOfEndDateMonth = getFirstDayOfMonth(new Date(endDateValue));
  if (endDateValue !== firstDayOfEndDateMonth) {
    setManualInvestmentReturnCreateUpdateError("The end date must be the first day of the month.");
    return;
  }

  formState.handleSubmit(formData);
}
