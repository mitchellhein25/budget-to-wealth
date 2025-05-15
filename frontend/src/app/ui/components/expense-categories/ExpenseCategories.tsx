'use client';

import { useEffect, useState } from "react";
import { deleteExpenseCategories } from "@/app/lib/api/expense-categories/deleteExpenseCategories";
import { putExpenseCategories } from "@/app/lib/api/expense-categories/putExpenseCategories";
import { ExpenseCategory } from "@/app/lib/models/ExpenseCategory";
import { getExpenseCategories } from "@/app/lib/api/expense-categories/getExpenseCategories";
import ListTemplate from "@/app/ui/components/list-template/ListTemplate";
import FormTemplate from "@/app/ui/components/form-template/FormTemplate";
import { postExpenseCategories } from "@/app/lib/api/expense-categories/postExpenseCategories";

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

  async function fetchExpenseCategories() {
    const response = await getExpenseCategories();
    setExpenseCategories(response.data);
    if (!response.successful) {
      setErrorMessage(response.responseMessage);
      setIsError(true);
    }
  }

  useEffect(() => {
    fetchExpenseCategories();
  }, []);

  async function handleDelete(id: number) {
    await deleteExpenseCategories(id);
    setExpenseCategories(prev => prev.filter(cat => cat.id !== id));
  };

  async function handleEdit(expenseCategory: ExpenseCategory) {
    await putExpenseCategories(expenseCategory);
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
    const response = await postExpenseCategories(expenseCategory);
    if (!response.successful) 
      setMessage("Failed to create expense category: " + response.responseMessage);
    else{
      setMessage("Expense category created successfully.");
    setExpenseCategories([...expenseCategories, response.data]);
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