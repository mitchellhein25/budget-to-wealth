import { HoldingSnapshotFormSchema } from "../HoldingSnapshotFormData";

export const getHoldingSnapshotValidationResult = (formData: FormData) => {
  const rawData = {
    id: formData.get(`holding-snapshot-id`) as string || undefined,
    holdingId: formData.get(`holding-snapshot-holdingId`) as string || "",
    date: new Date(formData.get(`holding-snapshot-date`) as string),
    balance: formData.get(`holding-snapshot-balance`) as string,
  };

  return HoldingSnapshotFormSchema.safeParse(rawData);
}