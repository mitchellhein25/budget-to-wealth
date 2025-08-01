"use server";

import { getRequestList } from "../rest-methods/getRequest";
import { CashFlowCategory } from "@/app/cashflow/components/components/CashFlowCategory";
import { CASH_FLOW_CATEGORIES_ENDPOINT } from "./endpoints";
import { EXPENSE_ITEM_NAME, INCOME_ITEM_NAME } from "@/app/cashflow/components/components/constants";
import { CashFlowType } from "@/app/cashflow/components/components/CashFlowType";


export async function getCategoriesList(cashFlowType: CashFlowType) {
  return await getRequestList<CashFlowCategory>(`${CASH_FLOW_CATEGORIES_ENDPOINT}?cashFlowType=${cashFlowType}`);
}

export async function getExpenseCategoriesList() {
  return await getCategoriesList(EXPENSE_ITEM_NAME);
}

export async function getIncomeCategoriesList() {
  return await getCategoriesList(INCOME_ITEM_NAME);
}
