"use server";

import { DateRange } from "@/app/components";
import { ManualInvestmentReturn } from "@/app/net-worth/investment-returns/components/ManualInvestmentReturn";
import { deleteRequest, getRequestList, getQueryStringForDateRange, MANUAL_INVESTMENT_RETURNS_ENDPOINT } from "@/app/lib/api";

export async function getManualInvestmentReturnsByDateRange(dateRange: DateRange) {
  return await getRequestList<ManualInvestmentReturn>(`${MANUAL_INVESTMENT_RETURNS_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`);
}

export async function deleteManualInvestmentReturn(id: number) {
  return await deleteRequest<ManualInvestmentReturn>(MANUAL_INVESTMENT_RETURNS_ENDPOINT, id);
}


