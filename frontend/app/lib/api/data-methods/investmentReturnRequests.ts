"use server";

import { deleteRequest, getRequestList } from "../rest-methods";
import { INVESTMENT_RETURNS_ENDPOINT } from "./endpoints";
import { InvestmentReturn } from "@/app/net-worth/investment-returns/components";

export async function getInvestmentReturns() {
  return await getRequestList<InvestmentReturn>(INVESTMENT_RETURNS_ENDPOINT);
}

export async function deleteInvestmentReturn(id: number) {
  return await deleteRequest<InvestmentReturn>(INVESTMENT_RETURNS_ENDPOINT, id);
}


