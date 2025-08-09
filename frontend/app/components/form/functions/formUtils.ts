import { FormState } from "@/app/hooks";

export const formHasAnyValue = (formState: FormState<any, any>) => {
    return Object.values(formState.editingFormData ?? {}).some(v => v != null && v !== "");
}