"use client";

import { useEffect, useCallback } from "react";
import { getRequestList } from "@/app/lib/api/rest-methods/getRequest";
import CategoriesList from "./CategoriesList";
import CategoriesForm from "./CategoriesForm";
import { Category, CategoryFormData } from "@/app/components/categories/Category";
import { CashFlowType } from "@/app/cashflow/components/CashFlowType";
import { CashFlowCategory } from "@/app/cashflow/components/CashFlowCategory";
import { useDataListFetcher, useForm } from "@/app/hooks";
import { messageTypeIsError } from "../Utils";
import { EXPENSE_ITEM_NAME, INCOME_ITEM_NAME } from "@/app/cashflow/components/constants";

type CategoriesPageProps = {
  isLoggedIn: boolean;
  categoryTypeName: string;
  getEndpoint: string;
  createUpdateDeleteEndpoint: string;
}

export default function CategoriesPage<T extends Category>(props: CategoriesPageProps) {
  const fetchCategories = useCallback(() => getRequestList<T>(props.getEndpoint), [props.getEndpoint]);
	const categoriesDataListFetchState = useDataListFetcher<T>(fetchCategories, props.categoryTypeName);

  const transformFormDataToCategory = (formData: FormData) => {
    const nameValue = formData.get("Name") as string;
    const category: T = { name: nameValue } as T;
    if (props.categoryTypeName === INCOME_ITEM_NAME)
      (category as unknown as CashFlowCategory).categoryType = CashFlowType.Income;
    else if (props.categoryTypeName === EXPENSE_ITEM_NAME) {
      (category as unknown as CashFlowCategory).categoryType = CashFlowType.Expense;
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