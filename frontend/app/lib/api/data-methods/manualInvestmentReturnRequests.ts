"use server";

import { deleteRequest, getRequestList } from "../rest-methods";
import { MANUAL_INVESTMENT_RETURNS_ENDPOINT } from "./endpoints";
import { ManualInvestmentReturn } from "@/app/net-worth/investment-returns/components/ManualInvestmentReturn";

export async function getManualInvestmentReturns() {
  return await getRequestList<ManualInvestmentReturn>(MANUAL_INVESTMENT_RETURNS_ENDPOINT);
}

export async function deleteInvestmentReturn(id: number) {
  return await deleteRequest<ManualInvestmentReturn>(MANUAL_INVESTMENT_RETURNS_ENDPOINT, id);
}


