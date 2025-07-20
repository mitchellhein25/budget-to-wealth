"use server";

import { getRequestList } from "../rest-methods/getRequest";
import { CashFlowType } from "@/app/cashflow/components/CashFlowType";
import { CashFlowCategory } from "@/app/cashflow/components/CashFlowCategory";

export async function getExpenseCategoriesList() {
  return await getRequestList<CashFlowCategory>(`CashFlowCategories?cashFlowType=${CashFlowType.Expense}`);
}

export async function getIncomeCategoriesList() {
  return await getRequestList<CashFlowCategory>(`CashFlowCategories?cashFlowType=${CashFlowType.Income}`);
}
