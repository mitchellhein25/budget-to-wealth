import { putRequest } from "@/app/lib/api/rest-methods/putRequest";
import { postRequest } from "@/app/lib/api/rest-methods/postRequest";
import { MessageState } from "../../Utils";

export const handleFormSubmit = async <T, U>(
  formData: FormData, 
  transformFormDataToItem: (formData: FormData) => { item: T, errors: string[] },
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setMessage: React.Dispatch<React.SetStateAction<MessageState>>,
  setErrorMessage: (message: string, type: 'form' | 'list') => void,
  setInfoMessage: (message: string, type: 'form' | 'list') => void,
  fetchItems: () => Promise<void>,
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<U>>>,
  itemName: string,
  itemEndpoint: string
) => {
  const itemNameString: string = itemName.toString().toLocaleLowerCase();
  const itemNameNoSpaces: string = itemName.replace(/\s+/g, '-').toLocaleLowerCase();
  try {
    setIsSubmitting(true);
    setMessage({ type: null, text: '' });

    const { item, errors } = transformFormDataToItem(formData);
    if (!item || errors.length > 0) {
      setErrorMessage(errors.join(', '), 'form');
      return;
    }

    const idValue = formData.get(`${itemNameNoSpaces}-id`) as string;
    const isEditing = Boolean(idValue);

    const response = isEditing
      ? await putRequest<T>(itemEndpoint, idValue, item)
      : await postRequest<T>(itemEndpoint, item);

    if (!response.successful) {
      const action = isEditing ? "update" : "create";
      setErrorMessage(`Failed to ${action} ${itemNameString}: ${response.responseMessage}`, 'form');
      return;
    }

    await fetchItems();
    setEditingFormData({});
    const action = isEditing ? "updated" : "created";
    setInfoMessage(`${itemName} ${action} successfully.`, 'form');

  } catch (error) {
    setErrorMessage("An unexpected error occurred. Please try again.", 'form');
    console.error("Submit error:", error);
  } finally {
    setIsSubmitting(false);
  }
};