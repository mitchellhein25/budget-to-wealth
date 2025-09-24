import { FormState } from "@/app/hooks";
import { createHoldingSnapshot, FetchResult, updateHoldingSnapshot } from "@/app/lib/api";
import { HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID } from "@/app/lib/constants/Constants";
import { convertDateToISOString, convertDollarsToCents, getFirstDayOfMonth } from "@/app/lib/utils";
import { HoldingSnapshot } from "@/app/net-worth/holding-snapshots";
import { HoldingInvestmentReturn, HoldingInvestmentReturnFormData } from "@/app/net-worth/investment-returns";

export const holdingInvestmentFormOnSubmit = async (
  formData: FormData,
  setEndSnapshotCreateUpdateError: (error: string) => void,
  endHoldingId: string,
  formState: FormState<HoldingInvestmentReturn, HoldingInvestmentReturnFormData>
) => {
  const formId = HOLDING_INVESTMENT_RETURN_ITEM_NAME_FORM_ID
  const startDateValue = formData.get(`${formId}-startHoldingSnapshotDate`) as string;
  const endDateValue = formData.get(`${formId}-endHoldingSnapshotDate`) as string;

  const startDate = new Date(startDateValue);
  const endDate = new Date(endDateValue);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    setEndSnapshotCreateUpdateError("Invalid date format provided.");
    return;
  }

  const firstDayOfStartDateMonth = getFirstDayOfMonth(new Date(startDateValue));
  if (startDateValue !== firstDayOfStartDateMonth) {
    setEndSnapshotCreateUpdateError("The start snapshot date must be the first day of the month.");
    return;
  }
  if (startDateValue > endDateValue) {
    setEndSnapshotCreateUpdateError("The start date must be before the end date.");
    return;
  }

  // Calculate month difference properly across year boundaries
  const monthDiff = (endDate.getFullYear() - startDate.getFullYear()) * 12 + (endDate.getMonth() - startDate.getMonth());
  if (monthDiff !== 1) {
    setEndSnapshotCreateUpdateError("The date range must be exactly one month.");
    return;
  }
  const firstDayOfEndDateMonth = getFirstDayOfMonth(new Date(endDateValue));
  if (endDateValue !== firstDayOfEndDateMonth) {
    setEndSnapshotCreateUpdateError("The end snapshot date must be the first day of the month.");
    return;
  }

  const endHoldingSnapshotId = formData.get(`${formId}-endHoldingSnapshotId`) as string;
  const endSnapshotDate = formData.get(`${formId}-endHoldingSnapshotDate`) as string;
  const balance = formData.get(`${formId}-endHoldingSnapshotBalance`) as string;

  if (!endHoldingId) {
    setEndSnapshotCreateUpdateError("End holding is required.");
    return;
  }
  if (!endDate) {
    setEndSnapshotCreateUpdateError("End holding snapshot date is required.");
    return;
  }
  if (!balance) {
    setEndSnapshotCreateUpdateError("End holding snapshot balance is required.");
    return;
  }

  const endHoldingSnapshot = {
    holdingId: endHoldingId,
    date: convertDateToISOString(new Date(endSnapshotDate)),
    balance: convertDollarsToCents(balance) ?? 0,
  }

  let result: FetchResult<HoldingSnapshot> | null = null;
  if (endHoldingSnapshotId) {
    result = await updateHoldingSnapshot(endHoldingSnapshotId, endHoldingSnapshot);
  } else {
    result = await createHoldingSnapshot(endHoldingSnapshot);
  }
  if (!result.successful) {
    setEndSnapshotCreateUpdateError(`Failed to create/update end holding snapshot. New investment return will not be created. ${result.responseMessage || ''}`);
    return;
  }
  // Build a new FormData to avoid mutating a potentially read-only FormData
  const updatedFormData = new FormData();
  for (const [key, value] of formData.entries()) {
    updatedFormData.set(key, typeof value === 'string' ? value : value.toString());
  }
  updatedFormData.set(`${formId}-endHoldingSnapshotHoldingId`, endHoldingId);
  const newId = result.data?.id?.toString() || '';
  updatedFormData.set(`${formId}-endHoldingSnapshotId`, newId);
  formState.handleSubmit(updatedFormData);
}
