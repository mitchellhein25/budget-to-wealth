"use server";

import { getRequestList } from "../rest-methods/getRequest";
import { MANUAL_INVESTMENT_CATEGORIES_ENDPOINT } from "./endpoints";

export type ManualInvestmentCategory = { id: number; name: string };

export async function getManualInvestmentCategories() {
  return await getRequestList<ManualInvestmentCategory>(MANUAL_INVESTMENT_CATEGORIES_ENDPOINT);
}


