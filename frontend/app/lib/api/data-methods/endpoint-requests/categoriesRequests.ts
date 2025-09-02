"use server";

import { EXPENSE_ITEM_NAME, INCOME_ITEM_NAME, CashFlowType, CashFlowCategory } from "@/app/cashflow/components";
import { getRequestList, CASH_FLOW_CATEGORIES_ENDPOINT } from "@/app/lib/api";

export async function getCategoriesList(cashFlowType: CashFlowType) {
  return await getRequestList<CashFlowCategory>(`${CASH_FLOW_CATEGORIES_ENDPOINT}?cashFlowType=${cashFlowType}`);
}

export async function getExpenseCategoriesList() {
  return await getCategoriesList(EXPENSE_ITEM_NAME);
}

export async function getIncomeCategoriesList() {
  return await getCategoriesList(INCOME_ITEM_NAME);
}
