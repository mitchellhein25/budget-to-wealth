"use client";

import { useEffect, useCallback, useState } from "react";
import { useForm, useMobileDetection } from "@/app/hooks";
import { getRequestList } from "@/app/lib/api/rest-methods";
import { EXPENSE_ITEM_NAME, INCOME_ITEM_NAME, CashFlowCategory } from "@/app/cashflow/components";
import { MESSAGE_TYPE_ERROR, MessageState, messageTypeIsError } from "../Utils";
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
  const [items, setItems] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });
  const isMobile = useMobileDetection();
  const categoryTypeNameForId = props.categoryTypeName.toLowerCase().replace(" ", "-");

  const fetchCategories = useCallback(() => getRequestList<T>(props.getEndpoint), [props.getEndpoint]);

  const fetchItems = useCallback(async () => {
    const setErrorMessage = (text: string) => setMessage({ type: MESSAGE_TYPE_ERROR, text });
    try {
      setIsLoading(true);
      setMessage({ type: null, text: '' });
      const response = await fetchCategories();
      if (!response.successful) {
        setErrorMessage(`Failed to load ${props.categoryTypeName}s. Please try again.`);
        return;
      }
      setItems(response.data as T[]);
    } catch (error) {
      setErrorMessage(`An error occurred while loading ${props.categoryTypeName}s. Please try again.`);
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchCategories, props.categoryTypeName]);  

  const transformFormDataToCategory = (formData: FormData) => {
    const nameValue = formData.get(`${categoryTypeNameForId}-name`) as string;
    const category: T = { 
      id: formData.get(`${categoryTypeNameForId}-id`) as string || undefined,
      name: nameValue 
    } as T;
    if (props.categoryTypeName === INCOME_ITEM_NAME)
      (category as unknown as CashFlowCategory).categoryType = INCOME_ITEM_NAME;
    else if (props.categoryTypeName === EXPENSE_ITEM_NAME) {
      (category as unknown as CashFlowCategory).categoryType = EXPENSE_ITEM_NAME;
    }
    return { item: category, errors: [] };
  }

  const convertCategoryToFormData = (category: T) => ({ 
      id: category.id?.toString(),
      name: category.name 
    });

  const formState = useForm<T, CategoryFormData>({
    itemName: props.categoryTypeName,
    itemEndpoint: props.createUpdateDeleteEndpoint,
    transformFormDataToItem: transformFormDataToCategory,
    convertItemToFormData: convertCategoryToFormData,
    fetchItems: fetchItems,
  })

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className={`flex gap-3 sm:gap-6 p-3 sm:p-6 ${isMobile ? 'flex-col' : ''}`}>
      <CategoriesForm
        formState={formState}
        categoryTypeName={props.categoryTypeName}
      />
      <CategoriesList
        categories={items}
        onCategoryDeleted={fetchItems}
        onCategoryIsEditing={formState.onItemIsEditing}
        isLoading={isLoading}
        isError={messageTypeIsError(message)}
        categoryTypeName={props.categoryTypeName}
        deleteEndpoint={props.createUpdateDeleteEndpoint}
      />
    </div>
  )
}
