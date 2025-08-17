"use server";

import { deleteRequest, getRequestList } from "../rest-methods";
import { HOLDING_INVESTMENT_RETURNS_ENDPOINT } from "./endpoints";
import { HoldingInvestmentReturn } from "@/app/net-worth/investment-returns/components/form/holding-investment-return-form";

export async function getHoldingInvestmentReturns() {
  return await getRequestList<HoldingInvestmentReturn>(HOLDING_INVESTMENT_RETURNS_ENDPOINT);
}

export async function deleteHoldingInvestmentReturn(id: number) {
  return await deleteRequest<HoldingInvestmentReturn>(HOLDING_INVESTMENT_RETURNS_ENDPOINT, id);
}


