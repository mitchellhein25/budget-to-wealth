import { useEffect, useState } from "react";
import { putRequest } from "@/app/lib/api/rest-methods/putRequest";
import { postRequest } from "@/app/lib/api/rest-methods/postRequest";
import { getRequest } from "@/app/lib/api/rest-methods/getRequest";
import { HoldingCategory } from "@/app/lib/models/net-worth/HoldingCategory";
import CategoriesList from "../../list/CategoriesList";

type HoldingCategoriesPageProps = {
  isLoggedIn: boolean;
}

export default function HoldingCategoriesPage(props: HoldingCategoriesPageProps) {
  const [holdingCategories, setHoldingCategories] = useState<HoldingCategory[]>([]);
  const [editingHoldingCategory, setEditingHoldingCategory] = useState<HoldingCategory | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  const endpoint: string = "HoldingCategories";

  function onChange(name: string) {
    setEditingHoldingCategory(prev => prev ? { ...prev, name } : { name })
  }

  async function handleSubmit(formData: FormData) {
    const nameValue = formData.get("Name") as string;
    const holdingCategory: HoldingCategory = { name: nameValue };
    let response = null
    const idValue = formData.get("Id");
    if (idValue)
      response = await putRequest<HoldingCategory>(endpoint, idValue as string, holdingCategory);
    else
      response = await postRequest<HoldingCategory>(endpoint, holdingCategory);
    const actionVerb: string = idValue == null ? "create" : "update";
    if (!response.successful)
      setMessage(`Failed to ${actionVerb} holding category: "` + response.responseMessage);
    else {
      setMessage(`Holding category ${actionVerb}d successfully.`);
      fetchHoldingCategories();
      setEditingHoldingCategory(null)
    }
  }

  function onCategoryIsEditing(category: HoldingCategory){
    setEditingHoldingCategory(category);
  }

  async function fetchHoldingCategories() {
    setIsLoading(true);
    const response = await getRequest<HoldingCategory>(`HoldingCategories`);
    setHoldingCategories(response.data as HoldingCategory[]);
    if (!response.successful) {
      setIsError(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchHoldingCategories();
  }, []);

  if (!props.isLoggedIn)
    return <p>Please log in to manage holding categories.</p>;

  return (
    <div className="flex gap-6 p-6">
      {/* <CashflowSideBar />
      <CashFlowCategoriesForm
        handleSubmit={handleSubmit}
        editingHoldingCategory={editingHoldingCategory}
        onNameChange={onChange}
        onReset={() => setEditingHoldingCategory(null)}
        infoMessage={isError ? "" : message}
        errorMessage={isError ? message : ""}
        cashFlowType={props.cashFlowType}
      /> */}
      <CategoriesList
        categories={holdingCategories}
        categoryName="Holding"
        endpoint="HoldingCategories"
        onCategoryDeleted={fetchHoldingCategories}
        onCategoryIsEditing={onCategoryIsEditing}
        isLoading={isLoading}
        isError={isError}
      />
    </div>
  )
}