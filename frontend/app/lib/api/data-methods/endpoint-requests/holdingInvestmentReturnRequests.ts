"use server";

import { DateRange } from "@/app/components";
import { HoldingInvestmentReturn } from "@/app/net-worth/investment-returns/components/HoldingInvestmentReturn";
import { deleteRequest, getRequestList, getQueryStringForDateRange, HOLDING_INVESTMENT_RETURNS_ENDPOINT } from "@/app/lib/api";

export async function getHoldingInvestmentReturnsByDateRange(dateRange: DateRange) {
  return await getRequestList<HoldingInvestmentReturn>(`${HOLDING_INVESTMENT_RETURNS_ENDPOINT}?${getQueryStringForDateRange(dateRange)}`);
}

export async function deleteHoldingInvestmentReturn(id: number) {
  return await deleteRequest<HoldingInvestmentReturn>(HOLDING_INVESTMENT_RETURNS_ENDPOINT, id);
}


