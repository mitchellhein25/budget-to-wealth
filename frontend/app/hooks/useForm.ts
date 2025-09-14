'use client';

import { ChangeEventHandler, useState } from "react";
import { cleanCurrencyInput, cleanPercentageInput, MessageState, replaceSpacesWithDashes } from "@/app/lib/utils";
import { handleFormSubmit } from "@/app/components";

export type FormState<T, FormDataT> = {
  isSubmitting: boolean;
  editingFormData: Partial<FormDataT>;
  message: MessageState;
  onChange: ChangeEventHandler<HTMLInputElement>;
  handleSubmit: (formData: FormData) => void;
  onItemIsEditing: (item: T) => void;
  onReset: () => void;
}

export type useFormArgs<T, FormDataT> = {
  itemName: string;
  itemEndpoint: string;
  transformFormDataToItem: (formData: FormData) => { item: T | null; errors: string[] };
  convertItemToFormData: (item: T) => FormDataT;
  fetchItems: () => void;
}

export const useForm = <T, FormDataT>(
  args: useFormArgs<T, FormDataT>
): FormState<T, FormDataT> => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [editingFormData, setEditingFormData] = useState<Partial<FormDataT>>({});
  const [message, setMessage] = useState<MessageState>({ type: null, text: '' });

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { value, name } = event.target;
    const fieldName = name.replace(`${replaceSpacesWithDashes(args.itemName).toLocaleLowerCase()}-`, '');
    let cleanedValue: string | null = value;
    const currencyFields = ["amount", "balance", "endHoldingSnapshotBalance", "totalContributions", "totalWithdrawals"];
    if (currencyFields.includes(fieldName)) {
      cleanedValue = cleanCurrencyInput(value);
      if (cleanedValue == null)
        return;
    }
    if (fieldName === "manualInvestmentPercentageReturn") {
      cleanedValue = cleanPercentageInput(value);
      if (cleanedValue == null)
        return;
    }
    setEditingFormData(
        prev => prev ? 
        { ...prev, [fieldName]: cleanedValue } : 
        { [fieldName]: cleanedValue } as FormDataT)
  }

  const handleSubmit = (formData: FormData) => {
		handleFormSubmit<T | null, FormDataT>(
      {
        formData,
        transformFormDataToItem: (formData) => args.transformFormDataToItem(formData),
        setIsSubmitting,
        setMessage,
        fetchItems: args.fetchItems,
        setEditingFormData,
        itemName: args.itemName,
        itemEndpoint: args.itemEndpoint
      }
	);
  };

  const onItemIsEditing = (item: T) => {
		setEditingFormData(args.convertItemToFormData(item));
		setMessage({ type: null, text: '' });
	};

  const onReset = () => {
		setEditingFormData({});
		setMessage({ type: null, text: '' });
	};
  
  return {
    isSubmitting,
    editingFormData,
    message,
    onChange,
    handleSubmit,
    onItemIsEditing,
    onReset
  }
}