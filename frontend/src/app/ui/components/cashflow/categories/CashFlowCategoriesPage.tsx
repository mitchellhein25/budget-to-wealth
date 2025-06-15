import { CashFlowType } from "@/app/lib/models/cashflow/CashFlowType";
import CashFlowCategoriesList from "./list/CashFlowCategoriesList";
import { useEffect, useState } from "react";
import { CashFlowCategory } from "@/app/lib/models/cashflow/CashFlowCategory";
import { putRequest } from "@/app/lib/api/rest-methods/putRequest";
import { postRequest } from "@/app/lib/api/rest-methods/postRequest";
import { getRequest } from "@/app/lib/api/rest-methods/getRequest";
import CashflowSideBar from "../CashflowSideBar";
import CashFlowCategoriesForm from "./form/CashFlowCategoriesForm";

type CashFlowCategoriesPageProps = {
  isLoggedIn: boolean;
  cashFlowType: CashFlowType;
}

export default function CashFlowCategoriesPage(props: CashFlowCategoriesPageProps) {
  const [cashFlowCategories, setCashFlowCategories] = useState<CashFlowCategory[]>([]);
  const [editingCashFlowCategory, setEditingCashFlowCategory] = useState<CashFlowCategory | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string>("");

  function onChange(name: string) {
    setEditingCashFlowCategory(prev => prev ? { ...prev, name } : { name, categoryType: props.cashFlowType })
  }

  async function handleSubmit(formData: FormData) {
    const nameValue = formData.get("Name") as string;
    const cashFlowEntry: CashFlowCategory = { name: nameValue, categoryType: props.cashFlowType };
    let response = null
    const idValue = formData.get("Id");
    if (idValue)
      response = await putRequest<CashFlowCategory>("CashFlowCategories", idValue as string, cashFlowEntry);
    else
      response = await postRequest<CashFlowCategory>("CashFlowCategories", cashFlowEntry);
    const actionVerb: string = idValue == null ? "create" : "update";
    if (!response.successful)
      setMessage(`Failed to ${actionVerb} ${props.cashFlowType} category: "` + response.responseMessage);
    else {
      setMessage(`${props.cashFlowType} category ${actionVerb}d successfully.`);
      fetchCashFlowCategories();
      setEditingCashFlowCategory(null)
    }
  }

  function onCategoryIsEditing(category: CashFlowCategory){
    setEditingCashFlowCategory(category);
  }

  async function fetchCashFlowCategories() {
    setIsLoading(true);
    const response = await getRequest<CashFlowCategory>(`CashFlowCategories?cashFlowType=${props.cashFlowType}`);
    setCashFlowCategories(response.data as CashFlowCategory[]);
    if (!response.successful) {
      setIsError(true);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchCashFlowCategories();
  }, []);

  if (!props.isLoggedIn)
    return <p>Please log in to manage cash flow categories.</p>;

  return (
    <div className="flex gap-6 p-6">
      <CashflowSideBar />
      <CashFlowCategoriesForm
        handleSubmit={handleSubmit}
        editingCashFlowCategory={editingCashFlowCategory}
        onNameChange={onChange}
        onReset={() => setEditingCashFlowCategory(null)}
        infoMessage={isError ? "" : message}
        errorMessage={isError ? message : ""}
        cashFlowType={props.cashFlowType}
      />
      <CashFlowCategoriesList
        categories={cashFlowCategories}
        onCategoryDeleted={fetchCashFlowCategories}
        onCategoryIsEditing={onCategoryIsEditing}
        isLoading={isLoading}
        isError={isError}
        cashFlowType={props.cashFlowType}
      />
    </div>
  )
}