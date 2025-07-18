import React, { ChangeEventHandler } from 'react'
import FormTemplate from '@/app/components/form/FormTemplate';
import UpdateCreateButton from '@/app/components/buttons/UpdateCreateButton';
import ResetButton from '@/app/components/buttons/ResetButton';
import { BudgetFormData } from './BudgetFormData';
import BudgetInputs from './BudgetInputs';

type BudgetsFormProps = {
  handleSubmit: (formData: FormData) => void;
  editingFormData: Partial<BudgetFormData>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
  isLoading: boolean;
  isSubmitting: boolean;
}

export default function BudgetsForm(props : BudgetsFormProps) {

  const formHeader: string = props.editingFormData?.id ? `Edit Budget` : `New Budget`;

  const inputs: React.ReactElement = 
    <BudgetInputs
      editingFormData={props.editingFormData}
      onChange={props.onChange}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton 
          isUpdateState={props.editingFormData?.id != null} 
          isDisabled={props.isLoading || props.isSubmitting}
        />
        <ResetButton 
          onClick={props.onReset}
          isHidden={true}
        />
      </>
    )

  return (
    <FormTemplate
      handleSubmit={props.handleSubmit}
      formHeader={formHeader}
      inputs={inputs}
      buttons={buttons}
      infoMessage={props.infoMessage}
      errorMessage={props.errorMessage}
      formId="budgets-form"
    />
  )
}
