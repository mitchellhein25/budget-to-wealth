import { HoldingFormSchema } from "@/app/net-worth/holding-snapshots/holdings";

export const getHoldingValidationResult = (formData: FormData) => {
  const rawData = {
    id: formData.get(`holding-id`) as string || undefined,
    name: formData.get(`holding-name`) as string,
    type: formData.get(`holding-type`) as string,
    holdingCategoryId: formData.get(`holding-holdingCategoryId`) as string || "",
    institution: formData.get(`holding-institution`) as string || ""
  };

  return HoldingFormSchema.safeParse(rawData);
}