"use server";

import { DateRange } from "@/app/components";
import { deleteRequest, getRequestList } from "../rest-methods";
import { MANUAL_INVESTMENT_RETURNS_ENDPOINT } from "./endpoints";
import { ManualInvestmentReturn } from "@/app/net-worth/investment-returns/components/ManualInvestmentReturn";
import { getQueryStringForDateRange } from "./queryHelpers";

export async function getManualInvestmentReturnsByDateRange(dateRange: DateRange) {
  return await getRequestList<ManualInvestmentReturn>(`${MANUAL_INVESTMENT_RETURNS_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`);
}

export async function deleteManualInvestmentReturn(id: number) {
  return await deleteRequest<ManualInvestmentReturn>(MANUAL_INVESTMENT_RETURNS_ENDPOINT, id);
}


