import { HoldingFormData } from "@/app/net-worth/holding-snapshots/holdings";

export const holdingFormOnChange = (
  event: React.ChangeEvent<HTMLInputElement>, 
  setEditingFormData: React.Dispatch<React.SetStateAction<Partial<HoldingFormData>>>, 
) => {
  const { value } = event.target;
  const fieldName = event.target.name.replace(`holding-`, "");
  setEditingFormData((prev) => ({ ...prev, [fieldName]: value }));
};