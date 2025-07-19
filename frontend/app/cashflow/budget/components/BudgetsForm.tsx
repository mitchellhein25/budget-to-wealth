import React, { ChangeEventHandler, useState } from 'react'
import FormTemplate from '@/app/components/form/FormTemplate';
import UpdateCreateButton from '@/app/components/buttons/UpdateCreateButton';
import ResetButton from '@/app/components/buttons/ResetButton';
import { BudgetFormData } from './BudgetFormData';
import BudgetInputs from './BudgetInputs';
import { MessageState } from '@/app/components/Utils';

type BudgetsFormProps = {
  handleSubmit: (formData: FormData) => void;
  editingFormData: Partial<BudgetFormData>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
  message: MessageState;
  isSubmitting: boolean;
}

export default function BudgetsForm(props : BudgetsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formHeader: string = props.editingFormData?.id ? `Edit Budget` : `New Budget`;

  const inputs: React.ReactElement = 
    <BudgetInputs
      editingFormData={props.editingFormData}
      onChange={props.onChange}
      setIsLoading={setIsLoading}
    />;

    const buttons: React.ReactElement = (
      <>
        <UpdateCreateButton 
          isUpdateState={props.editingFormData?.id != null} 
          isDisabled={isLoading || props.isSubmitting}
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
      message={props.message}
      formId="budgets-form"
    />
  )
}
