'use client';

import { useEffect, useState } from "react";
import { deleteRequest } from "@/app/lib/api/rest-methods/deleteRequest";
import { putRequest } from "@/app/lib/api/rest-methods/putRequest";
import { ExpenseCategory } from "@/app/lib/models/ExpenseCategory";
import { getRequest } from "@/app/lib/api/rest-methods/getRequest";
import ListTemplate from "@/app/ui/components/list-template/ListTemplate";
import FormTemplate from "@/app/ui/components/form-template/FormTemplate";
import { postRequest } from "@/app/lib/api/rest-methods/postRequest";

interface ExpenseCategoriesProps {
  isLoggedIn: boolean;
}

export default function ExpenseCategories({ isLoggedIn }: ExpenseCategoriesProps) {
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  
  const nameField: string = 'Name';
  const endpoint: string = 'ExpenseCategories';

  async function fetchExpenseCategories() {
    console.log("Fetching expense categories...");
    const response = await getRequest<ExpenseCategory>(endpoint);
    console.log(response);
    setExpenseCategories(response.data as ExpenseCategory[]);
    if (!response.successful) {
      setErrorMessage(response.responseMessage);
      setIsError(true);
    }
  }

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  async function handleDelete(id: number) {
    await deleteRequest<ExpenseCategory>(endpoint, id);
    setExpenseCategories(prev => prev.filter(cat => cat.id !== id));
  };

  async function handleEdit(expenseCategory: ExpenseCategory) {
    const response = await putRequest<ExpenseCategory>(endpoint, expenseCategory.id as number, expenseCategory);
    if (!response.successful) {
      return;
    } 
    setExpenseCategories(prev => prev.map(cat => {
      if (cat.id === expenseCategory.id) {
        return { ...cat, name: expenseCategory.name };
      } else {
        return cat;
      }
    }));
  }
  
  async function handlePost(formData: FormData) {
    setName('');
    const name = formData.get(nameField) as string;
    const expenseCategory: ExpenseCategory = { name };
    const response = await postRequest<ExpenseCategory>(endpoint, expenseCategory);
    if (!response.successful) 
      setMessage("Failed to create expense category: " + response.responseMessage);
    else {
      setMessage("Expense category created successfully.");
      setExpenseCategories([...expenseCategories, response.data as ExpenseCategory]);
    }
  }

  return (
    <>
      {isLoggedIn && (
        <div>
          <ListTemplate 
            items={expenseCategories}
            itemName="Expense Categories"
            errorMessage={errorMessage}
            isError={isError}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <FormTemplate 
            title='Add a new Expense Category'
            buttonText='Create'
            inputFields={[
              {
                labelString: nameField,
                type: 'text',
                value: name,
                setValue: setName
              }
            ]}
            formMessage={message}
            handleSubmit={handlePost}
          />
        </div>
      )}
    </>
  );
}