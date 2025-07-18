import { CashFlowType } from "@/app/lib/models/cashflow/CashFlowType";
import { cashFlowEntryFormSchema } from "../CashFlowEntryFormData";

export const getCashFlowValidationResult = (formData: FormData, cashFlowType: CashFlowType) => {
  const cashFlowTypeString = cashFlowType.toString().toLocaleLowerCase();
  const rawData = {
    id: formData.get(`${cashFlowTypeString}-id`) as string || undefined,
    amount: formData.get(`${cashFlowTypeString}-amount`) as string,
    date: new Date(formData.get(`${cashFlowTypeString}-date`) as string),
    categoryId: formData.get(`${cashFlowTypeString}-categoryId`) as string || "",
    description: formData.get(`${cashFlowTypeString}-description`) as string || "",
    recurrenceFrequency: formData.get(`${cashFlowTypeString}-recurrenceFrequency`) as string || undefined,
    recurrenceEndDate: formData.get(`${cashFlowTypeString}-recurrenceEndDate`) as string || undefined,
  };

  return cashFlowEntryFormSchema.safeParse(rawData);
}