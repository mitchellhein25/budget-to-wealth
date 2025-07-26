import { Category } from "@/app/components/categories/Category";
import { deleteRequest, getRequestList } from "../rest-methods";
import { HOLDING_CATEGORIES_ENDPOINT } from "./";

export async function getAllHoldingCategories() {
  return await getRequestList<Category>(HOLDING_CATEGORIES_ENDPOINT);
}

export async function deleteHoldingCategory(id: number) {
  return await deleteRequest<Category>(HOLDING_CATEGORIES_ENDPOINT, id);
}