import { HOLDING_CATEGORIES_ENDPOINT, deleteRequest, getRequestList } from "@/app/lib/api";
import { Category } from "@/app/components";

export async function getAllHoldingCategories() {
  return await getRequestList<Category>(HOLDING_CATEGORIES_ENDPOINT);
}

export async function deleteHoldingCategory(id: number) {
  return await deleteRequest<Category>(HOLDING_CATEGORIES_ENDPOINT, id);
}