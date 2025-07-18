import React, { ChangeEventHandler } from 'react'
import FormTemplate from '../../../components/form/FormTemplate';
import UpdateCreateButton from '../../../components/buttons/UpdateCreateButton';
import ResetButton from '../../../components/buttons/ResetButton';
import { CashFlowType } from '../CashFlowType';
import CashFlowEntriesInputs from './CashFlowEntriesInputs';
import { CashFlowEntryFormData } from './CashFlowEntryFormData';

interface CashFlowEntriesFormProps {
  handleSubmit: (formData: FormData) => void;
  editingFormData: Partial<CashFlowEntryFormData>;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onReset: () => void;
  infoMessage: string;
  errorMessage: string;
  isLoading: boolean;
  isSubmitting: boolean;
  cashFlowType: CashFlowType;
}

export default function CashFlowEntriesForm(props : CashFlowEntriesFormProps) {

  const formHeader: string = props.editingFormData?.id ? `Edit ${props.cashFlowType} Entry` : `New ${props.cashFlowType} Entry`;

  const inputs: React.ReactElement = 
    <CashFlowEntriesInputs
      editingFormData={props.editingFormData}
      onChange={props.onChange}
      cashFlowType={props.cashFlowType}
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
      formId="cashflow-entries-form"
    />
  )
}
