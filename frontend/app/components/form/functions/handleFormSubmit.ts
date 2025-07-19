import { putRequest } from "@/app/lib/api/rest-methods/putRequest";
import { postRequest } from "@/app/lib/api/rest-methods/postRequest";
import { MessageState, replaceSpacesWithDashes } from "../../Utils";

type HandleFormSubmitArgs<T, FormDataT> = {
  formData: FormData,
  transformFormDataToItem: (formData: FormData) => { item: T, errors: string[] },
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>,
  setMessage: React.Dispatch<React.SetStateAction<MessageState>>,
  fetchItems: () => void,
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<FormDataT>>>,
  itemName: string,
  itemEndpoint: string
}

export const handleFormSubmit = async <T, FormDataT>(
  args: HandleFormSubmitArgs<T, FormDataT>
) => {

  const setErrorMessage = (message: string) => args.setMessage({ type: "ERROR", text: message });

  const itemNameString: string = args.itemName.toLocaleLowerCase();
  const itemNameNoSpaces: string = replaceSpacesWithDashes(itemNameString);
  try {
    args.setIsSubmitting(true);
    args.setMessage({ type: null, text: '' });

    const { item, errors } = args.transformFormDataToItem(args.formData);
    if (!item || errors.length > 0) {
      setErrorMessage(errors.join(', '));
      return;
    }

    const idValue = args.formData.get(`${itemNameNoSpaces}-id`) as string;
    const isEditing = Boolean(idValue);

    const response = isEditing
      ? await putRequest<T>(args.itemEndpoint, idValue, item)
      : await postRequest<T>(args.itemEndpoint, item);

    if (!response.successful) {
      const action = isEditing ? "update" : "create";
      setErrorMessage(`Failed to ${action} ${itemNameString}: ${response.responseMessage}`);
      return;
    }

    await args.fetchItems();
    args.setEditingFormData({});
    const action = isEditing ? "updated" : "created";
    args.setMessage({ type: "INFO", text: `${args.itemName} ${action} successfully.` });

  } catch (error) {
    setErrorMessage("An unexpected error occurred. Please try again.");
    console.error("Submit error:", error);
  } finally {
    args.setIsSubmitting(false);
  }
};