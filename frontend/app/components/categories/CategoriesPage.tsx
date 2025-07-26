"use client";

import { useEffect, useCallback } from "react";
import { useDataListFetcher, useForm } from "@/app/hooks";
import { getRequestList } from "@/app/lib/api/rest-methods";
import { EXPENSE_ITEM_NAME, INCOME_ITEM_NAME, CashFlowCategory } from "@/app/cashflow/components";
import { messageTypeIsError } from "../Utils";
import { Category, CategoryFormData } from "./Category";
import { CategoriesForm } from "./form/CategoriesForm";
import { CategoriesList } from "./list/CategoriesList";

type CategoriesPageProps = {
  isLoggedIn: boolean;
  categoryTypeName: string;
  getEndpoint: string;
  createUpdateDeleteEndpoint: string;
}

export function CategoriesPage<T extends Category>(props: CategoriesPageProps) {
  const fetchCategories = useCallback(() => getRequestList<T>(props.getEndpoint), [props.getEndpoint]);
	const categoriesDataListFetchState = useDataListFetcher<T>(fetchCategories, props.categoryTypeName);

  const transformFormDataToCategory = (formData: FormData) => {
    const nameValue = formData.get("Name") as string;
    const category: T = { name: nameValue } as T;
    if (props.categoryTypeName === INCOME_ITEM_NAME)
      (category as unknown as CashFlowCategory).categoryType = INCOME_ITEM_NAME;
    else if (props.categoryTypeName === EXPENSE_ITEM_NAME) {
      (category as unknown as CashFlowCategory).categoryType = EXPENSE_ITEM_NAME;
    }
    return { item: category, errors: [] };
  }

  const convertCategoryToFormData = (category: T) => ({ 
      name: category.name 
    });

  const formState = useForm<T, CategoryFormData>({
    itemName: props.categoryTypeName,
    itemEndpoint: props.createUpdateDeleteEndpoint,
    transformFormDataToItem: transformFormDataToCategory,
    convertItemToFormData: convertCategoryToFormData,
    fetchItems: () => categoriesDataListFetchState.fetchItems(),
  })

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="flex gap-6 p-6">
      <CategoriesForm
        formState={formState}
        categoryTypeName={props.categoryTypeName}
      />
      <CategoriesList
        categories={categoriesDataListFetchState.items}
        onCategoryDeleted={categoriesDataListFetchState.fetchItems}
        onCategoryIsEditing={formState.onItemIsEditing}
        isLoading={categoriesDataListFetchState.isLoading}
        isError={messageTypeIsError(categoriesDataListFetchState.message)}
        categoryTypeName={props.categoryTypeName}
        deleteEndpoint={props.createUpdateDeleteEndpoint}
      />
    </div>
  )
}