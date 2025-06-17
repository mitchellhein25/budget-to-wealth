import { HoldingFormData } from "../HoldingFormData";

export const holdingFormOnChange = (
  event: React.ChangeEvent<HTMLInputElement>, 
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<HoldingFormData>>>, 
) => {
  let { value } = event.target;
  const fieldName = event.target.name.replace(`holding-`, "");
  setEditingFormData((prev) => ({ ...prev, [fieldName]: value }));
};