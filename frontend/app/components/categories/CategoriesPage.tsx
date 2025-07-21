"use client";

import { useEffect, useState, useCallback } from "react";
import { putRequest } from "@/app/lib/api/rest-methods/putRequest";
import { postRequest } from "@/app/lib/api/rest-methods/postRequest";
import { getRequestList } from "@/app/lib/api/rest-methods/getRequest";
import CategoriesList from "./CategoriesList";
import CategoriesForm from "./CategoriesForm";
import { Category } from "@/app/components/categories/Category";
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
  // const [categories, setCategories] = useState<T[]>([]);
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

  const formState = useForm<T, FormData>({
    itemName: props.categoryTypeName,
    itemEndpoint: props.createUpdateDeleteEndpoint,
    transformFormDataToItem: transformFormDataToCategory,
    convertItemToFormData: convertCategoryToFormData,
    fetchItems: () => categoriesDataListFetchState.fetchItems(),
  })


  const [editingCategory, setEditingCategory] = useState<T | null>(null);
  const categoryTypeNameLower = props.categoryTypeName.toLowerCase();

  function onChange(name: string) {
    setEditingCategory(prev => prev ? { ...prev, name } : { name } as T)
  }

  async function handleSubmit(formData: FormData) {
    const nameValue = formData.get("Name") as string;

    const category: T = { name: nameValue } as T;
    if (props.categoryTypeName === "Income")
      (category as unknown as CashFlowCategory).categoryType = CashFlowType.Income;
    else if (props.categoryTypeName === "Expense") {
      (category as unknown as CashFlowCategory).categoryType = CashFlowType.Expense;
    }

    let response = null
    const idValue = formData.get("Id");
    if (idValue)
      response = await putRequest<T>(props.createUpdateDeleteEndpoint, idValue as string, category);
    else
      response = await postRequest<T>(props.createUpdateDeleteEndpoint, category);
    
    const actionVerb: string = idValue == null ? "create" : "update";
    if (!response.successful)
      setMessage(`Failed to ${actionVerb} ${categoryTypeNameLower} category: "` + response.responseMessage);
    else {
      setMessage(`${props.categoryTypeName} category ${actionVerb}d successfully.`);
      fetchCategories();
      setEditingCategory(null)
    }
  }

  function onCategoryIsEditing(category: T){
    setEditingCategory(category);
  }

  // const fetchCategories = useCallback(async () => {
  //   setIsLoading(true);
  //   const response = await getRequestList<T>(props.getEndpoint);
  //   setCategories(response.data as T[]);
  //   if (!response.successful) {
  //     setIsError(true);
  //   }
  //   setIsLoading(false);
  // }, [props.getEndpoint]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (!props.isLoggedIn)
    return <p>Please log in to manage {categoryTypeNameLower} categories.</p>;

  return (
    <div className="flex gap-6 p-6">
      <CategoriesForm
        handleSubmit={handleSubmit}
        editingCategory={editingCategory}
        onNameChange={onChange}
        onReset={() => setEditingCategory(null)}
        infoMessage={isError ? "" : message}
        errorMessage={isError ? message : ""}
        categoryTypeName={props.categoryTypeName}
      />
      <CategoriesList
        categories={categoriesDataListFetchState.items}
        onCategoryDeleted={categoriesDataListFetchState.fetchItems}
        onCategoryIsEditing={onCategoryIsEditing}
        isLoading={categoriesDataListFetchState.isLoading}
        isError={messageTypeIsError(categoriesDataListFetchState.message)}
        categoryTypeName={props.categoryTypeName}
        deleteEndpoint={props.createUpdateDeleteEndpoint}
      />
    </div>
  )
}