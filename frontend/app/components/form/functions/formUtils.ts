import { FormState } from "@/app/hooks";

export const formHasAnyValue = <T, TFormData>(formState: FormState<T, TFormData>) => {
    return Object.values(formState.editingFormData ?? {}).some(v => v != null && v !== "");
}