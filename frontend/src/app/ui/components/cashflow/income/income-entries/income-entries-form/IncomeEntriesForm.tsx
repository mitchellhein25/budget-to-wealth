import React, { ChangeEventHandler } from 'react'
import FormTemplate from '../../../../FormTemplate';
import UpdateCreateButton from '../../../../buttons/UpdateCreateButton';
import ResetButton from '../../../../buttons/ResetButton';
import IncomeEntriesInputs from './IncomeEntriesInputs';
import { CashFlowEntryFormData } from '../../../cashflow-helpers/CashFlowEntryFormData';

interface IncomeEntriesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingFormData: Partial<CashFlowEntryFormData>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
  isLoading: boolean;
  isSubmitting: boolean;
}

export default function IncomeEntriesForm(props : IncomeEntriesFormProps) {

  const formHeader: string = props.editingFormData?.id ? "Edit Income Entry" : "New Income Entry";

  const inputs: React.ReactElement = 
    <IncomeEntriesInputs
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
    />
  )
}
