"use server";

import { getRequestList, MANUAL_INVESTMENT_CATEGORIES_ENDPOINT } from "@/app/lib/api";

export type ManualInvestmentCategory = { id: number; name: string };

export async function getManualInvestmentCategories() {
  return await getRequestList<ManualInvestmentCategory>(MANUAL_INVESTMENT_CATEGORIES_ENDPOINT);
}


